from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
import io
from fastapi.responses import StreamingResponse
import pandas as pd

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

# User Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    password_hash: str
    role: str = "consulta"  # administrador, vendedor, consulta
    full_name: str
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "consulta"
    full_name: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    full_name: Optional[str] = None
    active: Optional[bool] = None
    password: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    full_name: str
    active: bool
    created_at: datetime

# Category Models
class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CategoryCreate(BaseModel):
    name: str
    description: str

# Supplier Models
class Supplier(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    contact_person: str
    phone: str
    email: EmailStr
    address: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SupplierCreate(BaseModel):
    name: str
    contact_person: str
    phone: str
    email: EmailStr
    address: str

# Product Models
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    category_id: str
    supplier_id: str
    price: float
    cost: float
    stock: int
    min_stock: int = 10
    expiration_date: Optional[datetime] = None
    barcode: Optional[str] = None
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    description: str
    category_id: str
    supplier_id: str
    price: float
    cost: float
    stock: int
    min_stock: int = 10
    expiration_date: Optional[datetime] = None
    barcode: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[str] = None
    supplier_id: Optional[str] = None
    price: Optional[float] = None
    cost: Optional[float] = None
    stock: Optional[int] = None
    min_stock: Optional[int] = None
    expiration_date: Optional[datetime] = None
    barcode: Optional[str] = None
    active: Optional[bool] = None

# Customer Models
class Customer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CustomerCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    address: Optional[str] = None

# Sale Models
class SaleDetail(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    unit_price: float
    subtotal: float

class Sale(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_id: Optional[str] = None
    customer_name: str
    user_id: str
    user_name: str
    details: List[SaleDetail]
    subtotal: float
    tax: float = 0.0
    discount: float = 0.0
    total: float
    payment_method: str = "efectivo"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SaleCreate(BaseModel):
    customer_id: Optional[str] = None
    customer_name: str
    details: List[SaleDetail]
    tax: float = 0.0
    discount: float = 0.0
    payment_method: str = "efectivo"

# Inventory Movement Models
class InventoryMovement(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    product_name: str
    movement_type: str  # entrada, salida, ajuste
    quantity: int
    reason: str
    user_id: str
    user_name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InventoryMovementCreate(BaseModel):
    product_id: str
    movement_type: str
    quantity: int
    reason: str

# ==================== AUTHENTICATION ====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return User(**user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_role(required_roles: List[str]):
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in required_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker

# ==================== AUTHENTICATION ENDPOINTS ====================

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"username": credentials.username}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.get("active", True):
        raise HTTPException(status_code=401, detail="User is inactive")
    
    access_token = create_access_token({"sub": user["id"], "role": user["role"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**user).model_dump()
    }

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(**current_user.model_dump())

# ==================== USER ENDPOINTS ====================

@api_router.post("/users", response_model=UserResponse)
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(require_role(["administrador"]))
):
    # Check if user already exists
    existing = await db.users.find_one({"username": user_data.username}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    existing_email = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        role=user_data.role,
        full_name=user_data.full_name
    )
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    return UserResponse(**user.model_dump())

@api_router.get("/users", response_model=List[UserResponse])
async def get_users(current_user: User = Depends(require_role(["administrador"]))):
    users = await db.users.find({}, {"_id": 0}).to_list(1000)
    for user in users:
        if isinstance(user['created_at'], str):
            user['created_at'] = datetime.fromisoformat(user['created_at'])
    return [UserResponse(**u) for u in users]

@api_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user: User = Depends(require_role(["administrador"]))
):
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if isinstance(user['created_at'], str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    return UserResponse(**user)

@api_router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    current_user: User = Depends(require_role(["administrador"]))
):
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_data.model_dump(exclude_unset=True)
    if "password" in update_data:
        update_data["password_hash"] = hash_password(update_data.pop("password"))
    
    if update_data:
        await db.users.update_one({"id": user_id}, {"$set": update_data})
        user.update(update_data)
    
    if isinstance(user['created_at'], str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    return UserResponse(**user)

@api_router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(require_role(["administrador"]))
):
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

# ==================== CATEGORY ENDPOINTS ====================

@api_router.post("/categories", response_model=Category)
async def create_category(
    category_data: CategoryCreate,
    current_user: User = Depends(require_role(["administrador", "vendedor"]))
):
    category = Category(**category_data.model_dump())
    doc = category.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.categories.insert_one(doc)
    return category

@api_router.get("/categories", response_model=List[Category])
async def get_categories(current_user: User = Depends(get_current_user)):
    categories = await db.categories.find({}, {"_id": 0}).to_list(1000)
    for cat in categories:
        if 'created_at' in cat and isinstance(cat['created_at'], str):
            cat['created_at'] = datetime.fromisoformat(cat['created_at'])
        elif 'created_at' not in cat:
            cat['created_at'] = datetime.now(timezone.utc)
    return categories

@api_router.get("/categories/{category_id}", response_model=Category)
async def get_category(category_id: str, current_user: User = Depends(get_current_user)):
    category = await db.categories.find_one({"id": category_id}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    if 'created_at' in category and isinstance(category['created_at'], str):
        category['created_at'] = datetime.fromisoformat(category['created_at'])
    elif 'created_at' not in category:
        category['created_at'] = datetime.now(timezone.utc)
    return category

@api_router.put("/categories/{category_id}", response_model=Category)
async def update_category(
    category_id: str,
    category_data: CategoryCreate,
    current_user: User = Depends(require_role(["administrador", "vendedor"]))
):
    category = await db.categories.find_one({"id": category_id}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category_data.model_dump()
    await db.categories.update_one({"id": category_id}, {"$set": update_data})
    category.update(update_data)
    
    if 'created_at' in category and isinstance(category['created_at'], str):
        category['created_at'] = datetime.fromisoformat(category['created_at'])
    elif 'created_at' not in category:
        category['created_at'] = datetime.now(timezone.utc)
    return category

@api_router.delete("/categories/{category_id}")
async def delete_category(
    category_id: str,
    current_user: User = Depends(require_role(["administrador"]))
):
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}

# ==================== SUPPLIER ENDPOINTS ====================

@api_router.post("/suppliers", response_model=Supplier)
async def create_supplier(
    supplier_data: SupplierCreate,
    current_user: User = Depends(require_role(["administrador", "vendedor"]))
):
    supplier = Supplier(**supplier_data.model_dump())
    doc = supplier.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.suppliers.insert_one(doc)
    return supplier

@api_router.get("/suppliers", response_model=List[Supplier])
async def get_suppliers(current_user: User = Depends(get_current_user)):
    suppliers = await db.suppliers.find({}, {"_id": 0}).to_list(1000)
    for sup in suppliers:
        if 'created_at' in sup and isinstance(sup['created_at'], str):
            sup['created_at'] = datetime.fromisoformat(sup['created_at'])
        elif 'created_at' not in sup:
            sup['created_at'] = datetime.now(timezone.utc)
    return suppliers

@api_router.get("/suppliers/{supplier_id}", response_model=Supplier)
async def get_supplier(supplier_id: str, current_user: User = Depends(get_current_user)):
    supplier = await db.suppliers.find_one({"id": supplier_id}, {"_id": 0})
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    if 'created_at' in supplier and isinstance(supplier['created_at'], str):
        supplier['created_at'] = datetime.fromisoformat(supplier['created_at'])
    elif 'created_at' not in supplier:
        supplier['created_at'] = datetime.now(timezone.utc)
    return supplier

@api_router.put("/suppliers/{supplier_id}", response_model=Supplier)
async def update_supplier(
    supplier_id: str,
    supplier_data: SupplierCreate,
    current_user: User = Depends(require_role(["administrador", "vendedor"]))
):
    supplier = await db.suppliers.find_one({"id": supplier_id}, {"_id": 0})
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    update_data = supplier_data.model_dump()
    await db.suppliers.update_one({"id": supplier_id}, {"$set": update_data})
    supplier.update(update_data)
    
    if 'created_at' in supplier and isinstance(supplier['created_at'], str):
        supplier['created_at'] = datetime.fromisoformat(supplier['created_at'])
    elif 'created_at' not in supplier:
        supplier['created_at'] = datetime.now(timezone.utc)
    return supplier

@api_router.delete("/suppliers/{supplier_id}")
async def delete_supplier(
    supplier_id: str,
    current_user: User = Depends(require_role(["administrador"]))
):
    result = await db.suppliers.delete_one({"id": supplier_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return {"message": "Supplier deleted successfully"}

# ==================== PRODUCT ENDPOINTS ====================

@api_router.post("/products", response_model=Product)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(require_role(["administrador", "vendedor"]))
):
    product = Product(**product_data.model_dump())
    doc = product.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    if doc['expiration_date']:
        doc['expiration_date'] = doc['expiration_date'].isoformat()
    await db.products.insert_one(doc)
    return product

@api_router.get("/products", response_model=List[Product])
async def get_products(current_user: User = Depends(get_current_user)):
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    for prod in products:
        if 'created_at' in prod and isinstance(prod['created_at'], str):
            prod['created_at'] = datetime.fromisoformat(prod['created_at'])
        elif 'created_at' not in prod:
            prod['created_at'] = datetime.now(timezone.utc)
        if prod.get('expiration_date') and isinstance(prod['expiration_date'], str):
            prod['expiration_date'] = datetime.fromisoformat(prod['expiration_date'])
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str, current_user: User = Depends(get_current_user)):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if 'created_at' in product and isinstance(product['created_at'], str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    elif 'created_at' not in product:
        product['created_at'] = datetime.now(timezone.utc)
    if product.get('expiration_date') and isinstance(product['expiration_date'], str):
        product['expiration_date'] = datetime.fromisoformat(product['expiration_date'])
    return product

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    current_user: User = Depends(require_role(["administrador", "vendedor"]))
):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_data.model_dump(exclude_unset=True)
    if 'expiration_date' in update_data and update_data['expiration_date']:
        update_data['expiration_date'] = update_data['expiration_date'].isoformat()
    
    if update_data:
        await db.products.update_one({"id": product_id}, {"$set": update_data})
        product.update(update_data)
    
    if 'created_at' in product and isinstance(product['created_at'], str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    elif 'created_at' not in product:
        product['created_at'] = datetime.now(timezone.utc)
    if product.get('expiration_date') and isinstance(product['expiration_date'], str):
        product['expiration_date'] = datetime.fromisoformat(product['expiration_date'])
    return product

@api_router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    current_user: User = Depends(require_role(["administrador"]))
):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# ==================== CUSTOMER ENDPOINTS ====================

@api_router.post("/customers", response_model=Customer)
async def create_customer(
    customer_data: CustomerCreate,
    current_user: User = Depends(require_role(["administrador", "vendedor"]))
):
    customer = Customer(**customer_data.model_dump())
    doc = customer.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.customers.insert_one(doc)
    return customer

@api_router.get("/customers", response_model=List[Customer])
async def get_customers(current_user: User = Depends(get_current_user)):
    customers = await db.customers.find({}, {"_id": 0}).to_list(1000)
    for cust in customers:
        if 'created_at' in cust and isinstance(cust['created_at'], str):
            cust['created_at'] = datetime.fromisoformat(cust['created_at'])
        elif 'created_at' not in cust:
            cust['created_at'] = datetime.now(timezone.utc)
    return customers

@api_router.get("/customers/{customer_id}", response_model=Customer)
async def get_customer(customer_id: str, current_user: User = Depends(get_current_user)):
    customer = await db.customers.find_one({"id": customer_id}, {"_id": 0})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if 'created_at' in customer and isinstance(customer['created_at'], str):
        customer['created_at'] = datetime.fromisoformat(customer['created_at'])
    elif 'created_at' not in customer:
        customer['created_at'] = datetime.now(timezone.utc)
    return customer

@api_router.put("/customers/{customer_id}", response_model=Customer)
async def update_customer(
    customer_id: str,
    customer_data: CustomerCreate,
    current_user: User = Depends(require_role(["administrador", "vendedor"]))
):
    customer = await db.customers.find_one({"id": customer_id}, {"_id": 0})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    update_data = customer_data.model_dump()
    await db.customers.update_one({"id": customer_id}, {"$set": update_data})
    customer.update(update_data)
    
    if 'created_at' in customer and isinstance(customer['created_at'], str):
        customer['created_at'] = datetime.fromisoformat(customer['created_at'])
    elif 'created_at' not in customer:
        customer['created_at'] = datetime.now(timezone.utc)
    return customer

@api_router.delete("/customers/{customer_id}")
async def delete_customer(
    customer_id: str,
    current_user: User = Depends(require_role(["administrador"]))
):
    result = await db.customers.delete_one({"id": customer_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Customer deleted successfully"}

# ==================== SALE ENDPOINTS ====================

@api_router.post("/sales", response_model=Sale)
async def create_sale(
    sale_data: SaleCreate,
    current_user: User = Depends(require_role(["administrador", "vendedor"]))
):
    # Calculate totals
    subtotal = sum(detail.subtotal for detail in sale_data.details)
    total = subtotal + sale_data.tax - sale_data.discount
    
    sale = Sale(
        customer_id=sale_data.customer_id,
        customer_name=sale_data.customer_name,
        user_id=current_user.id,
        user_name=current_user.full_name,
        details=sale_data.details,
        subtotal=subtotal,
        tax=sale_data.tax,
        discount=sale_data.discount,
        total=total,
        payment_method=sale_data.payment_method
    )
    
    # Update product stock
    for detail in sale_data.details:
        product = await db.products.find_one({"id": detail.product_id}, {"_id": 0})
        if product:
            new_stock = product['stock'] - detail.quantity
            await db.products.update_one({"id": detail.product_id}, {"$set": {"stock": new_stock}})
            
            # Create inventory movement
            movement = InventoryMovement(
                product_id=detail.product_id,
                product_name=detail.product_name,
                movement_type="salida",
                quantity=detail.quantity,
                reason=f"Venta #{sale.id[:8]}",
                user_id=current_user.id,
                user_name=current_user.full_name
            )
            movement_doc = movement.model_dump()
            movement_doc['created_at'] = movement_doc['created_at'].isoformat()
            await db.inventory_movements.insert_one(movement_doc)
    
    doc = sale.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.sales.insert_one(doc)
    return sale

@api_router.get("/sales", response_model=List[Sale])
async def get_sales(current_user: User = Depends(get_current_user)):
    sales = await db.sales.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for sale in sales:
        if isinstance(sale['created_at'], str):
            sale['created_at'] = datetime.fromisoformat(sale['created_at'])
    return sales

@api_router.get("/sales/{sale_id}", response_model=Sale)
async def get_sale(sale_id: str, current_user: User = Depends(get_current_user)):
    sale = await db.sales.find_one({"id": sale_id}, {"_id": 0})
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    if isinstance(sale['created_at'], str):
        sale['created_at'] = datetime.fromisoformat(sale['created_at'])
    return sale

# ==================== INVENTORY MOVEMENT ENDPOINTS ====================

@api_router.post("/inventory-movements", response_model=InventoryMovement)
async def create_inventory_movement(
    movement_data: InventoryMovementCreate,
    current_user: User = Depends(require_role(["administrador", "vendedor"]))
):
    product = await db.products.find_one({"id": movement_data.product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    movement = InventoryMovement(
        product_id=movement_data.product_id,
        product_name=product['name'],
        movement_type=movement_data.movement_type,
        quantity=movement_data.quantity,
        reason=movement_data.reason,
        user_id=current_user.id,
        user_name=current_user.full_name
    )
    
    # Update product stock
    if movement_data.movement_type == "entrada":
        new_stock = product['stock'] + movement_data.quantity
    elif movement_data.movement_type == "salida":
        new_stock = product['stock'] - movement_data.quantity
    else:  # ajuste
        new_stock = movement_data.quantity
    
    await db.products.update_one({"id": movement_data.product_id}, {"$set": {"stock": new_stock}})
    
    doc = movement.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.inventory_movements.insert_one(doc)
    return movement

@api_router.get("/inventory-movements", response_model=List[InventoryMovement])
async def get_inventory_movements(current_user: User = Depends(get_current_user)):
    movements = await db.inventory_movements.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for mov in movements:
        if isinstance(mov['created_at'], str):
            mov['created_at'] = datetime.fromisoformat(mov['created_at'])
    return movements

# ==================== DASHBOARD ENDPOINTS ====================

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Total sales today
    sales_today = await db.sales.find({
        "created_at": {"$gte": today.isoformat()}
    }, {"_id": 0}).to_list(1000)
    total_sales_today = sum(sale['total'] for sale in sales_today)
    
    # Low stock products
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    low_stock_count = len([p for p in products if p['stock'] <= p['min_stock'] and p['active']])
    
    # Total products
    total_products = len([p for p in products if p['active']])
    
    # Total customers
    total_customers = await db.customers.count_documents({})
    
    # Sales this month
    first_day_month = today.replace(day=1)
    sales_month = await db.sales.find({
        "created_at": {"$gte": first_day_month.isoformat()}
    }, {"_id": 0}).to_list(1000)
    total_sales_month = sum(sale['total'] for sale in sales_month)
    
    return {
        "total_sales_today": round(total_sales_today, 2),
        "low_stock_count": low_stock_count,
        "total_products": total_products,
        "total_customers": total_customers,
        "total_sales_month": round(total_sales_month, 2),
        "sales_count_today": len(sales_today)
    }

@api_router.get("/dashboard/sales-chart")
async def get_sales_chart(current_user: User = Depends(get_current_user)):
    # Get last 30 days of sales
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    sales = await db.sales.find({
        "created_at": {"$gte": thirty_days_ago.isoformat()}
    }, {"_id": 0}).to_list(1000)
    
    # Group by date
    sales_by_date = {}
    for sale in sales:
        date_str = sale['created_at'][:10] if isinstance(sale['created_at'], str) else sale['created_at'].isoformat()[:10]
        if date_str not in sales_by_date:
            sales_by_date[date_str] = 0
        sales_by_date[date_str] += sale['total']
    
    # Sort by date
    sorted_data = sorted(sales_by_date.items())
    
    return {
        "labels": [item[0] for item in sorted_data],
        "values": [round(item[1], 2) for item in sorted_data]
    }

@api_router.get("/dashboard/top-products")
async def get_top_products(current_user: User = Depends(get_current_user)):
    sales = await db.sales.find({}, {"_id": 0}).to_list(1000)
    
    # Count product quantities
    product_quantities = {}
    for sale in sales:
        for detail in sale['details']:
            if detail['product_id'] not in product_quantities:
                product_quantities[detail['product_id']] = {
                    'name': detail['product_name'],
                    'quantity': 0
                }
            product_quantities[detail['product_id']]['quantity'] += detail['quantity']
    
    # Sort by quantity
    sorted_products = sorted(product_quantities.items(), key=lambda x: x[1]['quantity'], reverse=True)[:10]
    
    return {
        "labels": [item[1]['name'] for item in sorted_products],
        "values": [item[1]['quantity'] for item in sorted_products]
    }

# ==================== REPORT ENDPOINTS ====================

@api_router.get("/reports/sales-report")
async def get_sales_report(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    export: bool = False,
    current_user: User = Depends(get_current_user)
):
    query = {}
    if start_date and end_date:
        query["created_at"] = {"$gte": start_date, "$lte": end_date}
    
    sales = await db.sales.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    if export:
        # Export to Excel
        data = []
        for sale in sales:
            for detail in sale['details']:
                data.append({
                    'Fecha': sale['created_at'][:10] if isinstance(sale['created_at'], str) else sale['created_at'].isoformat()[:10],
                    'ID Venta': sale['id'][:8],
                    'Cliente': sale['customer_name'],
                    'Producto': detail['product_name'],
                    'Cantidad': detail['quantity'],
                    'Precio Unitario': detail['unit_price'],
                    'Subtotal': detail['subtotal'],
                    'Total Venta': sale['total'],
                    'Vendedor': sale['user_name']
                })
        
        df = pd.DataFrame(data)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, sheet_name='Ventas', index=False)
        output.seek(0)
        
        return StreamingResponse(
            output,
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={'Content-Disposition': 'attachment; filename=reporte_ventas.xlsx'}
        )
    
    return sales

@api_router.get("/reports/inventory-report")
async def get_inventory_report(
    export: bool = False,
    current_user: User = Depends(get_current_user)
):
    products = await db.products.find({"active": True}, {"_id": 0}).to_list(1000)
    
    if export:
        # Get category and supplier names
        categories = {c['id']: c['name'] for c in await db.categories.find({}, {"_id": 0}).to_list(1000)}
        suppliers = {s['id']: s['name'] for s in await db.suppliers.find({}, {"_id": 0}).to_list(1000)}
        
        data = []
        for product in products:
            data.append({
                'Código': product['id'][:8],
                'Nombre': product['name'],
                'Categoría': categories.get(product['category_id'], 'N/A'),
                'Proveedor': suppliers.get(product['supplier_id'], 'N/A'),
                'Precio': product['price'],
                'Costo': product['cost'],
                'Stock': product['stock'],
                'Stock Mínimo': product['min_stock'],
                'Estado Stock': 'Bajo' if product['stock'] <= product['min_stock'] else 'Normal'
            })
        
        df = pd.DataFrame(data)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, sheet_name='Inventario', index=False)
        output.seek(0)
        
        return StreamingResponse(
            output,
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={'Content-Disposition': 'attachment; filename=reporte_inventario.xlsx'}
        )
    
    return products

@api_router.get("/reports/expiring-products")
async def get_expiring_products(
    days: int = 30,
    export: bool = False,
    current_user: User = Depends(get_current_user)
):
    today = datetime.now(timezone.utc)
    future_date = today + timedelta(days=days)
    
    products = await db.products.find({
        "active": True,
        "expiration_date": {"$ne": None}
    }, {"_id": 0}).to_list(1000)
    
    expiring_products = []
    for product in products:
        exp_date_str = product.get('expiration_date')
        if exp_date_str:
            exp_date = datetime.fromisoformat(exp_date_str) if isinstance(exp_date_str, str) else exp_date_str
            if today <= exp_date <= future_date:
                product['expiration_date'] = exp_date
                expiring_products.append(product)
    
    if export:
        data = []
        for product in expiring_products:
            days_until_expiry = (product['expiration_date'] - today).days
            data.append({
                'Código': product['id'][:8],
                'Nombre': product['name'],
                'Fecha Vencimiento': product['expiration_date'].strftime('%Y-%m-%d'),
                'Días hasta vencer': days_until_expiry,
                'Stock': product['stock'],
                'Precio': product['price']
            })
        
        df = pd.DataFrame(data)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, sheet_name='Productos por Vencer', index=False)
        output.seek(0)
        
        return StreamingResponse(
            output,
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={'Content-Disposition': 'attachment; filename=reporte_productos_vencer.xlsx'}
        )
    
    return expiring_products

@api_router.get("/reports/top-selling")
async def get_top_selling(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = 10,
    export: bool = False,
    current_user: User = Depends(get_current_user)
):
    query = {}
    if start_date and end_date:
        query["created_at"] = {"$gte": start_date, "$lte": end_date}
    
    sales = await db.sales.find(query, {"_id": 0}).to_list(1000)
    
    # Count product quantities and revenue
    product_stats = {}
    for sale in sales:
        for detail in sale['details']:
            if detail['product_id'] not in product_stats:
                product_stats[detail['product_id']] = {
                    'name': detail['product_name'],
                    'quantity': 0,
                    'revenue': 0
                }
            product_stats[detail['product_id']]['quantity'] += detail['quantity']
            product_stats[detail['product_id']]['revenue'] += detail['subtotal']
    
    # Sort by quantity
    sorted_products = sorted(product_stats.items(), key=lambda x: x[1]['quantity'], reverse=True)[:limit]
    
    if export:
        data = []
        for product_id, stats in sorted_products:
            data.append({
                'Producto': stats['name'],
                'Cantidad Vendida': stats['quantity'],
                'Ingresos Generados': round(stats['revenue'], 2)
            })
        
        df = pd.DataFrame(data)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, sheet_name='Productos Más Vendidos', index=False)
        output.seek(0)
        
        return StreamingResponse(
            output,
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={'Content-Disposition': 'attachment; filename=reporte_mas_vendidos.xlsx'}
        )
    
    return [{'product_id': pid, **stats} for pid, stats in sorted_products]

@api_router.get("/reports/inventory-movements")
async def get_inventory_movements_report(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    export: bool = False,
    current_user: User = Depends(get_current_user)
):
    query = {}
    if start_date and end_date:
        query["created_at"] = {"$gte": start_date, "$lte": end_date}
    
    movements = await db.inventory_movements.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    if export:
        data = []
        for movement in movements:
            data.append({
                'Fecha': movement['created_at'][:10] if isinstance(movement['created_at'], str) else movement['created_at'],
                'Producto': movement['product_name'],
                'Tipo': movement['movement_type'].capitalize(),
                'Cantidad': movement['quantity'],
                'Razón': movement['reason'],
                'Usuario': movement['user_name']
            })
        
        df = pd.DataFrame(data)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, sheet_name='Movimientos', index=False)
        output.seek(0)
        
        return StreamingResponse(
            output,
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={'Content-Disposition': 'attachment; filename=reporte_movimientos.xlsx'}
        )
    
    return movements

@api_router.get("/reports/transactions")
async def get_transactions_report(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    export: bool = False,
    current_user: User = Depends(get_current_user)
):
    query = {}
    if start_date and end_date:
        query["created_at"] = {"$gte": start_date, "$lte": end_date}
    
    sales = await db.sales.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    if export:
        data = []
        for sale in sales:
            data.append({
                'Fecha': sale['created_at'][:10] if isinstance(sale['created_at'], str) else sale['created_at'],
                'ID Transacción': sale['id'][:8],
                'Cliente': sale['customer_name'],
                'Subtotal': sale['subtotal'],
                'Impuesto': sale['tax'],
                'Descuento': sale['discount'],
                'Total': sale['total'],
                'Método de Pago': sale['payment_method'].capitalize(),
                'Vendedor': sale['user_name']
            })
        
        df = pd.DataFrame(data)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, sheet_name='Transacciones', index=False)
        output.seek(0)
        
        return StreamingResponse(
            output,
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={'Content-Disposition': 'attachment; filename=reporte_transacciones.xlsx'}
        )
    
    return sales

# ==================== DATABASE BACKUP/RESTORE ====================

@api_router.get("/database/backup")
async def backup_database(current_user: User = Depends(require_role(["administrador"]))):
    try:
        # Export all collections
        backup_data = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'users': await db.users.find({}, {"_id": 0}).to_list(1000),
            'categories': await db.categories.find({}, {"_id": 0}).to_list(1000),
            'suppliers': await db.suppliers.find({}, {"_id": 0}).to_list(1000),
            'products': await db.products.find({}, {"_id": 0}).to_list(1000),
            'customers': await db.customers.find({}, {"_id": 0}).to_list(1000),
            'sales': await db.sales.find({}, {"_id": 0}).to_list(1000),
            'inventory_movements': await db.inventory_movements.find({}, {"_id": 0}).to_list(1000)
        }
        
        # Convert datetime objects to strings
        def convert_datetime(obj):
            if isinstance(obj, dict):
                return {k: convert_datetime(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_datetime(item) for item in obj]
            elif isinstance(obj, datetime):
                return obj.isoformat()
            return obj
        
        backup_data = convert_datetime(backup_data)
        
        import json
        json_data = json.dumps(backup_data, indent=2, ensure_ascii=False)
        
        return StreamingResponse(
            io.BytesIO(json_data.encode('utf-8')),
            media_type='application/json',
            headers={'Content-Disposition': f'attachment; filename=backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backup failed: {str(e)}")

@api_router.post("/database/restore")
async def restore_database(
    backup_file: dict,
    current_user: User = Depends(require_role(["administrador"]))
):
    try:
        # Restore collections
        for collection_name, documents in backup_file.items():
            if collection_name == 'timestamp':
                continue
            collection = db[collection_name]
            if documents:
                await collection.delete_many({})
                await collection.insert_many(documents)
        
        return {"message": "Database restored successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Restore failed: {str(e)}")

# ==================== SEED DATA ENDPOINT ====================

@api_router.api_route("/seed-data", methods=["GET", "POST"])
async def seed_database():
    try:
        # Check if data already exists
        user_count = await db.users.count_documents({})
        if user_count > 0:
            return {"message": "Database already has data"}
        
        # Create admin user
        admin_user = User(
            username="admin",
            email="admin@maribel.com",
            password_hash=hash_password("admin123"),
            role="administrador",
            full_name="Administrador Sistema"
        )
        admin_doc = admin_user.model_dump()
        admin_doc['created_at'] = admin_doc['created_at'].isoformat()
        await db.users.insert_one(admin_doc)
        
        # Create vendedor user
        vendedor_user = User(
            username="vendedor",
            email="vendedor@maribel.com",
            password_hash=hash_password("vendedor123"),
            role="vendedor",
            full_name="Juan Pérez"
        )
        vendedor_doc = vendedor_user.model_dump()
        vendedor_doc['created_at'] = vendedor_doc['created_at'].isoformat()
        await db.users.insert_one(vendedor_doc)
        
        # Create consulta user
        consulta_user = User(
            username="consulta",
            email="consulta@maribel.com",
            password_hash=hash_password("consulta123"),
            role="consulta",
            full_name="María García"
        )
        consulta_doc = consulta_user.model_dump()
        consulta_doc['created_at'] = consulta_doc['created_at'].isoformat()
        await db.users.insert_one(consulta_doc)
        
        # Create categories
        categories = [
            {"name": "Analgésicos", "description": "Medicamentos para aliviar el dolor"},
            {"name": "Antibióticos", "description": "Medicamentos para combatir infecciones"},
            {"name": "Vitaminas", "description": "Suplementos vitamínicos"},
            {"name": "Antiinflamatorios", "description": "Medicamentos para reducir inflamación"},
            {"name": "Cardiovasculares", "description": "Medicamentos para el corazón"}
        ]
        category_ids = []
        for cat_data in categories:
            category = Category(**cat_data)
            cat_doc = category.model_dump()
            cat_doc['created_at'] = cat_doc['created_at'].isoformat()
            await db.categories.insert_one(cat_doc)
            category_ids.append(category.id)
        
        # Create suppliers
        suppliers = [
            {
                "name": "Farmaceutica Central S.A.",
                "contact_person": "Carlos Martínez",
                "phone": "555-1234",
                "email": "contacto@farmaceuticacentral.com",
                "address": "Av. Principal 123"
            },
            {
                "name": "MediSupply Inc.",
                "contact_person": "Ana López",
                "phone": "555-5678",
                "email": "ventas@medisupply.com",
                "address": "Calle Comercio 456"
            }
        ]
        supplier_ids = []
        for sup_data in suppliers:
            supplier = Supplier(**sup_data)
            sup_doc = supplier.model_dump()
            sup_doc['created_at'] = sup_doc['created_at'].isoformat()
            await db.suppliers.insert_one(sup_doc)
            supplier_ids.append(supplier.id)
        
        # Create products
        products = [
            {
                "name": "Paracetamol 500mg",
                "description": "Tabletas para alivio del dolor y fiebre",
                "category_id": category_ids[0],
                "supplier_id": supplier_ids[0],
                "price": 5.50,
                "cost": 3.00,
                "stock": 100,
                "min_stock": 20,
                "expiration_date": (datetime.now() + timedelta(days=365)).isoformat(),
                "barcode": "7501234567890"
            },
            {
                "name": "Amoxicilina 500mg",
                "description": "Antibiótico de amplio espectro",
                "category_id": category_ids[1],
                "supplier_id": supplier_ids[0],
                "price": 12.00,
                "cost": 7.50,
                "stock": 50,
                "min_stock": 15,
                "expiration_date": (datetime.now() + timedelta(days=180)).isoformat(),
                "barcode": "7501234567891"
            },
            {
                "name": "Vitamina C 1000mg",
                "description": "Suplemento de vitamina C",
                "category_id": category_ids[2],
                "supplier_id": supplier_ids[1],
                "price": 8.00,
                "cost": 4.50,
                "stock": 75,
                "min_stock": 25,
                "expiration_date": (datetime.now() + timedelta(days=540)).isoformat(),
                "barcode": "7501234567892"
            },
            {
                "name": "Ibuprofeno 400mg",
                "description": "Antiinflamatorio y analgésico",
                "category_id": category_ids[3],
                "supplier_id": supplier_ids[0],
                "price": 7.50,
                "cost": 4.00,
                "stock": 60,
                "min_stock": 20,
                "expiration_date": (datetime.now() + timedelta(days=270)).isoformat(),
                "barcode": "7501234567893"
            },
            {
                "name": "Aspirina 100mg",
                "description": "Protector cardiovascular",
                "category_id": category_ids[4],
                "supplier_id": supplier_ids[1],
                "price": 6.00,
                "cost": 3.50,
                "stock": 8,  # Low stock
                "min_stock": 15,
                "expiration_date": (datetime.now() + timedelta(days=90)).isoformat(),
                "barcode": "7501234567894"
            },
            {
                "name": "Complejo B",
                "description": "Vitaminas del complejo B",
                "category_id": category_ids[2],
                "supplier_id": supplier_ids[1],
                "price": 10.00,
                "cost": 6.00,
                "stock": 40,
                "min_stock": 15,
                "expiration_date": (datetime.now() + timedelta(days=450)).isoformat(),
                "barcode": "7501234567895"
            }
        ]
        product_ids = []
        for prod_data in products:
            product = Product(**prod_data)
            prod_doc = product.model_dump()
            prod_doc['created_at'] = prod_doc['created_at'].isoformat()
            if prod_doc['expiration_date']:
                prod_doc['expiration_date'] = prod_doc['expiration_date']
            await db.products.insert_one(prod_doc)
            product_ids.append(product.id)
        
        # Create customers
        customers = [
            {
                "name": "Cliente General",
                "phone": "555-0000",
                "email": None,
                "address": None
            },
            {
                "name": "Roberto Gómez",
                "phone": "555-1111",
                "email": "roberto@email.com",
                "address": "Calle 1 #123"
            },
            {
                "name": "Laura Fernández",
                "phone": "555-2222",
                "email": "laura@email.com",
                "address": "Avenida 2 #456"
            }
        ]
        customer_ids = []
        for cust_data in customers:
            customer = Customer(**cust_data)
            cust_doc = customer.model_dump()
            cust_doc['created_at'] = cust_doc['created_at'].isoformat()
            await db.customers.insert_one(cust_doc)
            customer_ids.append(customer.id)
        
        # Create some sales
        sales_data = [
            {
                "customer_id": customer_ids[1],
                "customer_name": "Roberto Gómez",
                "user_id": vendedor_user.id,
                "user_name": "Juan Pérez",
                "details": [
                    SaleDetail(
                        product_id=product_ids[0],
                        product_name="Paracetamol 500mg",
                        quantity=2,
                        unit_price=5.50,
                        subtotal=11.00
                    ),
                    SaleDetail(
                        product_id=product_ids[2],
                        product_name="Vitamina C 1000mg",
                        quantity=1,
                        unit_price=8.00,
                        subtotal=8.00
                    )
                ],
                "subtotal": 19.00,
                "tax": 0.0,
                "discount": 0.0,
                "total": 19.00,
                "payment_method": "efectivo"
            },
            {
                "customer_id": customer_ids[2],
                "customer_name": "Laura Fernández",
                "user_id": vendedor_user.id,
                "user_name": "Juan Pérez",
                "details": [
                    SaleDetail(
                        product_id=product_ids[1],
                        product_name="Amoxicilina 500mg",
                        quantity=1,
                        unit_price=12.00,
                        subtotal=12.00
                    )
                ],
                "subtotal": 12.00,
                "tax": 0.0,
                "discount": 0.0,
                "total": 12.00,
                "payment_method": "tarjeta"
            }
        ]
        
        for sale_data in sales_data:
            sale = Sale(**sale_data)
            sale_doc = sale.model_dump()
            sale_doc['created_at'] = sale_doc['created_at'].isoformat()
            await db.sales.insert_one(sale_doc)
        
        return {
            "message": "Database seeded successfully",
            "credentials": {
                "admin": {"username": "admin", "password": "admin123"},
                "vendedor": {"username": "vendedor", "password": "vendedor123"},
                "consulta": {"username": "consulta", "password": "consulta123"}
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Seed failed: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
