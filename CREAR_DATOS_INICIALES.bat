@echo off
echo ============================================
echo   MARIBEL FARMACIA - Crear Datos Iniciales
echo ============================================
echo.
echo Este script creara los usuarios y datos
echo de ejemplo en la base de datos.
echo.
echo IMPORTANTE: El backend debe estar corriendo.
echo.
pause

echo.
echo Creando datos iniciales...
echo.

:: Intentar con curl
curl -X POST http://localhost:8001/api/seed-data 2>nul
if errorlevel 1 (
    echo.
    echo Si no funciono, abre tu navegador y ve a:
    echo http://localhost:8001/api/seed-data
)

echo.
echo ============================================
echo   DATOS CREADOS
echo ============================================
echo.
echo Usuarios creados:
echo.
echo   ADMINISTRADOR:
echo     Usuario: admin
echo     Contrasena: admin123
echo.
echo   VENDEDOR:
echo     Usuario: vendedor  
echo     Contrasena: vendedor123
echo.
echo   CONSULTA:
echo     Usuario: consulta
echo     Contrasena: consulta123
echo.
echo ============================================
pause
