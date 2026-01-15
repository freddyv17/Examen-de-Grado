"""
Script para crear los datos iniciales en MongoDB
Ejecutar desde la carpeta backend con el entorno virtual activado:

    cd backend
    venv\Scripts\activate
    python crear_datos.py
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime, timezone
import uuid

# Configuración
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "pharmacy_db"

# Configuración de contraseñas (igual que en server.py)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

async def crear_datos():
    # Conectar a MongoDB
    print("Conectando a MongoDB...")
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Verificar si ya existen datos
    user_count = await db.users.count_documents({})
    if user_count > 0:
        print(f"Ya existen {user_count} usuarios en la base de datos.")
        respuesta = input("¿Deseas eliminar todo y crear datos nuevos? (s/n): ")
        if respuesta.lower() != 's':
            print("Operación cancelada.")
            return
        
        # Eliminar datos existentes
        print("Eliminando datos existentes...")
        await db.users.delete_many({})
        await db.categories.delete_many({})
        await db.suppliers.delete_many({})
        await db.products.delete_many({})
        await db.customers.delete_many({})
        await db.sales.delete_many({})
    
    print("\n" + "="*50)
    print("CREANDO DATOS INICIALES")
    print("="*50)
    
    # ========== USUARIOS ==========
    print("\n[1/5] Creando usuarios...")
    
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
            "full_name": "Juan Pérez",
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "username": "consulta",
            "email": "consulta@maribel.com",
            "password_hash": hash_password("consulta123"),
            "role": "consulta",
            "full_name": "María García",
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.users.insert_many(usuarios)
    print("   ✓ 3 usuarios creados")
    print("     - admin / admin123 (Administrador)")
    print("     - vendedor / vendedor123 (Vendedor)")
    print("     - consulta / consulta123 (Consulta)")
    
    # ========== CATEGORÍAS ==========
    print("\n[2/5] Creando categorías...")
    
    categorias = [
        {"id": "cat-001", "name": "Analgésicos", "description": "Medicamentos para aliviar el dolor"},
        {"id": "cat-002", "name": "Antibióticos", "description": "Medicamentos para combatir infecciones"},
        {"id": "cat-003", "name": "Vitaminas", "description": "Suplementos vitamínicos"},
        {"id": "cat-004", "name": "Antiinflamatorios", "description": "Medicamentos para reducir inflamación"},
        {"id": "cat-005", "name": "Cardiovasculares", "description": "Medicamentos para el corazón"}
    ]
    
    await db.categories.insert_many(categorias)
    print("   ✓ 5 categorías creadas")
    
    # ========== PROVEEDORES ==========
    print("\n[3/5] Creando proveedores...")
    
    proveedores = [
        {
            "id": "sup-001",
            "name": "Distribuidora Farma S.A.",
            "contact_person": "Carlos Mendoza",
            "phone": "555-0101",
            "email": "ventas@farma.com",
            "address": "Av. Principal 123"
        },
        {
            "id": "sup-002",
            "name": "Laboratorios Médicos",
            "contact_person": "Ana Rodríguez",
            "phone": "555-0102",
            "email": "contacto@labmedicos.com",
            "address": "Calle Salud 456"
        }
    ]
    
    await db.suppliers.insert_many(proveedores)
    print("   ✓ 2 proveedores creados")
    
    # ========== PRODUCTOS ==========
    print("\n[4/5] Creando productos...")
    
    productos = [
        {
            "id": "prod-001",
            "name": "Paracetamol 500mg",
            "description": "Analgésico y antipirético",
            "category_id": "cat-001",
            "supplier_id": "sup-001",
            "price": 5.50,
            "cost": 3.00,
            "stock": 100,
            "min_stock": 20
        },
        {
            "id": "prod-002",
            "name": "Ibuprofeno 400mg",
            "description": "Antiinflamatorio no esteroideo",
            "category_id": "cat-004",
            "supplier_id": "sup-001",
            "price": 8.00,
            "cost": 4.50,
            "stock": 80,
            "min_stock": 15
        },
        {
            "id": "prod-003",
            "name": "Amoxicilina 500mg",
            "description": "Antibiótico de amplio espectro",
            "category_id": "cat-002",
            "supplier_id": "sup-002",
            "price": 15.00,
            "cost": 8.00,
            "stock": 50,
            "min_stock": 10
        },
        {
            "id": "prod-004",
            "name": "Vitamina C 1000mg",
            "description": "Suplemento vitamínico",
            "category_id": "cat-003",
            "supplier_id": "sup-002",
            "price": 12.00,
            "cost": 6.00,
            "stock": 60,
            "min_stock": 15
        },
        {
            "id": "prod-005",
            "name": "Aspirina 100mg",
            "description": "Analgésico y anticoagulante",
            "category_id": "cat-001",
            "supplier_id": "sup-001",
            "price": 4.00,
            "cost": 2.00,
            "stock": 120,
            "min_stock": 25
        }
    ]
    
    await db.products.insert_many(productos)
    print("   ✓ 5 productos creados")
    
    # ========== CLIENTES ==========
    print("\n[5/5] Creando clientes...")
    
    clientes = [
        {
            "id": "cli-001",
            "name": "Cliente General",
            "phone": "000-0000",
            "email": "",
            "address": ""
        },
        {
            "id": "cli-002",
            "name": "Pedro Martínez",
            "phone": "555-1234",
            "email": "pedro@email.com",
            "address": "Calle 10 #123"
        }
    ]
    
    await db.customers.insert_many(clientes)
    print("   ✓ 2 clientes creados")
    
    # Cerrar conexión
    client.close()
    
    print("\n" + "="*50)
    print("¡DATOS CREADOS EXITOSAMENTE!")
    print("="*50)
    print("\nAhora puedes iniciar sesión en http://localhost:3000")
    print("\nCredenciales:")
    print("  Usuario: admin")
    print("  Contraseña: admin123")
    print("="*50)

if __name__ == "__main__":
    asyncio.run(crear_datos())
