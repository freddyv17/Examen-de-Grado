@echo off
chcp 65001 >nul
title Sistema Farmacia Maribel - Iniciando...
color 0B

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║     SISTEMA DE CONTROL DE INVENTARIO Y FACTURACIÓN           ║
echo ║                  FARMACIA MARIBEL                            ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo [1/3] Verificando MongoDB...
sc query MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  ADVERTENCIA: El servicio MongoDB no está instalado como servicio
    echo    Asegúrate de que MongoDB esté corriendo manualmente
) else (
    echo ✅ Servicio MongoDB encontrado
)

echo.
echo [2/3] Iniciando Backend (Puerto 8001)...
start "Backend - Farmacia Maribel" cmd /k "cd /d %~dp0backend && python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload"

echo    Esperando a que el backend inicie...
timeout /t 5 /nobreak >nul

echo.
echo [3/3] Iniciando Frontend (Puerto 3000)...
start "Frontend - Farmacia Maribel" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║     ✅ SISTEMA INICIADO                                      ║
echo ╠═══════════════════════════════════════════════════════════════╣
echo ║                                                               ║
echo ║  🌐 Abre tu navegador en: http://localhost:3000              ║
echo ║                                                               ║
echo ║  📋 CREDENCIALES:                                            ║
echo ║     Usuario: admin                                           ║
echo ║     Contraseña: admin123                                     ║
echo ║                                                               ║
echo ║  ⚠️  NO CIERRES las ventanas de comandos que se abrieron     ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo Presiona cualquier tecla para abrir el navegador...
pause >nul

start http://localhost:3000
