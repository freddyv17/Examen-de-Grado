# 🏥 GUÍA COMPLETA DE INSTALACIÓN - Maribel Farmacia
## Sistema de Inventario y Facturación

Esta guía te explica paso a paso cómo instalar el proyecto en tu computadora con Windows.
**No necesitas saber programar** - solo sigue cada paso exactamente como se indica.

---

## 📋 ÍNDICE
1. [Requisitos Previos](#1-requisitos-previos)
2. [Instalar Node.js](#2-instalar-nodejs)
3. [Instalar Python](#3-instalar-python)
4. [Instalar MongoDB](#4-instalar-mongodb)
5. [Instalar Visual Studio Code](#5-instalar-visual-studio-code)
6. [Descargar el Proyecto](#6-descargar-el-proyecto)
7. [Configurar la Base de Datos](#7-configurar-la-base-de-datos)
8. [Configurar el Backend](#8-configurar-el-backend)
9. [Configurar el Frontend](#9-configurar-el-frontend)
10. [Ejecutar el Proyecto](#10-ejecutar-el-proyecto)
11. [Acceder al Sistema](#11-acceder-al-sistema)
12. [Solución de Problemas](#12-solución-de-problemas)

---

## 1. REQUISITOS PREVIOS

Antes de comenzar, necesitas instalar estos programas en tu computadora:

| Programa | ¿Para qué sirve? | Versión recomendada |
|----------|------------------|---------------------|
| Node.js | Ejecutar el frontend (la interfaz visual) | 18 o superior |
| Python | Ejecutar el backend (el servidor) | 3.10 o superior |
| MongoDB | La base de datos donde se guardan los datos | 7.0 o superior |
| Visual Studio Code | Editor para ver y modificar archivos | Última versión |
| Git | Para descargar el proyecto | Última versión |

---

## 2. INSTALAR NODE.JS

Node.js es necesario para ejecutar la parte visual del sistema (frontend).

### Paso 2.1: Descargar Node.js
1. Abre tu navegador (Chrome, Firefox, Edge, etc.)
2. Ve a esta página: **https://nodejs.org/es**
3. Verás dos botones verdes. Haz clic en el que dice **"LTS"** (Recomendado para la mayoría)
   
   ```
   ┌─────────────────────────────────────┐
   │  Descargar Node.js (LTS)            │
   │  [  20.x.x LTS  ] ← ESTE BOTÓN      │
   │  Recomendado para la mayoría        │
   └─────────────────────────────────────┘
   ```

4. Se descargará un archivo llamado algo como `node-v20.x.x-x64.msi`

### Paso 2.2: Instalar Node.js
1. Busca el archivo descargado (generalmente en la carpeta "Descargas")
2. Haz **doble clic** en el archivo `.msi`
3. Aparecerá el instalador. Sigue estos pasos:
   
   ```
   Pantalla 1: Welcome to Node.js Setup
   → Clic en [Next]
   
   Pantalla 2: License Agreement
   → Marca ☑ "I accept the terms..."
   → Clic en [Next]
   
   Pantalla 3: Destination Folder
   → Déjalo como está (C:\Program Files\nodejs\)
   → Clic en [Next]
   
   Pantalla 4: Custom Setup
   → Déjalo como está
   → Clic en [Next]
   
   Pantalla 5: Tools for Native Modules
   → Marca ☑ "Automatically install the necessary tools..."
   → Clic en [Next]
   
   Pantalla 6: Ready to Install
   → Clic en [Install]
   
   → Si aparece "¿Desea permitir...?" → Clic en [Sí]
   
   Pantalla 7: Completed
   → Clic en [Finish]
   ```

### Paso 2.3: Verificar la instalación
1. Presiona las teclas `Windows + R` (al mismo tiempo)
2. Escribe `cmd` y presiona Enter
3. En la ventana negra que aparece, escribe:
   ```
   node --version
   ```
4. Presiona Enter. Deberías ver algo como:
   ```
   v20.10.0
   ```
5. Ahora escribe:
   ```
   npm --version
   ```
6. Deberías ver algo como:
   ```
   10.2.3
   ```

✅ **Si ves números de versión, Node.js está instalado correctamente.**

---

## 3. INSTALAR PYTHON

Python es necesario para ejecutar el servidor (backend).

### Paso 3.1: Descargar Python
1. Abre tu navegador
2. Ve a: **https://www.python.org/downloads/**
3. Haz clic en el botón amarillo que dice **"Download Python 3.x.x"**

### Paso 3.2: Instalar Python
1. Busca el archivo descargado (`python-3.x.x-amd64.exe`)
2. Haz **doble clic** en el archivo
3. **MUY IMPORTANTE**: En la primera pantalla, marca estas opciones:
   
   ```
   ┌─────────────────────────────────────────────────┐
   │  Install Python 3.x.x                           │
   │                                                 │
   │  ☑ Install launcher for all users              │
   │  ☑ Add python.exe to PATH  ← ¡MUY IMPORTANTE!  │
   │                                                 │
   │  [Install Now]  ← Clic aquí                    │
   └─────────────────────────────────────────────────┘
   ```

4. Si aparece "¿Desea permitir...?" → Clic en [Sí]
5. Espera a que termine la instalación
6. Clic en [Close]

### Paso 3.3: Verificar la instalación
1. Presiona `Windows + R`
2. Escribe `cmd` y presiona Enter
3. Escribe:
   ```
   python --version
   ```
4. Deberías ver:
   ```
   Python 3.12.0
   ```
5. También prueba:
   ```
   pip --version
   ```
6. Deberías ver algo como:
   ```
   pip 23.2.1 from ...
   ```

✅ **Si ves las versiones, Python está instalado correctamente.**

---

## 4. INSTALAR MONGODB

MongoDB es la base de datos donde se guardarán todos los datos del sistema.

### Paso 4.1: Descargar MongoDB
1. Ve a: **https://www.mongodb.com/try/download/community**
2. Configura las opciones así:
   ```
   Version: 7.0.x (current)
   Platform: Windows
   Package: msi
   ```
3. Clic en el botón verde **"Download"**

### Paso 4.2: Instalar MongoDB
1. Busca el archivo descargado (`mongodb-windows-x86_64-7.0.x-signed.msi`)
2. Haz **doble clic** en el archivo
3. Sigue estos pasos:

   ```
   Pantalla 1: Welcome
   → Clic en [Next]
   
   Pantalla 2: License Agreement
   → Marca ☑ "I accept the terms..."
   → Clic en [Next]
   
   Pantalla 3: Setup Type
   → Selecciona "Complete"
   → Clic en [Next]
   
   Pantalla 4: Service Configuration
   → Marca ☑ "Install MongoDB as a Service"
   → Marca ○ "Run service as Network Service user"
   → Clic en [Next]
   
   Pantalla 5: Install MongoDB Compass
   → Marca ☑ "Install MongoDB Compass" (es una herramienta visual)
   → Clic en [Next]
   
   Pantalla 6: Ready to Install
   → Clic en [Install]
   → Si aparece "¿Desea permitir...?" → Clic en [Sí]
   
   Pantalla 7: Completed
   → Clic en [Finish]
   ```

### Paso 4.3: Verificar que MongoDB está corriendo
1. Presiona `Windows + R`
2. Escribe `services.msc` y presiona Enter
3. En la lista, busca **"MongoDB Server"**
4. Debe decir **"Running"** (Ejecutándose) en la columna Estado
   
   ```
   Nombre                    Estado
   ─────────────────────────────────
   MongoDB Server           Running  ← Debe decir esto
   ```

5. Si dice "Stopped", haz clic derecho → "Iniciar"

### Paso 4.4: Agregar MongoDB al PATH (para usar en terminal)
1. Presiona `Windows + R`
2. Escribe `sysdm.cpl` y presiona Enter
3. Ve a la pestaña **"Opciones avanzadas"**
4. Clic en **"Variables de entorno..."**
5. En "Variables del sistema", busca **"Path"** y haz doble clic
6. Clic en **"Nuevo"** y agrega:
   ```
   C:\Program Files\MongoDB\Server\7.0\bin
   ```
7. Clic en [Aceptar] en todas las ventanas

### Paso 4.5: Verificar MongoDB
1. Abre una **nueva** ventana de CMD (Presiona `Windows + R`, escribe `cmd`)
2. Escribe:
   ```
   mongosh --version
   ```
3. Deberías ver algo como:
   ```
   2.1.0
   ```

✅ **Si ves la versión, MongoDB está instalado correctamente.**

---

## 5. INSTALAR VISUAL STUDIO CODE

Visual Studio Code (VS Code) es un editor de código que te ayudará a ver y modificar archivos.

### Paso 5.1: Descargar VS Code
1. Ve a: **https://code.visualstudio.com/**
2. Clic en el botón azul **"Download for Windows"**

### Paso 5.2: Instalar VS Code
1. Busca el archivo descargado (`VSCodeUserSetup-x64-x.x.x.exe`)
2. Haz **doble clic** en el archivo
3. Sigue los pasos:

   ```
   Pantalla 1: License Agreement
   → Marca ○ "I accept the agreement"
   → Clic en [Next]
   
   Pantalla 2: Select Destination Location
   → Déjalo como está
   → Clic en [Next]
   
   Pantalla 3: Select Start Menu Folder
   → Déjalo como está
   → Clic en [Next]
   
   Pantalla 4: Select Additional Tasks
   → Marca TODAS las casillas:
     ☑ Create a desktop icon
     ☑ Add "Open with Code" action...
     ☑ Add "Open with Code" action...
     ☑ Register Code as an editor...
     ☑ Add to PATH
   → Clic en [Next]
   
   Pantalla 5: Ready to Install
   → Clic en [Install]
   
   Pantalla 6: Completed
   → Clic en [Finish]
   ```

✅ **VS Code está instalado.**

---

## 6. DESCARGAR EL PROYECTO

### Paso 6.1: Instalar Git
1. Ve a: **https://git-scm.com/download/win**
2. Se descargará automáticamente. Si no, clic en "Click here to download"
3. Ejecuta el instalador y acepta todas las opciones predeterminadas (solo clic en Next, Next, Next... Install)

### Paso 6.2: Descargar el proyecto desde GitHub

**Opción A: Si tu proyecto está en GitHub**
1. Presiona `Windows + R`
2. Escribe `cmd` y presiona Enter
3. Navega a donde quieres guardar el proyecto:
   ```
   cd C:\Users\TU_USUARIO\Documents
   ```
   (Reemplaza TU_USUARIO con tu nombre de usuario de Windows)

4. Clona el proyecto:
   ```
   git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   ```

**Opción B: Si tienes el proyecto en un ZIP**
1. Localiza el archivo ZIP del proyecto
2. Haz clic derecho → "Extraer todo..."
3. Selecciona la carpeta `C:\Users\TU_USUARIO\Documents`
4. Clic en "Extraer"

### Paso 6.3: Abrir el proyecto en VS Code
1. Abre Visual Studio Code
2. Clic en **Archivo** → **Abrir carpeta...**
3. Navega hasta la carpeta del proyecto y selecciónala
4. Clic en **"Seleccionar carpeta"**

Deberías ver esta estructura en el panel izquierdo:
```
📁 tu-proyecto/
├── 📁 backend/
│   ├── 📄 server.py
│   ├── 📄 requirements.txt
│   └── 📄 .env
├── 📁 frontend/
│   ├── 📁 src/
│   ├── 📄 package.json
│   └── 📄 .env
└── 📄 README.md
```

---

## 7. CONFIGURAR LA BASE DE DATOS

### Paso 7.1: Crear la base de datos
1. Abre **MongoDB Compass** (búscalo en el menú inicio)
2. En la pantalla de conexión, verás:
   ```
   URI: mongodb://localhost:27017
   ```
3. Clic en el botón verde **"Connect"**

### Paso 7.2: Crear una nueva base de datos
1. Una vez conectado, clic en el botón **"+"** o **"Create Database"**
2. Llena los campos:
   ```
   Database Name: pharmacy_db
   Collection Name: users
   ```
3. Clic en **"Create Database"**

### Paso 7.3: Verificar la conexión
La base de datos MongoDB escucha en:
```
mongodb://localhost:27017
```

Esta URL la usaremos en la configuración del backend.

---

## 8. CONFIGURAR EL BACKEND

### Paso 8.1: Abrir terminal en VS Code
1. En VS Code, presiona `` Ctrl + ` `` (la tecla debajo del Escape)
2. Se abrirá una terminal en la parte inferior

### Paso 8.2: Navegar a la carpeta backend
En la terminal, escribe:
```
cd backend
```

### Paso 8.3: Crear un entorno virtual de Python
Escribe estos comandos uno por uno:
```
python -m venv venv
```

Espera unos segundos...

### Paso 8.4: Activar el entorno virtual
```
venv\Scripts\activate
```

Deberías ver que la terminal cambia a:
```
(venv) C:\Users\...\backend>
```

### Paso 8.5: Instalar las dependencias
```
pip install -r requirements.txt
```

Esto instalará todos los paquetes necesarios. Espera a que termine (puede tomar unos minutos).

### Paso 8.6: Configurar las variables de entorno
1. En VS Code, en el panel izquierdo, busca la carpeta `backend`
2. Haz clic derecho en `backend` → **"Nuevo archivo"**
3. Nombra el archivo: `.env` (con el punto al inicio)
4. Abre el archivo y pega este contenido:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=pharmacy_db
JWT_SECRET=mi_clave_secreta_super_segura_cambiar_en_produccion
CORS_ORIGINS=http://localhost:3000
```

5. Guarda el archivo (Ctrl + S)

---

## 9. CONFIGURAR EL FRONTEND

### Paso 9.1: Abrir una nueva terminal
1. En VS Code, clic en el botón **"+"** en el panel de terminal (arriba a la derecha de la terminal)
2. Esto abrirá una segunda terminal

### Paso 9.2: Navegar a la carpeta frontend
```
cd frontend
```

### Paso 9.3: Instalar las dependencias
```
npm install
```

O también puedes usar:
```
yarn install
```

Espera a que termine (puede tomar varios minutos la primera vez).

### Paso 9.4: Configurar las variables de entorno del frontend
1. En VS Code, busca la carpeta `frontend`
2. Crea un nuevo archivo llamado `.env`
3. Pega este contenido:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

4. Guarda el archivo (Ctrl + S)

---

## 10. EJECUTAR EL PROYECTO

Ahora vamos a ejecutar todo. Necesitas tener **DOS terminales abiertas**.

### Terminal 1: Backend (Servidor)

1. Asegúrate de estar en la carpeta `backend`:
   ```
   cd backend
   ```

2. Activa el entorno virtual (si no está activado):
   ```
   venv\Scripts\activate
   ```

3. Ejecuta el servidor:
   ```
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```

4. Deberías ver:
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
   INFO:     Started reloader process [xxxxx]
   INFO:     Started server process [xxxxx]
   INFO:     Waiting for application startup.
   INFO:     Application startup complete.
   ```

✅ **El backend está corriendo.**

### Terminal 2: Frontend (Interfaz)

1. En la segunda terminal, ve a la carpeta frontend:
   ```
   cd frontend
   ```

2. Ejecuta el frontend:
   ```
   npm start
   ```

3. Deberías ver:
   ```
   Compiled successfully!

   You can now view the app in the browser.

     Local:            http://localhost:3000
     On Your Network:  http://192.168.x.x:3000
   ```

4. **Se abrirá automáticamente tu navegador** con la aplicación.

✅ **El frontend está corriendo.**

---

## 11. ACCEDER AL SISTEMA

### Paso 11.1: Abrir el navegador
Si no se abrió automáticamente, abre tu navegador y ve a:
```
http://localhost:3000
```

### Paso 11.2: Crear datos iniciales
1. Abre una **nueva terminal** en VS Code
2. Ejecuta este comando para crear los usuarios iniciales:
   ```
   curl -X POST http://localhost:8001/api/seed-data
   ```

   O si no tienes curl, abre el navegador y ve a:
   ```
   http://localhost:8001/api/seed-data
   ```
   (Pega esta URL en el navegador y presiona Enter)

### Paso 11.3: Iniciar sesión

Usa estas credenciales:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador (acceso total) |
| vendedor | vendedor123 | Vendedor (puede vender y gestionar productos) |
| consulta | consulta123 | Consulta (solo puede ver información) |

---

## 12. SOLUCIÓN DE PROBLEMAS

### ❌ Error: "python no se reconoce como comando"
**Solución:**
1. Desinstala Python
2. Vuelve a instalarlo asegurándote de marcar ☑ "Add python.exe to PATH"
3. Reinicia tu computadora

### ❌ Error: "npm no se reconoce como comando"
**Solución:**
1. Desinstala Node.js
2. Vuelve a instalarlo
3. Reinicia tu computadora

### ❌ Error: "ECONNREFUSED" al conectar a MongoDB
**Solución:**
1. Abre "Servicios" (Windows + R → services.msc)
2. Busca "MongoDB Server"
3. Si está detenido, clic derecho → Iniciar

### ❌ Error: "ModuleNotFoundError" en Python
**Solución:**
1. Asegúrate de que el entorno virtual está activado (debes ver `(venv)`)
2. Ejecuta: `pip install -r requirements.txt`

### ❌ Error: "Port 8001 already in use"
**Solución:**
1. Abre CMD como administrador
2. Ejecuta: `netstat -ano | findstr :8001`
3. Anota el número PID (último número)
4. Ejecuta: `taskkill /PID NUMERO_PID /F`

### ❌ Error: "Port 3000 already in use"
**Solución:**
1. Abre CMD como administrador
2. Ejecuta: `netstat -ano | findstr :3000`
3. Anota el número PID
4. Ejecuta: `taskkill /PID NUMERO_PID /F`

### ❌ La página se ve en blanco
**Solución:**
1. Abre la consola del navegador (F12 → Console)
2. Verifica si hay errores en rojo
3. Asegúrate de que el backend está corriendo (Terminal 1)
4. Refresca la página (Ctrl + F5)

### ❌ No puedo eliminar productos
**Solución:**
1. Asegúrate de estar logueado como "admin"
2. Solo los administradores pueden eliminar
3. Refresca la página con Ctrl + Shift + R

---

## 📝 RESUMEN DE COMANDOS

### Iniciar el proyecto (cada vez que quieras usarlo):

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

**Abrir en navegador:**
```
http://localhost:3000
```

---

## 🎉 ¡FELICIDADES!

Si llegaste hasta aquí y todo funciona, ¡ya tienes el sistema corriendo en tu computadora!

### Próximos pasos:
- Explora todas las funciones del sistema
- Crea productos, categorías, proveedores y clientes
- Realiza ventas desde el Punto de Venta
- Genera reportes en Excel
- Crea respaldos de la base de datos

### Soporte:
Si tienes problemas, revisa la sección de "Solución de Problemas" arriba.

---

*Guía creada para el Sistema de Inventario y Facturación - Maribel Farmacia*
*Versión 1.0 - Diciembre 2025*
