"""
Script simplificado para crear datos iniciales
Ejecutar: python crear_datos_simple.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
from datetime import datetime, timezone
import uuid

MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "pharmacy_db"

def hash_password(password):
    # Usar bcrypt directamente sin passlib
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

async def crear_datos():
    print("Conectando a MongoDB...")
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Eliminar datos existentes
    print("Limpiando base de datos...")
    await db.users.delete_many({})
    await db.categories.delete_many({})
    await db.suppliers.delete_many({})
    await db.products.delete_many({})
    await db.customers.delete_many({})
    
    print("\nCreando usuarios...")
    
    # Crear hash para admin123
    admin_hash = hash_password("admin123")
    vendedor_hash = hash_password("vendedor123")
    consulta_hash = hash_password("consulta123")
    
    print(f"  Hash generado para admin: {admin_hash[:30]}...")
    
    usuarios = [
        {
            "id": str(uuid.uuid4()),
            "username": "admin",
            "email": "admin@maribel.com",
            "password_hash": admin_hash,
            "role": "administrador",
            "full_name": "Administrador Sistema",
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "username": "vendedor",
            "email": "vendedor@maribel.com",
            "password_hash": vendedor_hash,
            "role": "vendedor",
            "full_name": "Juan Perez",
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "username": "consulta",
            "email": "consulta@maribel.com",
            "password_hash": consulta_hash,
            "role": "consulta",
            "full_name": "Maria Garcia",
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.users.insert_many(usuarios)
    print("  ✓ 3 usuarios creados")
    
    # Verificar que el hash funciona
    print("\nVerificando contraseña...")
    test = bcrypt.checkpw("admin123".encode('utf-8'), admin_hash.encode('utf-8'))
    print(f"  ✓ Verificacion: {'CORRECTA' if test else 'FALLIDA'}")
    
    print("\nCreando categorias...")
    categorias = [
        {"id": "cat-001", "name": "Analgesicos", "description": "Medicamentos para el dolor"},
        {"id": "cat-002", "name": "Antibioticos", "description": "Para infecciones"},
        {"id": "cat-003", "name": "Vitaminas", "description": "Suplementos"},
    ]
    await db.categories.insert_many(categorias)
    print("  ✓ 3 categorias creadas")
    
    print("\nCreando proveedores...")
    proveedores = [
        {"id": "sup-001", "name": "Distribuidora Farma", "contact_person": "Carlos", "phone": "555-0101", "email": "ventas@farma.com", "address": "Av Principal 123"}
    ]
    await db.suppliers.insert_many(proveedores)
    print("  ✓ 1 proveedor creado")
    
    print("\nCreando productos...")
    productos = [
        {"id": "prod-001", "name": "Paracetamol 500mg", "description": "Analgesico", "category_id": "cat-001", "supplier_id": "sup-001", "price": 5.50, "cost": 3.00, "stock": 100, "min_stock": 20},
        {"id": "prod-002", "name": "Amoxicilina 500mg", "description": "Antibiotico", "category_id": "cat-002", "supplier_id": "sup-001", "price": 15.00, "cost": 8.00, "stock": 50, "min_stock": 10},
    ]
    await db.products.insert_many(productos)
    print("  ✓ 2 productos creados")
    
    print("\nCreando clientes...")
    clientes = [
        {"id": "cli-001", "name": "Cliente General", "phone": "000-0000", "email": "", "address": ""}
    ]
    await db.customers.insert_many(clientes)
    print("  ✓ 1 cliente creado")
    
    client.close()
    
    print("\n" + "="*50)
    print("¡DATOS CREADOS EXITOSAMENTE!")
    print("="*50)
    print("\nCredenciales de acceso:")
    print("  Usuario: admin")
    print("  Contraseña: admin123")
    print("\nAhora ve a: http://localhost:3000")
    print("="*50)

if __name__ == "__main__":
    asyncio.run(crear_datos())
