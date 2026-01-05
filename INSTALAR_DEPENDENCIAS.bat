@echo off
echo ============================================
echo   MARIBEL FARMACIA - Instalador
echo ============================================
echo.
echo Este script instalara todas las dependencias
echo necesarias para el proyecto.
echo.
echo REQUISITOS PREVIOS:
echo   - Node.js instalado
echo   - Python instalado
echo   - MongoDB instalado y corriendo
echo.
pause

:: Verificar Node.js
echo.
echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo      ERROR: Node.js no esta instalado.
    echo      Descargalo de: https://nodejs.org
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do echo      Version encontrada: %%i
)

:: Verificar Python
echo.
echo [2/5] Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo      ERROR: Python no esta instalado.
    echo      Descargalo de: https://python.org
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('python --version') do echo      Version encontrada: %%i
)

:: Configurar Backend
echo.
echo [3/5] Configurando Backend...
cd /d "%~dp0backend"

echo      Creando entorno virtual...
python -m venv venv

echo      Activando entorno virtual...
call venv\Scripts\activate.bat

echo      Instalando dependencias de Python...
pip install -r requirements.txt

:: Crear archivo .env si no existe
if not exist ".env" (
    echo      Creando archivo de configuracion...
    (
        echo MONGO_URL=mongodb://localhost:27017
        echo DB_NAME=pharmacy_db
        echo JWT_SECRET=clave_secreta_cambiar_en_produccion_12345
        echo CORS_ORIGINS=http://localhost:3000
    ) > .env
    echo      Archivo .env creado.
) else (
    echo      Archivo .env ya existe.
)

:: Configurar Frontend
echo.
echo [4/5] Configurando Frontend...
cd /d "%~dp0frontend"

echo      Instalando dependencias de Node.js...
call npm install

:: Crear archivo .env si no existe
if not exist ".env" (
    echo      Creando archivo de configuracion...
    echo REACT_APP_BACKEND_URL=http://localhost:8001 > .env
    echo      Archivo .env creado.
) else (
    echo      Archivo .env ya existe.
)

:: Finalizado
echo.
echo [5/5] Instalacion completada!
echo.
echo ============================================
echo   INSTALACION EXITOSA
echo ============================================
echo.
echo Para iniciar el sistema, ejecuta:
echo   INICIAR_SISTEMA.bat
echo.
echo O manualmente:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   venv\Scripts\activate
echo   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm start
echo.
echo ============================================
pause
