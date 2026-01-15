# 📂 DATOS INICIALES PARA MONGODB

Esta carpeta contiene los archivos JSON para importar a MongoDB Compass.

## 📋 Cómo importar los datos:

### Paso 1: Abrir MongoDB Compass
1. Abre MongoDB Compass
2. Conéctate a: `mongodb://localhost:27017`

### Paso 2: Crear la base de datos
1. Clic en **"+ Create Database"**
2. Database Name: `pharmacy_db`
3. Collection Name: `users`
4. Clic en **Create Database**

### Paso 3: Importar cada archivo JSON

**Para la colección `users`:**
1. Selecciona la base de datos `pharmacy_db`
2. Selecciona la colección `users`
3. Clic en **ADD DATA** → **Import JSON or CSV file**
4. Selecciona el archivo `users.json`
5. Clic en **Import**

**Repite para las demás colecciones:**

| Colección | Archivo |
|-----------|---------|
| users | users.json |
| categories | categories.json |
| suppliers | suppliers.json |
| products | products.json |
| customers | customers.json |

**NOTA:** Debes crear cada colección antes de importar:
- Clic derecho en `pharmacy_db` → Create Collection → escribe el nombre

### Paso 4: Iniciar sesión
Ve a `http://localhost:3000` y usa:
- **Usuario:** admin
- **Contraseña:** admin123

---

## 👤 Usuarios incluidos:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| vendedor | vendedor123 | Vendedor |
| consulta | consulta123 | Consulta |
