# 🚀 GUÍA RÁPIDA: 5 PASOS PARA INSTALAR EN TU PC

## ⚡ INSTALACIÓN EXPRESS (15 minutos)

### 📦 PASO 1: INSTALAR PROGRAMAS NECESARIOS

**Descargar e instalar estos 4 programas:**

1. **Node.js** (para el frontend)
   - 🔗 https://nodejs.org/
   - Descargar versión LTS
   - Siguiente → Siguiente → Instalar

2. **Python** (para el backend)
   - 🔗 https://www.python.org/downloads/
   - ✅ IMPORTANTE: Marcar "Add Python to PATH"
   - Instalar

3. **MongoDB** (base de datos)
   - 🔗 https://www.mongodb.com/try/download/community
   - Seleccionar tu sistema operativo
   - ✅ Marcar "Install as a Service"
   - Instalar

4. **Git** (para clonar el proyecto)
   - 🔗 https://git-scm.com/downloads
   - Siguiente → Siguiente → Instalar

---

### 📥 PASO 2: DESCARGAR EL PROYECTO

1. **Abrir Terminal/CMD:**
   - Windows: Presiona `Windows + R`, escribe `cmd`, Enter
   - Mac: Presiona `Cmd + Space`, escribe "Terminal"
   - Linux: `Ctrl + Alt + T`

2. **Ir a tu carpeta de Documentos:**
   ```bash
   cd Documents
   # o en Windows:
   cd C:\Users\TuUsuario\Documents
   ```

3. **Clonar el proyecto:**
   ```bash
   git clone https://github.com/tu-usuario/maribel-farmacia.git
   cd maribel-farmacia
   ```

---

### ⚙️ PASO 3: CONFIGURAR BACKEND

```bash
# Entrar a la carpeta backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

**Crear archivo `.env`:**
```bash
# Crear y editar con notepad (Windows):
notepad .env

# O con nano (Mac/Linux):
nano .env
```

**Pegar este contenido:**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=maribel_farmacia
CORS_ORIGINS=*
JWT_SECRET=maribel-farmacia-secret-key-2025
```
Guardar (Ctrl+S) y cerrar

---

### 🎨 PASO 4: CONFIGURAR FRONTEND

**Abrir NUEVA terminal** (no cerrar la anterior)

```bash
# Volver a la carpeta raíz del proyecto
cd maribel-farmacia/frontend

# Instalar yarn (opcional pero recomendado)
npm install -g yarn

# Instalar dependencias
yarn install
# o si prefieres npm:
npm install
```

**Crear archivo `.env`:**
```bash
# Windows:
notepad .env

# Mac/Linux:
nano .env
```

**Pegar este contenido:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```
Guardar y cerrar

---

### 🚀 PASO 5: ¡INICIAR!

Necesitas **2 terminales abiertas:**

**🔷 TERMINAL 1 - Backend:**
```bash
cd maribel-farmacia/backend

# Activar entorno (si no está activo)
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Iniciar servidor
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**Esperar mensaje:**
```
INFO:     Uvicorn running on http://0.0.0.0:8001
✅ Backend corriendo!
```

**🔷 TERMINAL 2 - Frontend:**
```bash
cd maribel-farmacia/frontend

# Iniciar aplicación
yarn start
# o
npm start
```

**Esperar mensaje:**
```
Compiled successfully!
The app is running at: http://localhost:3000
✅ Frontend corriendo!
```

---

## 🎯 ¡LISTO! ACCEDE A TU SISTEMA

### 🌐 Abrir en el navegador:
http://localhost:3000

### 🔐 Iniciar sesión con:
- **Usuario:** admin
- **Contraseña:** admin123

### 📊 Cargar datos de ejemplo:

**Opción A - Desde el navegador:**
1. Abrir nueva pestaña: http://localhost:8001/docs
2. Buscar `/seed-data`
3. Click en "Try it out"
4. Click en "Execute"

**Opción B - Desde terminal:**
```bash
curl -X POST http://localhost:8001/api/seed-data
```

✅ Esto creará:
- 3 usuarios (admin, vendedor, consulta)
- 5 categorías
- 2 proveedores
- 6 productos
- 3 clientes
- 2 ventas de ejemplo

