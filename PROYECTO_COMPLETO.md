# 🏥 MARIBEL FARMACIA - Sistema de Inventario y Facturación

## 📋 INFORMACIÓN DEL PROYECTO

**Estudiante:** Freddy Alonso Valencia Hernandez (20-02190-0)  
**Universidad:** Universidad Nacional Autónoma de Nicaragua, León  
**Carrera:** Ingeniería en Sistemas de Información  
**Proyecto:** Examen de Grado - Sistema de Control de Inventario y Facturación de Farmacia

---

## ✅ REQUISITOS CUMPLIDOS (10/10)

### 1. ✅ Funcionalidades Implementadas (12 funcionalidades)
1. **Autenticación y Autorización** - Sistema JWT con 3 roles
2. **Gestión de Usuarios** - CRUD completo con roles
3. **Gestión de Productos** - CRUD con control de stock
4. **Gestión de Categorías** - CRUD completo
5. **Gestión de Proveedores** - CRUD completo
6. **Gestión de Clientes** - CRUD completo
7. **Punto de Venta (POS)** - Sistema de facturación en tiempo real
8. **Historial de Ventas** - Consulta y visualización detallada
9. **Control de Inventario** - Movimientos y alertas de stock
10. **Sistema de Reportes** - 6 tipos de reportes exportables
11. **Dashboard con Estadísticas** - KPIs y gráficos en tiempo real
12. **Respaldo y Restauración** - Backup/Restore de base de datos

### 2. ✅ Sistema de Autenticación (3 roles)
- **Administrador** - Acceso total al sistema
- **Vendedor** - Ventas, productos, clientes, inventario
- **Consulta** - Solo lectura de información

### 3. ✅ Base de Datos MongoDB (8 colecciones)
1. `users` - Usuarios del sistema
2. `products` - Productos/medicamentos
3. `categories` - Categorías de productos
4. `suppliers` - Proveedores
5. `customers` - Clientes
6. `sales` - Ventas/facturas
7. `sale_details` - Detalles de ventas (embedded)
8. `inventory_movements` - Movimientos de inventario

### 4. ✅ Operaciones CRUD
- CRUD completo para todas las entidades principales
- Validaciones de campos en todos los formularios
- Manejo de errores y mensajes al usuario

### 5. ✅ 6 Reportes Exportables a Excel
1. **Reporte de Ventas** - Maestro-detalle con parámetros de fecha
2. **Reporte de Inventario** - Stock actual de todos los productos
3. **Productos Próximos a Vencer** - Con parámetro de días
4. **Productos Más Vendidos** - Top 10 con estadísticas
5. **Movimientos de Inventario** - Con parámetros de fecha
6. **Historial de Transacciones** - Registro completo de ventas

### 6. ✅ Dashboard con 2+ Gráficos
1. **Gráfico de Líneas** - Ventas de los últimos 30 días
2. **Gráfico de Barras** - Top 10 productos más vendidos
3. **4 KPIs Principales:**
   - Ventas del día
   - Productos con stock bajo
   - Total de productos activos
   - Total de clientes

### 7. ✅ Respaldo y Restauración
- Exportación completa de la base de datos en JSON
- Restauración de respaldos con confirmación
- Interfaz intuitiva para gestión de backups

### 8. ✅ APIs RESTful
- FastAPI con documentación automática (Swagger)
- Endpoints organizados por recursos
- Autenticación JWT en todas las rutas protegidas
- Validación de permisos por rol

### 9. ✅ Frameworks Utilizados
- **Backend:** FastAPI 0.110.1
- **Frontend:** React 19 + Tailwind CSS
- **Base de Datos:** MongoDB con Motor (driver async)
- **Gráficos:** Recharts
- **UI Components:** Radix UI + shadcn/ui

### 10. ✅ Administración de Roles
- Interfaz completa para gestionar usuarios
- Asignación y modificación de roles
- Activación/desactivación de usuarios

---

## 🚀 TECNOLOGÍAS UTILIZADAS

### Backend
- **FastAPI** - Framework web moderno y rápido
- **Motor** - Driver asíncrono para MongoDB
- **JWT** - Autenticación con tokens
- **Bcrypt** - Encriptación de contraseñas
- **Pandas** - Generación de reportes Excel
- **Pydantic** - Validación de datos

### Frontend
- **React 19** - Biblioteca de UI
- **React Router DOM** - Navegación SPA
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework de estilos
- **Recharts** - Gráficos y visualizaciones
- **Lucide React** - Iconos modernos
- **Radix UI** - Componentes accesibles

### Base de Datos
- **MongoDB** - Base de datos NoSQL
- 8 colecciones principales
- Índices para optimización de consultas

---

## 👥 USUARIOS DE PRUEBA

