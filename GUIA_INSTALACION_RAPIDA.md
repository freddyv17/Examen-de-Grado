# 🏥 GUÍA RÁPIDA DE INSTALACIÓN
## Sistema de Control de Inventario y Facturación - Farmacia Maribel

---

## 📦 PASO 1: Descomprimir el Proyecto

1. **Descarga** el archivo `FarmaciaMaribel.rar` en tu computadora
2. **Clic derecho** sobre el archivo → **"Extraer aquí"** o **"Extract Here"**
3. Se creará una carpeta llamada `FarmaciaMaribel`

> 💡 Si no tienes WinRAR, descárgalo gratis de: https://www.win-rar.com/download.html

---

## 🛠️ PASO 2: Instalar Programas Necesarios

### 2.1 Instalar Python (Backend)
1. Ve a: https://www.python.org/downloads/
2. Descarga **Python 3.11** o superior
3. Al instalar, **MARCA** la casilla ✅ **"Add Python to PATH"**
4. Clic en **"Install Now"**

### 2.2 Instalar Node.js (Frontend)
1. Ve a: https://nodejs.org/
2. Descarga la versión **LTS** (recomendada)
3. Ejecuta el instalador y sigue los pasos

### 2.3 Instalar MongoDB (Base de Datos)
1. Ve a: https://www.mongodb.com/try/download/community
2. Descarga **MongoDB Community Server**
3. Ejecuta el instalador
4. Selecciona **"Complete"** en tipo de instalación
5. **MARCA** ✅ **"Install MongoDB as a Service"**
6. Finaliza la instalación

---

## ⚙️ PASO 3: Configurar el Proyecto

### 3.1 Abrir la Carpeta del Proyecto
1. Abre la carpeta `FarmaciaMaribel` que descomprimiste
2. Dentro verás las carpetas: `backend` y `frontend`

### 3.2 Configurar el Backend
1. Abre la carpeta `backend`
2. Busca el archivo `.env` (si no existe, créalo)
3. Asegúrate que contenga:

```
MONGO_URL=mongodb://localhost:27017
DB_NAME=farmacia_maribel
JWT_SECRET=tu-clave-secreta-aqui-123
```

### 3.3 Configurar el Frontend
1. Abre la carpeta `frontend`
2. Busca el archivo `.env`
3. Asegúrate que contenga:

```
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## 📥 PASO 4: Instalar Dependencias

### Opción A: Usar el Instalador Automático (Recomendado)
1. Haz **doble clic** en el archivo `INSTALAR.bat` dentro de la carpeta principal
2. Espera a que termine (puede tardar unos minutos)

### Opción B: Instalación Manual
1. **Abre CMD** (tecla Windows + R, escribe `cmd`, Enter)

2. **Navega a la carpeta backend:**
```cmd
cd C:\ruta\donde\esta\FarmaciaMaribel\backend
```

3. **Instala dependencias de Python:**
```cmd
pip install -r requirements.txt
```

4. **Navega a la carpeta frontend:**
```cmd
cd ..\frontend
```

5. **Instala dependencias de Node:**
```cmd
npm install
```

---

## ▶️ PASO 5: Iniciar el Sistema

### Opción A: Usar el Iniciador Automático (Recomendado)
1. Haz **doble clic** en el archivo `INICIAR_SISTEMA.bat`
2. Se abrirán 2 ventanas de comandos (no las cierres)
3. Espera unos segundos hasta que aparezca el mensaje de éxito

### Opción B: Inicio Manual

**Terminal 1 - Backend:**
```cmd
cd C:\ruta\FarmaciaMaribel\backend
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Frontend:**
```cmd
cd C:\ruta\FarmaciaMaribel\frontend
npm start
```

---

## 🌐 PASO 6: Acceder al Sistema

1. Abre tu navegador (Chrome, Firefox, Edge)
2. Ve a: **http://localhost:3000**
3. Inicia sesión con las credenciales:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | Administrador |
| `vendedor` | `vendedor123` | Vendedor |
| `consulta` | `consulta123` | Consulta |

---

## 🗄️ PASO 7: Cargar Datos de Prueba (Opcional)

Si la base de datos está vacía, puedes cargar datos de ejemplo:

1. Abre CMD
2. Navega al backend:
```cmd
cd C:\ruta\FarmaciaMaribel\backend
```
3. Ejecuta el script de datos:
```cmd
python crear_datos_completo.py
```

---

## ❓ SOLUCIÓN DE PROBLEMAS

### Error: "Python no se reconoce como comando"
- Reinstala Python y **marca** ✅ "Add Python to PATH"
- O agrega Python al PATH manualmente

### Error: "npm no se reconoce como comando"
- Reinstala Node.js
- Reinicia la computadora

### Error: "MongoDB connection failed"
1. Abre **Servicios de Windows** (Windows + R → `services.msc`)
2. Busca **"MongoDB Server"**
3. Clic derecho → **Iniciar**

### La página no carga
- Verifica que ambos servidores estén corriendo
- Revisa que los puertos 3000 y 8001 no estén ocupados
- Desactiva temporalmente el firewall

### Error al instalar dependencias de Python
```cmd
pip install --upgrade pip
pip install -r requirements.txt
```

### Error al instalar dependencias de Node
```cmd
npm cache clean --force
npm install
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
FarmaciaMaribel/
├── backend/
│   ├── server.py              # Servidor principal
│   ├── requirements.txt       # Dependencias Python
│   ├── .env                   # Configuración
│   └── crear_datos_completo.py # Script de datos
├── frontend/
│   ├── src/                   # Código fuente React
│   ├── public/                # Archivos públicos
│   ├── package.json           # Dependencias Node
│   └── .env                   # Configuración
├── INSTALAR.bat               # Instalador automático
├── INICIAR_SISTEMA.bat        # Iniciador automático
└── GUIA_INSTALACION.md        # Esta guía
```

---

## 📞 SOPORTE

Si tienes problemas con la instalación:
1. Revisa esta guía paso a paso
2. Verifica que todos los programas estén instalados correctamente
3. Reinicia la computadora e intenta de nuevo

---

**¡Listo! Tu sistema de Farmacia Maribel está instalado y funcionando.** 🎉

---
*Versión del Sistema: 1.0*
*Fecha: Diciembre 2025*
