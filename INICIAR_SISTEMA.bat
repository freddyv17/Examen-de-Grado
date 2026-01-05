@echo off
echo ============================================
echo   MARIBEL FARMACIA - Iniciador del Sistema
echo ============================================
echo.

:: Verificar que MongoDB esté corriendo
echo [1/4] Verificando MongoDB...
sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 (
    echo      MongoDB no esta corriendo. Intentando iniciar...
    net start MongoDB
    timeout /t 3 >nul
) else (
    echo      MongoDB esta corriendo correctamente.
)
echo.

:: Iniciar Backend
echo [2/4] Iniciando Backend...
cd /d "%~dp0backend"
if exist "venv\Scripts\activate.bat" (
    start "Backend - Maribel Farmacia" cmd /k "venv\Scripts\activate && uvicorn server:app --host 0.0.0.0 --port 8001 --reload"
) else (
    echo      ERROR: No se encontro el entorno virtual.
    echo      Ejecuta primero: python -m venv venv
    pause
    exit /b 1
)
echo      Backend iniciado en http://localhost:8001
echo.

:: Esperar un momento para que el backend inicie
timeout /t 5 >nul

:: Iniciar Frontend
echo [3/4] Iniciando Frontend...
cd /d "%~dp0frontend"
start "Frontend - Maribel Farmacia" cmd /k "npm start"
echo      Frontend iniciado en http://localhost:3000
echo.

:: Esperar y abrir navegador
echo [4/4] Abriendo navegador...
timeout /t 8 >nul
start http://localhost:3000

echo.
echo ============================================
echo   Sistema iniciado correctamente!
echo ============================================
echo.
echo   - Backend: http://localhost:8001
echo   - Frontend: http://localhost:3000
echo.
echo   Usuarios de prueba:
echo   - admin / admin123 (Administrador)
echo   - vendedor / vendedor123 (Vendedor)
echo   - consulta / consulta123 (Solo consulta)
echo.
echo   Para detener el sistema, cierra las ventanas
echo   de comandos que se abrieron.
echo.
echo ============================================
pause
