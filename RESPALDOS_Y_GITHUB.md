# 📁 UBICACIÓN DE LOS RESPALDOS Y SINCRONIZACIÓN CON GITHUB

## 📥 ¿DÓNDE SE GUARDAN LOS RESPALDOS?

### Respaldos de Base de Datos (.json)

**Ubicación:** Se descargan directamente en tu computadora

**Carpeta predeterminada:**
- 🪟 Windows: `C:\Users\TuUsuario\Downloads\backup_YYYY-MM-DD.json`
- 🍎 macOS: `/Users/TuUsuario/Downloads/backup_YYYY-MM-DD.json`
- 🐧 Linux: `/home/TuUsuario/Descargas/backup_YYYY-MM-DD.json`

**Características:**
- ✅ Archivo JSON con todas las colecciones
- ✅ Tamaño: ~18KB (con datos de ejemplo)
- ✅ Formato: `backup_2025-12-19.json`
- ✅ Se puede abrir con cualquier editor de texto
- ✅ Compatible con la función "Restaurar"

**Contenido del archivo:**
```json
{
  "timestamp": "2025-12-19T20:30:27.448582+00:00",
  "users": [...],
  "categories": [...],
  "suppliers": [...],
  "products": [...],
  "customers": [...],
  "sales": [...],
  "inventory_movements": [...]
}
```

---

## 🔄 REPORTES EXCEL (.xlsx)

**Ubicación:** También se descargan en tu carpeta de Descargas

**Nombres de archivos:**
- `reporte_ventas.xlsx`
- `reporte_inventario.xlsx`
- `reporte_productos_vencer.xlsx`
- `reporte_mas_vendidos.xlsx`
- `reporte_movimientos.xlsx`
- `reporte_transacciones.xlsx`

**Características:**
- ✅ Formato Excel (.xlsx)
- ✅ Tamaño: 5-10KB por reporte
- ✅ Se pueden abrir con Excel, LibreOffice, Google Sheets
- ✅ Formato profesional con columnas organizadas

---

## 🔄 RECIBOS DE VENTA

### Al hacer una venta en el POS:

**Opción 1: IMPRIMIR** 🖨️
- Click en botón "Imprimir"
- Se abre el diálogo de impresión del navegador
- Puedes:
  - Imprimir en papel
  - Guardar como PDF
  - Enviar a impresora conectada

**Opción 2: DESCARGAR** 📥
- Click en botón "Descargar"
- Se abre nueva ventana con el recibo
- Puedes:
  - Guardar como PDF desde el navegador (Ctrl+P → Guardar como PDF)
  - Imprimir desde esa ventana
  - Copiar el contenido

---

## 💾 RECOMENDACIONES DE RESPALDO

### Para la Base de Datos:

1. **Frecuencia recomendada:**
   - 📅 Diario: Si hay muchas ventas
   - 📅 Semanal: Para operaciones normales
   - 📅 Mensual: Como mínimo

2. **Organización de archivos:**
   ```
   📁 Mis Documentos/
   └── 📁 Respaldos Maribel Farmacia/
       ├── 📁 2025/
       │   ├── 📁 01-Enero/
       │   │   ├── backup_2025-01-01.json
       │   │   ├── backup_2025-01-08.json
       │   │   └── backup_2025-01-15.json
       │   └── 📁 02-Febrero/
       └── 📁 Respaldos Críticos/
   ```

3. **Múltiples ubicaciones:**
   - ✅ Computadora local
   - ✅ USB o disco externo
   - ✅ Google Drive / OneDrive / Dropbox
   - ✅ Email (enviarte a ti mismo)

4. **Verificación:**
   - Abrir el archivo JSON ocasionalmente
   - Verificar que sea legible
   - Probar la restauración en ambiente de prueba

---

## 🐙 SINCRONIZACIÓN CON GITHUB

### ✅ SÍ, PUEDES CONECTAR TU PROYECTO A GITHUB

**Importante:** Este sistema tiene una función especial para GitHub integrada.

### 🎯 CÓMO CONECTAR CON GITHUB:

#### Opción 1: Usar la función "Save to Github" (RECOMENDADO)

**Pasos:**

1. **Ir al input de chat** (donde escribes mensajes)

2. **Buscar el botón "Save to Github"** 
   - Está en la interfaz del chat
   - Puede estar en la parte superior o junto al input

3. **Click en "Save to Github"**
   - Te pedirá conectar tu cuenta de GitHub
   - Seleccionas o creas un repositorio
   - ✅ Todo el código se sube automáticamente

4. **Sincronización automática:**
   - Cada vez que se hace un cambio aquí
   - Puedes usar "Save to Github" nuevamente
   - ✅ Los cambios se suben a GitHub

