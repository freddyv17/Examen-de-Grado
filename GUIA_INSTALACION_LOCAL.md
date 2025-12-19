# 🚀 GUÍA COMPLETA: INSTALAR MARIBEL FARMACIA EN TU PC

## 📋 TABLA DE CONTENIDOS
1. [Requisitos Previos](#requisitos-previos)
2. [Instalación en Windows](#instalación-en-windows)
3. [Instalación en macOS](#instalación-en-macos)
4. [Instalación en Linux](#instalación-en-linux)
5. [Configuración de Base de Datos](#configuración-de-base-de-datos)
6. [Primera Ejecución](#primera-ejecución)
7. [Solución de Problemas](#solución-de-problemas)

---

## 📦 REQUISITOS PREVIOS

Antes de comenzar, necesitas instalar estos programas en tu computadora:

### 1. **Git**
- Para clonar el repositorio desde GitHub
- **Descargar:** https://git-scm.com/downloads
- **Verificar instalación:**
  ```bash
  git --version
  ```

### 2. **Node.js y npm**
- Para el frontend (React)
- **Versión recomendada:** Node.js 18 o superior
- **Descargar:** https://nodejs.org/
- **Verificar instalación:**
  ```bash
  node --version
  npm --version
  ```

### 3. **Python**
- Para el backend (FastAPI)
- **Versión recomendada:** Python 3.11 o superior
- **Descargar:** https://www.python.org/downloads/
- **Verificar instalación:**
  ```bash
  python --version
  # o
  python3 --version
  ```

### 4. **MongoDB**
- Base de datos
- **Versión recomendada:** MongoDB 6.0 o superior
- **Descargar:** https://www.mongodb.com/try/download/community

---

## 🪟 INSTALACIÓN EN WINDOWS

### Paso 1: Instalar MongoDB

1. **Descargar MongoDB Community Server:**
   - Ir a: https://www.mongodb.com/try/download/community
   - Seleccionar: Windows, MSI
   - Click en "Download"

2. **Instalar MongoDB:**
   - Ejecutar el archivo .msi descargado
   - Seleccionar "Complete" setup
   - ✅ Marcar "Install MongoDB as a Service"
   - ✅ Marcar "Install MongoDB Compass" (opcional, es una GUI)
   - Click en "Install"

3. **Verificar instalación:**
   ```cmd
   mongod --version
   ```

4. **Iniciar MongoDB:**
   - MongoDB se inicia automáticamente como servicio
   - Para verificar:
   ```cmd
   net start MongoDB
   ```

### Paso 2: Clonar el Proyecto desde GitHub

1. **Abrir PowerShell o CMD:**
   - Presiona `Windows + R`
   - Escribe `cmd` o `powershell`
   - Enter

2. **Navegar a donde quieres guardar el proyecto:**
   ```cmd
   cd C:\Users\TuUsuario\Documents
   ```

3. **Clonar el repositorio:**
   ```cmd
   git clone https://github.com/tu-usuario/maribel-farmacia.git
   cd maribel-farmacia
   ```

### Paso 3: Configurar el Backend

1. **Navegar a la carpeta backend:**
   ```cmd
   cd backend
   ```

2. **Crear entorno virtual de Python:**
   ```cmd
   python -m venv venv
   ```

3. **Activar entorno virtual:**
   ```cmd
   venv\Scripts\activate
   ```
   *Verás `(venv)` al inicio de tu línea de comando*

4. **Instalar dependencias:**
   ```cmd
   pip install -r requirements.txt
   ```

5. **Crear archivo `.env`:**
   ```cmd
   notepad .env
   ```
   Pegar este contenido:
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=maribel_farmacia
   CORS_ORIGINS=*
   JWT_SECRET=maribel-farmacia-secret-key-2025
   ```
   Guardar y cerrar

6. **Poblar la base de datos con datos de ejemplo:**
   ```cmd
   python -c "import asyncio; from server import seed_database; asyncio.run(seed_database())"
   ```
   O iniciar el servidor y llamar al endpoint:
   ```cmd
   python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
   ```
   Luego en otra terminal:
   ```cmd
   curl -X POST http://localhost:8001/api/seed-data
   ```

### Paso 4: Configurar el Frontend

1. **Abrir NUEVA ventana de CMD/PowerShell**

2. **Navegar a la carpeta frontend:**
   ```cmd
   cd C:\Users\TuUsuario\Documents\maribel-farmacia\frontend
   ```

3. **Instalar Node.js (si no está instalado):**
   - Descargar de: https://nodejs.org/
   - Instalar versión LTS

4. **Instalar yarn (recomendado) o usar npm:**
   ```cmd
   npm install -g yarn
   ```

5. **Instalar dependencias:**
   ```cmd
   yarn install
   # o si usas npm:
   # npm install
   ```

6. **Crear archivo `.env`:**
   ```cmd
   notepad .env
   ```
   Pegar este contenido:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```
   Guardar y cerrar

### Paso 5: Iniciar la Aplicación

**Terminal 1 - Backend:**
```cmd
cd backend
venv\Scripts\activate
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**Terminal 2 - Frontend:**
```cmd
cd frontend
yarn start
# o
npm start
```

**¡Listo!** La aplicación se abrirá automáticamente en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- Documentación API: http://localhost:8001/docs

---

## 🍎 INSTALACIÓN EN macOS

### Paso 1: Instalar Homebrew (si no lo tienes)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Paso 2: Instalar MongoDB

```bash
# Agregar el tap de MongoDB
brew tap mongodb/brew

# Instalar MongoDB
brew install mongodb-community@7.0

# Iniciar MongoDB como servicio
brew services start mongodb-community@7.0

# Verificar instalación
mongod --version
```

### Paso 3: Instalar Python y Node.js

```bash
# Instalar Python 3
brew install python@3.11

# Instalar Node.js
brew install node

# Verificar instalaciones
python3 --version
node --version
npm --version
```

### Paso 4: Clonar y Configurar el Proyecto

```bash
# Navegar a donde quieres guardar el proyecto
cd ~/Documents

# Clonar repositorio
git clone https://github.com/tu-usuario/maribel-farmacia.git
cd maribel-farmacia

# Configurar Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Crear archivo .env
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=maribel_farmacia
CORS_ORIGINS=*
JWT_SECRET=maribel-farmacia-secret-key-2025
EOF

# Volver a raíz
cd ..

# Configurar Frontend
cd frontend
npm install -g yarn
yarn install

# Crear archivo .env
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
EOF
```

### Paso 5: Iniciar la Aplicación

**Terminal 1 - Backend:**
```bash
cd ~/Documents/maribel-farmacia/backend
source venv/bin/activate
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd ~/Documents/maribel-farmacia/frontend
yarn start
```

---

## 🐧 INSTALACIÓN EN LINUX (Ubuntu/Debian)

### Paso 1: Actualizar el Sistema

```bash
sudo apt update
sudo apt upgrade -y
```

### Paso 2: Instalar MongoDB

```bash
# Importar clave pública de MongoDB
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Agregar repositorio
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Actualizar e instalar
sudo apt update
sudo apt install -y mongodb-org

# Iniciar MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verificar
sudo systemctl status mongod
mongod --version
```

### Paso 3: Instalar Python y Node.js

```bash
# Instalar Python 3.11
sudo apt install -y python3.11 python3.11-venv python3-pip

# Instalar Node.js (usando NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalaciones
python3.11 --version
node --version
npm --version
```

### Paso 4: Clonar y Configurar

```bash
# Navegar a directorio
cd ~

# Clonar repositorio
git clone https://github.com/tu-usuario/maribel-farmacia.git
cd maribel-farmacia

# Backend
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Crear .env
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=maribel_farmacia
CORS_ORIGINS=*
JWT_SECRET=maribel-farmacia-secret-key-2025
EOF

cd ..

# Frontend
cd frontend
sudo npm install -g yarn
yarn install

# Crear .env
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
EOF
```

### Paso 5: Iniciar Aplicación

**Terminal 1:**
```bash
cd ~/maribel-farmacia/backend
source venv/bin/activate
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**Terminal 2:**
```bash
cd ~/maribel-farmacia/frontend
yarn start
```

---

## 🗄️ CONFIGURACIÓN DE BASE DE DATOS

### Opción 1: Datos de Ejemplo (Recomendado para empezar)

1. **Asegúrate que el backend esté corriendo**

2. **Ejecutar seed data:**
   ```bash
   curl -X POST http://localhost:8001/api/seed-data
   ```

3. **Datos creados:**
   - ✅ 3 usuarios (admin, vendedor, consulta)
   - ✅ 5 categorías de medicamentos
   - ✅ 2 proveedores
   - ✅ 6 productos de ejemplo
   - ✅ 3 clientes
   - ✅ 2 ventas de ejemplo

### Opción 2: Restaurar un Respaldo

Si tienes un archivo `backup_YYYY-MM-DD.json`:

1. **Ir al sistema web:** http://localhost:3000
2. **Login como admin:** admin / admin123
3. **Ir a "Base de Datos"**
4. **Click en "Seleccionar archivo de respaldo"**
5. **Seleccionar tu archivo .json**
6. **Click en "Restaurar Base de Datos"**
7. **Confirmar**

### Opción 3: Base de Datos Vacía

Si prefieres empezar desde cero:

1. El sistema creará las colecciones automáticamente
2. Usa la interfaz web para agregar:
   - Usuarios
   - Categorías
   - Proveedores
   - Productos
   - Clientes

---

## 🎯 PRIMERA EJECUCIÓN

### 1. Verificar que todo esté corriendo

**Backend:**
- Abrir: http://localhost:8001/docs
- ✅ Debe mostrar la documentación de la API (Swagger UI)

**Frontend:**
- Abrir: http://localhost:3000
- ✅ Debe mostrar la página de login

**MongoDB:**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl status mongod
```

### 2. Iniciar Sesión

**Usuarios de ejemplo:**

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | admin123 | Administrador |
| vendedor | vendedor123 | Vendedor |
| consulta | consulta123 | Consulta |

### 3. Explorar el Sistema

1. **Dashboard**
   - Ver estadísticas
   - Click en tarjetas para ver detalles

2. **Productos**
   - Ver lista de productos
   - Crear nuevo producto
   - Editar/eliminar

3. **Punto de Venta**
   - Realizar una venta de prueba
   - Ver recibo generado

4. **Reportes**
   - Descargar reportes en Excel

---

## 🔧 SCRIPTS ÚTILES

### Windows (crear archivos .bat)

**`start-backend.bat`:**
```batch
@echo off
cd backend
call venv\Scripts\activate
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
pause
```

**`start-frontend.bat`:**
```batch
@echo off
cd frontend
yarn start
pause
```

**`start-all.bat`:**
```batch
@echo off
start cmd /k "cd backend && venv\Scripts\activate && python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001"
timeout /t 5
start cmd /k "cd frontend && yarn start"
```

### macOS/Linux (crear archivos .sh)

**`start-backend.sh`:**
```bash
#!/bin/bash
cd backend
source venv/bin/activate
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**`start-frontend.sh`:**
```bash
#!/bin/bash
cd frontend
yarn start
```

**Dar permisos de ejecución:**
```bash
chmod +x start-backend.sh
chmod +x start-frontend.sh
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Problema 1: "Puerto 8001 ya en uso"

**Solución Windows:**
```cmd
netstat -ano | findstr :8001
taskkill /PID <numero_pid> /F
```

**Solución macOS/Linux:**
```bash
lsof -ti:8001 | xargs kill -9
```

### Problema 2: "Module not found"

**Backend:**
```bash
cd backend
source venv/bin/activate  # o venv\Scripts\activate en Windows
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json yarn.lock
yarn install
```

### Problema 3: "MongoDB connection failed"

**Verificar que MongoDB esté corriendo:**

**Windows:**
```cmd
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community@7.0
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

### Problema 4: "Cannot find module 'python'"

Usa `python3` en lugar de `python`:
```bash
python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### Problema 5: Archivo .env no se encuentra

Crear manualmente:

**backend/.env:**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=maribel_farmacia
CORS_ORIGINS=*
JWT_SECRET=maribel-farmacia-secret-key-2025
```

**frontend/.env:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Problema 6: Error de CORS

Verificar que en `backend/.env` esté:
```env
CORS_ORIGINS=*
```

O específicamente:
```env
CORS_ORIGINS=http://localhost:3000
```

### Problema 7: Puerto 3000 en uso

Cambiar puerto del frontend:
```bash
# Windows
set PORT=3001 && yarn start

# macOS/Linux
PORT=3001 yarn start
```

---

## 📱 ACCEDER DESDE OTROS DISPOSITIVOS

### En tu Red Local:

1. **Obtener tu IP local:**

   **Windows:**
   ```cmd
   ipconfig
   ```
   Buscar "IPv4 Address" (ejemplo: 192.168.1.100)

   **macOS/Linux:**
   ```bash
   ifconfig | grep inet
   ```

2. **Modificar frontend/.env:**
   ```env
   REACT_APP_BACKEND_URL=http://192.168.1.100:8001
   ```

3. **Iniciar con host 0.0.0.0:**
   
   **Backend:**
   ```bash
   python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
   ```

   **Frontend:**
   ```bash
   HOST=0.0.0.0 yarn start
   ```

4. **Acceder desde otro dispositivo:**
   - Frontend: http://192.168.1.100:3000
   - Backend: http://192.168.1.100:8001

**Nota:** Asegúrate que tu firewall permita conexiones en esos puertos.

---

## 🔐 SEGURIDAD PARA PRODUCCIÓN

### Cambiar Secretos:

**backend/.env:**
```env
JWT_SECRET=genera-tu-propia-clave-secreta-aqui-muy-larga-y-aleatoria
```

### Base de Datos con Autenticación:

1. **Crear usuario en MongoDB:**
   ```bash
   mongosh
   ```
   ```javascript
   use admin
   db.createUser({
     user: "maribel_admin",
     pwd: "contraseña_segura",
     roles: ["readWrite"]
   })
   ```

2. **Actualizar backend/.env:**
   ```env
   MONGO_URL=mongodb://maribel_admin:contraseña_segura@localhost:27017/maribel_farmacia?authSource=admin
   ```

---

## 📚 COMANDOS RÁPIDOS DE REFERENCIA

### Iniciar Todo:
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # o venv\Scripts\activate en Windows
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Terminal 2 - Frontend
cd frontend
yarn start
```

### Detener:
- Backend: `Ctrl + C`
- Frontend: `Ctrl + C`

### Actualizar Dependencias:
```bash
# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
yarn install
```

### Crear Respaldo:
1. Ir a: http://localhost:3000
2. Login como admin
3. Base de Datos → Crear Respaldo

---

## ✅ CHECKLIST DE INSTALACIÓN

- [ ] Git instalado
- [ ] Node.js instalado
- [ ] Python instalado
- [ ] MongoDB instalado y corriendo
- [ ] Repositorio clonado
- [ ] Backend configurado (.env creado)
- [ ] Frontend configurado (.env creado)
- [ ] Dependencias backend instaladas
- [ ] Dependencias frontend instaladas
- [ ] Datos de ejemplo cargados
- [ ] Backend iniciado (puerto 8001)
- [ ] Frontend iniciado (puerto 3000)
- [ ] Login exitoso
- [ ] Sistema funcionando correctamente

---

## 🎉 ¡LISTO!

Tu sistema Maribel Farmacia está completamente instalado y funcionando en tu PC local.

**URLs importantes:**
- 🌐 Aplicación: http://localhost:3000
- 🔌 API: http://localhost:8001
- 📖 Documentación API: http://localhost:8001/docs
- 🗄️ MongoDB: mongodb://localhost:27017

**¿Necesitas ayuda?** Revisa la sección de [Solución de Problemas](#solución-de-problemas)

**¡Disfruta tu sistema! 🚀**