---

## 🔄 PRÓXIMAS VECES (más rápido)

Una vez instalado, solo necesitas:

**Terminal 1:**
```bash
cd maribel-farmacia/backend
venv\Scripts\activate  # o source venv/bin/activate
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**Terminal 2:**
```bash
cd maribel-farmacia/frontend
yarn start
```

---

## 📝 CREAR ATAJOS (Opcional)

### Windows - Crear archivos .bat

**`iniciar-backend.bat`:**
```batch
@echo off
cd maribel-farmacia\backend
call venv\Scripts\activate
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
pause
```

**`iniciar-frontend.bat`:**
```batch
@echo off
cd maribel-farmacia\frontend
yarn start
pause
```

Doble click en cada archivo para iniciar!

### Mac/Linux - Crear archivos .sh

**`iniciar-backend.sh`:**
```bash
#!/bin/bash
cd maribel-farmacia/backend
source venv/bin/activate
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**`iniciar-frontend.sh`:**
```bash
#!/bin/bash
cd maribel-farmacia/frontend
yarn start
```

```bash
chmod +x *.sh
./iniciar-backend.sh  # En una terminal
./iniciar-frontend.sh  # En otra terminal
```

---

## 🆘 PROBLEMAS COMUNES

### ❌ "python no se reconoce"
**Solución:** Reinstalar Python y marcar "Add to PATH"

### ❌ "Puerto 8001 ya en uso"
**Solución Windows:**
```cmd
netstat -ano | findstr :8001
taskkill /PID [numero] /F
```

### ❌ "MongoDB connection refused"
**Solución:**
```bash
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### ❌ "Module not found"
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules
yarn install
```

---

## 📱 ACCEDER DESDE CELULAR/TABLET

1. **En tu PC, obtener IP:**
   ```bash
   # Windows:
   ipconfig
   # Mac/Linux:
   ifconfig
   ```
   Buscar algo como: `192.168.1.100`

2. **Cambiar frontend/.env:**
   ```env
   REACT_APP_BACKEND_URL=http://192.168.1.100:8001
   ```

3. **Reiniciar frontend**

4. **En tu celular/tablet:**
   Abrir navegador: `http://192.168.1.100:3000`

---

## ✅ VERIFICACIÓN RÁPIDA

| Componente | URL | Estado |
|------------|-----|--------|
| Frontend | http://localhost:3000 | ✅ Login visible |
| Backend API | http://localhost:8001 | ✅ JSON visible |
| API Docs | http://localhost:8001/docs | ✅ Swagger UI |
| MongoDB | mongodb://localhost:27017 | ✅ Conectado |

---

## 🎓 SIGUIENTE NIVEL

### Hacer que inicie automáticamente:

**Windows - Crear archivo `inicio-automatico.vbs`:**
```vb
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c cd maribel-farmacia\backend && venv\Scripts\activate && python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001", 0
WScript.Sleep 5000
WshShell.Run "cmd /c cd maribel-farmacia\frontend && yarn start", 0
```

Guardar en Inicio de Windows:
`C:\Users\TuUsuario\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`

---

## 🔥 COMANDOS TODO-EN-UNO

### Para expertos - Un solo comando:

**Mac/Linux:**
```bash
git clone https://github.com/tu-usuario/maribel-farmacia.git && \
cd maribel-farmacia && \
cd backend && python3 -m venv venv && source venv/bin/activate && \
pip install -r requirements.txt && \
echo "MONGO_URL=mongodb://localhost:27017
DB_NAME=maribel_farmacia
CORS_ORIGINS=*
JWT_SECRET=maribel-farmacia-secret-key-2025" > .env && \
cd ../frontend && yarn install && \
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env && \
echo "✅ ¡Instalación completa!"
```

---

## 📞 NECESITAS AYUDA?

1. Ver guía completa: `GUIA_INSTALACION_LOCAL.md`
2. Revisar documentación: `PROYECTO_COMPLETO.md`
3. Verificar logs de error en las terminales

**¡Éxito con tu instalación! 🎉**
