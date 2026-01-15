"""
Script COMPLETO para crear todos los datos iniciales
Ejecutar: python crear_datos_completo.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
from datetime import datetime, timezone
import uuid

MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "pharmacy_db"

def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

async def crear_datos():
    print("="*50)
    print("  CREANDO DATOS INICIALES COMPLETOS")
    print("="*50)
    
    print("\nConectando a MongoDB...")
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Limpiar todo
    print("Limpiando base de datos...")
    await db.users.delete_many({})
    await db.categories.delete_many({})
    await db.suppliers.delete_many({})
    await db.products.delete_many({})
    await db.customers.delete_many({})
    await db.sales.delete_many({})
    
    # ========== USUARIOS ==========
    print("\n[1/6] Creando usuarios...")
    usuarios = [
        {
            "id": str(uuid.uuid4()),
            "username": "admin",
            "email": "admin@maribel.com",
            "password_hash": hash_password("admin123"),
            "role": "administrador",
            "full_name": "Administrador Sistema",
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "username": "vendedor",
            "email": "vendedor@maribel.com",
            "password_hash": hash_password("vendedor123"),
            "role": "vendedor",
            "full_name": "Juan Perez",
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "username": "consulta",
            "email": "consulta@maribel.com",
            "password_hash": hash_password("consulta123"),
            "role": "consulta",
            "full_name": "Maria Garcia",
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.users.insert_many(usuarios)
    print("   OK - 3 usuarios creados")
    
    # ========== CATEGORIAS ==========
    print("\n[2/6] Creando categorias...")
    categorias = [
        {"id": "cat-001", "name": "Analgesicos", "description": "Medicamentos para aliviar el dolor", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": "cat-002", "name": "Antibioticos", "description": "Medicamentos para combatir infecciones", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": "cat-003", "name": "Vitaminas", "description": "Suplementos vitaminicos", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": "cat-004", "name": "Antiinflamatorios", "description": "Medicamentos para reducir inflamacion", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": "cat-005", "name": "Cardiovasculares", "description": "Medicamentos para el corazon", "created_at": datetime.now(timezone.utc).isoformat()},
    ]
    await db.categories.insert_many(categorias)
    print("   OK - 5 categorias creadas")
    
    # ========== PROVEEDORES ==========
    print("\n[3/6] Creando proveedores...")
    proveedores = [
        {
            "id": "sup-001", 
            "name": "Distribuidora Farma S.A.", 
            "contact_person": "Carlos Mendoza", 
            "phone": "555-0101", 
            "email": "ventas@farma.com", 
            "address": "Av. Principal 123",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "sup-002", 
            "name": "Laboratorios Medicos", 
            "contact_person": "Ana Rodriguez", 
            "phone": "555-0102", 
            "email": "contacto@labmedicos.com", 
            "address": "Calle Salud 456",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    await db.suppliers.insert_many(proveedores)
    print("   OK - 2 proveedores creados")
    
    # ========== PRODUCTOS ==========
    print("\n[4/6] Creando productos...")
    productos = [
        {
            "id": "prod-001", 
            "name": "Paracetamol 500mg", 
            "description": "Analgesico y antipiretico", 
            "category_id": "cat-001", 
            "supplier_id": "sup-001", 
            "price": 25.00, 
            "cost": 15.00, 
            "stock": 100, 
            "min_stock": 20,
            "active": True,
            "expiration_date": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "prod-002", 
            "name": "Ibuprofeno 400mg", 
            "description": "Antiinflamatorio no esteroideo", 
            "category_id": "cat-004", 
            "supplier_id": "sup-001", 
            "price": 35.00, 
            "cost": 20.00, 
            "stock": 80, 
            "min_stock": 15,
            "active": True,
            "expiration_date": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "prod-003", 
            "name": "Amoxicilina 500mg", 
            "description": "Antibiotico de amplio espectro", 
            "category_id": "cat-002", 
            "supplier_id": "sup-002", 
            "price": 85.00, 
            "cost": 50.00, 
            "stock": 50, 
            "min_stock": 10,
            "active": True,
            "expiration_date": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "prod-004", 
            "name": "Vitamina C 1000mg", 
            "description": "Suplemento vitaminico", 
            "category_id": "cat-003", 
            "supplier_id": "sup-002", 
            "price": 45.00, 
            "cost": 25.00, 
            "stock": 60, 
            "min_stock": 15,
            "active": True,
            "expiration_date": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "prod-005", 
            "name": "Aspirina 100mg", 
            "description": "Analgesico y anticoagulante", 
            "category_id": "cat-001", 
            "supplier_id": "sup-001", 
            "price": 20.00, 
            "cost": 10.00, 
            "stock": 120, 
            "min_stock": 25,
            "active": True,
            "expiration_date": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "prod-006", 
            "name": "Omeprazol 20mg", 
            "description": "Protector gastrico", 
            "category_id": "cat-004", 
            "supplier_id": "sup-002", 
            "price": 55.00, 
            "cost": 30.00, 
            "stock": 70, 
            "min_stock": 15,
            "active": True,
            "expiration_date": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    await db.products.insert_many(productos)
    print("   OK - 6 productos creados")
    
    # ========== CLIENTES ==========
    print("\n[5/6] Creando clientes...")
    clientes = [
        {
            "id": "cli-001", 
            "name": "Cliente General", 
            "phone": "000-0000", 
            "email": "", 
            "address": "",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "cli-002", 
            "name": "Pedro Martinez", 
            "phone": "555-1234", 
            "email": "pedro@email.com", 
            "address": "Calle 10 #123",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "cli-003", 
            "name": "Maria Lopez", 
            "phone": "555-5678", 
            "email": "maria@email.com", 
            "address": "Av. Central 456",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    await db.customers.insert_many(clientes)
    print("   OK - 3 clientes creados")
    
    # ========== VENTAS DE EJEMPLO ==========
    print("\n[6/6] Creando ventas de ejemplo...")
    ventas = [
        {
            "id": str(uuid.uuid4()),
            "user_id": usuarios[1]["id"],  # vendedor
            "customer_id": "cli-002",
            "customer_name": "Pedro Martinez",
            "details": [
                {"product_id": "prod-001", "product_name": "Paracetamol 500mg", "quantity": 2, "unit_price": 25.00, "subtotal": 50.00},
                {"product_id": "prod-004", "product_name": "Vitamina C 1000mg", "quantity": 1, "unit_price": 45.00, "subtotal": 45.00},
            ],
            "subtotal": 95.00,
            "tax": 0.00,
            "discount": 0.00,
            "total": 95.00,
            "payment_method": "efectivo",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": usuarios[1]["id"],  # vendedor
            "customer_id": "cli-003",
            "customer_name": "Maria Lopez",
            "details": [
                {"product_id": "prod-003", "product_name": "Amoxicilina 500mg", "quantity": 1, "unit_price": 85.00, "subtotal": 85.00},
            ],
            "subtotal": 85.00,
            "tax": 0.00,
            "discount": 0.00,
            "total": 85.00,
            "payment_method": "tarjeta",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    await db.sales.insert_many(ventas)
    print("   OK - 2 ventas de ejemplo creadas")
    
    client.close()
    
    print("\n" + "="*50)
    print("  DATOS CREADOS EXITOSAMENTE!")
    print("="*50)
    print("\nCredenciales de acceso:")
    print("  Usuario: admin")
    print("  Contrasena: admin123")
    print("\nAhora ve a: http://localhost:3000")
    print("="*50)

if __name__ == "__main__":
    asyncio.run(crear_datos())