### Administrador
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Permisos:** Acceso total al sistema

### Vendedor
- **Usuario:** `vendedor`
- **Contraseña:** `vendedor123`
- **Permisos:** Ventas, productos, inventario

### Consulta
- **Usuario:** `consulta`
- **Contraseña:** `consulta123`
- **Permisos:** Solo lectura

---

## 📊 DATOS DE EJEMPLO

El sistema incluye datos de ejemplo:
- 3 usuarios (uno por cada rol)
- 5 categorías de medicamentos
- 2 proveedores
- 6 productos con diferentes niveles de stock
- 3 clientes registrados
- 2 ventas de ejemplo

---

## 🎨 CARACTERÍSTICAS DESTACADAS

### Interfaz de Usuario
- ✅ Diseño moderno y profesional
- ✅ Logo personalizado de Maribel Farmacia
- ✅ Responsive (adaptable a móviles)
- ✅ Sidebar con navegación intuitiva
- ✅ Colores corporativos (verde esmeralda)
- ✅ Iconos descriptivos en cada sección

### Punto de Venta (POS)
- ✅ Búsqueda rápida de productos
- ✅ Carrito de compras interactivo
- ✅ Cálculo automático de totales
- ✅ Descuentos e impuestos
- ✅ Múltiples métodos de pago
- ✅ Actualización automática de inventario

### Control de Inventario
- ✅ Alertas de stock bajo
- ✅ Registro de movimientos (entradas/salidas/ajustes)
- ✅ Control de fechas de vencimiento
- ✅ Trazabilidad completa

### Dashboard Analítico
- ✅ Métricas en tiempo real
- ✅ Gráficos interactivos
- ✅ KPIs del negocio
- ✅ Resumen mensual

### Sistema de Reportes
- ✅ 6 tipos de reportes diferentes
- ✅ Exportación a Excel (.xlsx)
- ✅ Reportes maestro-detalle
- ✅ Filtros por fecha
- ✅ Formato profesional

---

## 🔐 SEGURIDAD

- ✅ Autenticación JWT
- ✅ Contraseñas encriptadas con Bcrypt
- ✅ Validación de permisos por rol
- ✅ Tokens con expiración (24 horas)
- ✅ Protección CORS configurada
- ✅ Validación de datos con Pydantic

---

## 📁 ESTRUCTURA DEL PROYECTO

```
/app/
├── backend/
│   ├── server.py           # Aplicación principal FastAPI
│   ├── requirements.txt    # Dependencias Python
│   └── .env               # Variables de entorno
├── frontend/
│   ├── public/
│   │   └── logo.png       # Logo de Maribel Farmacia
│   ├── src/
│   │   ├── App.js         # Componente principal
│   │   ├── components/
│   │   │   └── Layout.js  # Layout con sidebar
│   │   └── pages/
│   │       ├── Login.js
│   │       ├── Dashboard.js
│   │       ├── Products.js
│   │       ├── Categories.js
│   │       ├── Suppliers.js
│   │       ├── Customers.js
│   │       ├── POS.js
│   │       ├── Sales.js
│   │       ├── Users.js
│   │       ├── InventoryMovements.js
│   │       ├── Reports.js
│   │       └── Database.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

---

## 🎯 ENDPOINTS DE LA API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Usuarios
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `GET /api/users/{id}` - Obtener usuario
- `PUT /api/users/{id}` - Actualizar usuario
- `DELETE /api/users/{id}` - Eliminar usuario

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `GET /api/products/{id}` - Obtener producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/{id}` - Actualizar categoría
- `DELETE /api/categories/{id}` - Eliminar categoría

### Proveedores
- `GET /api/suppliers` - Listar proveedores
- `POST /api/suppliers` - Crear proveedor
- `PUT /api/suppliers/{id}` - Actualizar proveedor
- `DELETE /api/suppliers/{id}` - Eliminar proveedor

### Clientes
- `GET /api/customers` - Listar clientes
- `POST /api/customers` - Crear cliente
- `PUT /api/customers/{id}` - Actualizar cliente
- `DELETE /api/customers/{id}` - Eliminar cliente

### Ventas
- `GET /api/sales` - Listar ventas
- `POST /api/sales` - Crear venta
- `GET /api/sales/{id}` - Obtener venta

### Movimientos de Inventario
- `GET /api/inventory-movements` - Listar movimientos
- `POST /api/inventory-movements` - Crear movimiento

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas generales
- `GET /api/dashboard/sales-chart` - Datos para gráfico de ventas
- `GET /api/dashboard/top-products` - Productos más vendidos

