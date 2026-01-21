@echo off
chcp 65001 >nul
title Instalador - Farmacia Maribel
color 0A

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║     INSTALADOR - SISTEMA FARMACIA MARIBEL                    ║
echo ║     Instalando dependencias del proyecto...                  ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo [1/4] Verificando Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Python no está instalado o no está en el PATH
    echo    Por favor, instala Python desde https://www.python.org/downloads/
    echo    IMPORTANTE: Marca la casilla "Add Python to PATH" al instalar
    pause
    exit /b 1
)
echo ✅ Python encontrado

echo.
echo [2/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js no está instalado
    echo    Por favor, instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js encontrado

echo.
echo [3/4] Instalando dependencias del Backend (Python)...
echo    Esto puede tardar unos minutos...
cd /d "%~dp0backend"
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ ERROR al instalar dependencias de Python
    pause
    exit /b 1
)
echo ✅ Dependencias de Backend instaladas

echo.
echo [4/4] Instalando dependencias del Frontend (Node.js)...
echo    Esto puede tardar varios minutos...
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
    echo ❌ ERROR al instalar dependencias de Node.js
    pause
    exit /b 1
)
echo ✅ Dependencias de Frontend instaladas

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║     ✅ INSTALACIÓN COMPLETADA EXITOSAMENTE                   ║
echo ╠═══════════════════════════════════════════════════════════════╣
echo ║                                                               ║
echo ║  Para iniciar el sistema, ejecuta: INICIAR_SISTEMA.bat       ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

pause