**Ventajas:**
- ✅ Sincronización segura
- ✅ Control de versiones automático
- ✅ No necesitas comandos git
- ✅ Interfaz visual fácil de usar

---

#### Opción 2: GitHub manual (después de descargar)

Si descargas el proyecto localmente:

1. **Crear repositorio en GitHub:**
   ```
   https://github.com/new
   ```

2. **Desde tu computadora local:**
   ```bash
   cd /ruta/a/tu/proyecto
   git init
   git add .
   git commit -m "Initial commit: Sistema Maribel Farmacia"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/maribel-farmacia.git
   git push -u origin main
   ```

3. **Para actualizar después de cambios:**
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   git push
   ```

---

## 🔄 FLUJO DE TRABAJO RECOMENDADO

### Para Desarrollo Continuo:

```
┌─────────────────────────────────────────┐
│  1. Desarrollar aquí (Emergent Agent)  │
│     - Hacer cambios                     │
│     - Probar funcionalidad              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  2. Guardar en GitHub                   │
│     - Click "Save to Github"            │
│     - Commit automático                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  3. GitHub actualizado                  │
│     - Código versionado                 │
│     - Historial de cambios              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  4. Clonar en otra computadora          │
│     - git clone <url>                   │
│     - Continuar desarrollo              │
└─────────────────────────────────────────┘
```

---

## 📦 ESTRUCTURA DEL PROYECTO EN GITHUB

Cuando subas a GitHub, tendrás:

```
tu-repositorio/
├── README.md
├── PROYECTO_COMPLETO.md
├── GUIA_PRUEBAS.md
├── MEJORAS_IMPLEMENTADAS.md
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env (NO subir a GitHub!)
├── frontend/
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   └── .env (NO subir a GitHub!)
└── .gitignore (IMPORTANTE: excluir .env)
```

---

## 🔒 ARCHIVOS QUE NO DEBES SUBIR A GITHUB

**Archivo `.gitignore` recomendado:**

```gitignore
# Variables de entorno
.env
*.env

# Node modules
node_modules/
/frontend/node_modules/

# Python
__pycache__/
*.py[cod]
*$py.class
.venv/
venv/

# Respaldos locales
*.json
backups/

# Logs
*.log
npm-debug.log*

# Sistema
.DS_Store
Thumbs.db
```

---

## 🎯 VENTAJAS DE USAR GITHUB

### 1. **Control de Versiones**
- ✅ Historial completo de cambios
- ✅ Puedes volver a versiones anteriores
- ✅ Ver quién cambió qué y cuándo

### 2. **Respaldo en la Nube**
- ✅ Tu código está seguro en GitHub
- ✅ No se pierde si falla tu computadora
- ✅ Accesible desde cualquier lugar

### 3. **Colaboración**
- ✅ Trabajar en equipo
- ✅ Pull requests para revisión
- ✅ Issues para reportar bugs

### 4. **Despliegue**
- ✅ Conectar con servicios de hosting
- ✅ CI/CD automático
- ✅ GitHub Pages para documentación

---

## 💡 CONSEJOS IMPORTANTES

### Para Respaldos:

1. **Automatizar:**
   - Crear recordatorios para hacer respaldos
   - Establecer una rutina semanal

2. **Verificar:**
   - Probar la restauración ocasionalmente
   - Asegurarse que los archivos son válidos

3. **Múltiples copias:**
   - Nunca confiar en una sola ubicación
   - Usar regla 3-2-1:
     - 3 copias totales
     - 2 medios diferentes
     - 1 copia fuera del sitio

### Para GitHub:

1. **Commits descriptivos:**
   ```
   ✅ "Agregar recibo imprimible en POS"
   ✅ "Corregir error de respaldo de base de datos"
   ❌ "cambios"
   ❌ "fix"
   ```

2. **Proteger información sensible:**
   - ✅ Usar .gitignore
   - ✅ No subir archivos .env
   - ✅ No subir contraseñas

3. **Branches para desarrollo:**
   ```
   main        ← Código estable
   develop     ← Desarrollo activo
   feature/x   ← Nuevas características
   ```

---

## 🚀 RESUMEN RÁPIDO

### Respaldos de Base de Datos:
- 📥 Se descargan en `Descargas/backup_YYYY-MM-DD.json`
- 💾 Guardar en múltiples ubicaciones
- 📅 Hacer respaldos regularmente

### GitHub:
- 🐙 Usar botón "Save to Github" en la interfaz
- ✅ Sincronización automática de cambios
- 🔒 No subir archivos .env
- 📝 Commits descriptivos

### Reportes y Recibos:
- 📊 Excel: Se descargan en Descargas/
- 🧾 Recibos: Imprimir o guardar como PDF

**¿Necesitas ayuda específica con GitHub? ¡Avísame! 🎉**
