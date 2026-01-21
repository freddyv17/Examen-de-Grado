@echo off
chcp 65001 >nul
title Detener Sistema - Farmacia Maribel
color 0C

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║     DETENIENDO SISTEMA FARMACIA MARIBEL                      ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo Cerrando procesos del Backend y Frontend...

taskkill /F /IM "python.exe" /T >nul 2>&1
taskkill /F /IM "node.exe" /T >nul 2>&1

echo.
echo ✅ Sistema detenido correctamente
echo.

pause
