import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import {
  Home,
  Users,
  Package,
  Tag,
  Truck,
  UserSquare2,
  ShoppingCart,
  CreditCard,
  FileText,
  ArrowLeftRight,
  Database,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home, roles: ['administrador', 'vendedor', 'consulta'] },
    { path: '/pos', label: 'Punto de Venta', icon: CreditCard, roles: ['administrador', 'vendedor'] },
    { path: '/sales', label: 'Ventas', icon: ShoppingCart, roles: ['administrador', 'vendedor', 'consulta'] },
    { path: '/products', label: 'Productos', icon: Package, roles: ['administrador', 'vendedor', 'consulta'] },
    { path: '/categories', label: 'Categorías', icon: Tag, roles: ['administrador', 'vendedor', 'consulta'] },
    { path: '/suppliers', label: 'Proveedores', icon: Truck, roles: ['administrador', 'vendedor', 'consulta'] },
    { path: '/customers', label: 'Clientes', icon: UserSquare2, roles: ['administrador', 'vendedor', 'consulta'] },
    { path: '/inventory-movements', label: 'Movimientos', icon: ArrowLeftRight, roles: ['administrador', 'vendedor', 'consulta'] },
    { path: '/reports', label: 'Reportes', icon: FileText, roles: ['administrador', 'vendedor', 'consulta'] },
    { path: '/users', label: 'Usuarios', icon: Users, roles: ['administrador'] },
    { path: '/database', label: 'Base de Datos', icon: Database, roles: ['administrador'] }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-emerald-700 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-emerald-600">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <img src="/logo.png" alt="Maribel Farmacia" className="h-10 w-10 object-contain" />
            </div>
            <span className="text-xl font-bold">Maribel Farmacia</span>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-100 hover:bg-emerald-600 hover:text-white'
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(/ /g, '-')}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-emerald-600">
          <div className="text-sm text-emerald-200 mb-2">
            <div className="font-semibold">{user?.full_name}</div>
            <div className="text-xs capitalize">{user?.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-2 text-emerald-100 hover:bg-emerald-600 rounded-lg transition-colors"
            data-testid="logout-button"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
              data-testid="menu-toggle"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Sistema de Inventario y Facturación
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