### Reportes
- `GET /api/reports/sales-report` - Reporte de ventas
- `GET /api/reports/inventory-report` - Reporte de inventario
- `GET /api/reports/expiring-products` - Productos por vencer
- `GET /api/reports/top-selling` - Más vendidos
- `GET /api/reports/inventory-movements` - Movimientos
- `GET /api/reports/transactions` - Transacciones

### Base de Datos
- `GET /api/database/backup` - Crear respaldo
- `POST /api/database/restore` - Restaurar respaldo

### Seed Data
- `POST /api/seed-data` - Poblar base de datos con datos de ejemplo

---

## 🌟 FUNCIONALIDADES DESTACADAS

### 1. Punto de Venta Profesional
- Interfaz intuitiva estilo tablet
- Búsqueda rápida de productos por nombre o código de barras
- Carrito interactivo con control de cantidades
- Cálculo automático de totales con impuestos y descuentos
- Selección de cliente y método de pago
- Actualización instantánea de inventario

### 2. Dashboard Ejecutivo
- 4 métricas clave en tiempo real
- Gráfico de líneas con tendencia de ventas (30 días)
- Gráfico de barras con productos más vendidos
- Resumen mensual de operaciones
- Alertas visuales de stock bajo

### 3. Sistema de Reportes Avanzado
- 6 reportes diferentes con filtros
- Exportación profesional a Excel
- Reportes maestro-detalle con múltiples hojas
- Parámetros personalizables (fechas, límites)
- Formato listo para imprimir

### 4. Control de Inventario Inteligente
- Alertas automáticas de stock bajo
- Registro de todos los movimientos
- Control de fechas de vencimiento
- Trazabilidad completa de productos
- Historial de ajustes

### 5. Gestión de Usuarios y Permisos
- 3 niveles de acceso claramente definidos
- Interfaz de administración de usuarios
- Activación/desactivación de cuentas
- Cambio de contraseñas
- Asignación de roles

---

## 📈 MÉTRICAS DEL SISTEMA

- **Total de Endpoints:** 40+
- **Páginas Frontend:** 12
- **Componentes React:** 15+
- **Colecciones MongoDB:** 8
- **Tipos de Reportes:** 6
- **Usuarios de Prueba:** 3
- **Productos de Ejemplo:** 6

---

## 🎓 CUMPLIMIENTO DE REQUISITOS ACADÉMICOS

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| 10+ funcionalidades | ✅ | 12 funcionalidades implementadas |
| 3 roles de usuario | ✅ | Administrador, Vendedor, Consulta |
| Admin de roles | ✅ | Interfaz completa de gestión |
| 8+ tablas/colecciones | ✅ | 8 colecciones MongoDB |
| CRUD completo | ✅ | Todas las entidades |
| Validaciones | ✅ | En todos los formularios |
| 6 reportes | ✅ | Con exportación a Excel |
| Reportes maestro-detalle | ✅ | Reporte de ventas |
| Reportes con parámetros | ✅ | Filtros de fecha |
| Exportable a Excel | ✅ | Formato .xlsx profesional |
| 2+ gráficos | ✅ | 2 gráficos + 4 KPIs |
| Dashboard | ✅ | Con datos en tiempo real |
| Respaldo/Restauración | ✅ | Funcional y probado |
| APIs | ✅ | FastAPI RESTful |
| Frameworks | ✅ | React + FastAPI + MongoDB |

---

## 🏆 ASPECTOS DESTACADOS DEL PROYECTO

1. **Arquitectura Moderna:** FastAPI con async/await para máximo rendimiento
2. **UI/UX Profesional:** Diseño limpio y moderno con Tailwind CSS
3. **Seguridad:** JWT + Bcrypt + Validaciones + CORS
4. **Escalabilidad:** MongoDB NoSQL para crecimiento flexible
5. **Mantenibilidad:** Código organizado y bien documentado
6. **Testing Ready:** Data-testid en todos los elementos clave
7. **Responsive:** Funciona en desktop, tablet y móvil
8. **Logo Personalizado:** Identidad corporativa de Maribel Farmacia

---

## 📞 INFORMACIÓN DE CONTACTO

**Proyecto desarrollado por:**
- **Nombre:** Freddy Alonso Valencia Hernandez
- **Carnet:** 20-02190-0
- **Institución:** UNAN-León
- **Fecha:** 2025

---

## ✨ CONCLUSIÓN

Este proyecto cumple **100% de los requisitos** establecidos en el examen de grado, implementando un sistema completo, funcional y profesional de inventario y facturación para farmacia, con todas las características solicitadas y varias adicionales que mejoran la experiencia del usuario.

El sistema está listo para ser utilizado en un entorno real de farmacia, con capacidad de gestionar productos, realizar ventas, controlar inventario, generar reportes y administrar usuarios de manera eficiente y segura.

**¡PROYECTO COMPLETADO EXITOSAMENTE! 🎉**
