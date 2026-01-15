import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { AuthContext } from '../App';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Package, Users, AlertTriangle, X, Eye } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [salesChartData, setSalesChartData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({ show: false, type: '', data: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, salesChartRes, topProductsRes] = await Promise.all([
        axios.get(`${API}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/dashboard/sales-chart`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/dashboard/top-products`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data);
      
      const salesData = salesChartRes.data.labels.map((label, index) => ({
        fecha: label,
        ventas: salesChartRes.data.values[index]
      }));
      setSalesChartData(salesData);

      const productsData = topProductsRes.data.labels.map((label, index) => ({
        producto: label.length > 20 ? label.substring(0, 20) + '...' : label,
        cantidad: topProductsRes.data.values[index]
      }));
      setTopProductsData(productsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatClick = async (type) => {
    setLoading(true);
    try {
      let data = [];
      let title = '';
      
      switch(type) {
        case 'sales-today':
          const today = new Date().toISOString().split('T')[0];
          const salesRes = await axios.get(`${API}/sales`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          data = salesRes.data.filter(sale => sale.created_at.startsWith(today));
          title = 'Ventas de Hoy';
          break;
          
        case 'low-stock':
          const productsRes = await axios.get(`${API}/products`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          data = productsRes.data.filter(p => p.stock <= p.min_stock && p.active);
          title = 'Productos con Stock Bajo';
          break;
          
        case 'products':
          const allProductsRes = await axios.get(`${API}/products`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          data = allProductsRes.data.filter(p => p.active);
          title = 'Productos Activos';
          break;
          
        case 'customers':
          const customersRes = await axios.get(`${API}/customers`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          data = customersRes.data;
          title = 'Clientes Registrados';
          break;
          
        case 'sales-month':
          const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
          const monthSalesRes = await axios.get(`${API}/sales`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          data = monthSalesRes.data.filter(sale => sale.created_at >= firstDay);
          title = 'Ventas del Mes';
          break;
      }
      
      setModalData({ show: true, type, data, title });
    } catch (error) {
      console.error('Error fetching detail data:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalData({ show: false, type: '', data: [], title: '' });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO' }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-NI', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Cargando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6" data-testid="dashboard">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            onClick={() => handleStatClick('sales-today')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" 
            data-testid="stat-sales-today"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ventas Hoy</p>
                <p className="text-3xl font-bold text-gray-900">C${stats?.total_sales_today?.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">{stats?.sales_count_today} ventas</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <DollarSign className="text-emerald-600" size={24} />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-blue-600">
              <Eye size={14} className="mr-1" />
              Click para ver detalles
            </div>
          </div>

          <div 
            onClick={() => handleStatClick('low-stock')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" 
            data-testid="stat-low-stock"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.low_stock_count}</p>
                <p className="text-sm text-gray-500 mt-1">productos</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertTriangle className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-blue-600">
              <Eye size={14} className="mr-1" />
              Click para ver detalles
            </div>
          </div>

          <div 
            onClick={() => handleStatClick('products')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" 
            data-testid="stat-products"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productos Activos</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_products}</p>
                <p className="text-sm text-gray-500 mt-1">en inventario</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-blue-600">
              <Eye size={14} className="mr-1" />
              Click para ver detalles
            </div>
          </div>

          <div 
            onClick={() => handleStatClick('customers')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" 
            data-testid="stat-customers"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_customers}</p>
                <p className="text-sm text-gray-500 mt-1">registrados</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-blue-600">
              <Eye size={14} className="mr-1" />
              Click para ver detalles
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-md p-6" data-testid="sales-chart">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Últimos 30 Días - Ventas</h2>
            {salesChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Line type="monotone" dataKey="ventas" stroke="#10b981" strokeWidth={2} name="Ventas ($)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No hay datos disponibles</p>
            )}
          </div>

          {/* Top Products Chart */}
          <div className="bg-white rounded-lg shadow-md p-6" data-testid="top-products-chart">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Productos Más Vendidos</h2>
            {topProductsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProductsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="producto" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cantidad" fill="#3b82f6" name="Cantidad Vendida" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No hay datos disponibles</p>
            )}
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen del Mes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => handleStatClick('sales-month')}
              className="border-l-4 border-emerald-500 pl-4 cursor-pointer hover:bg-gray-50 py-2 rounded transition-colors"
            >
              <p className="text-sm font-medium text-gray-600">Total Ventas del Mes</p>
              <p className="text-2xl font-bold text-gray-900">C${stats?.total_sales_month?.toFixed(2)}</p>
              <p className="text-xs text-blue-600 mt-1 flex items-center">
                <Eye size={12} className="mr-1" />
                Click para detalles
              </p>
            </div>
            <div 
              onClick={() => handleStatClick('low-stock')}
              className="border-l-4 border-blue-500 pl-4 cursor-pointer hover:bg-gray-50 py-2 rounded transition-colors"
            >
              <p className="text-sm font-medium text-gray-600">Productos con Stock Bajo</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.low_stock_count}</p>
              <p className="text-xs text-blue-600 mt-1 flex items-center">
                <Eye size={12} className="mr-1" />
                Click para detalles
              </p>
            </div>
            <div 
              onClick={() => handleStatClick('customers')}
              className="border-l-4 border-purple-500 pl-4 cursor-pointer hover:bg-gray-50 py-2 rounded transition-colors"
            >
              <p className="text-sm font-medium text-gray-600">Clientes Registrados</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_customers}</p>
              <p className="text-xs text-blue-600 mt-1 flex items-center">
                <Eye size={12} className="mr-1" />
                Click para detalles
              </p>
            </div>
          </div>
        </div>

        {/* Modal */}
        {modalData.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">{modalData.title}</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {modalData.type === 'sales-today' || modalData.type === 'sales-month' ? (
                  <div className="space-y-4">
                    {modalData.data.length === 0 ? (
                      <p className="text-center text-gray-500">No hay ventas para mostrar</p>
                    ) : (
                      modalData.data.map((sale) => (
                        <div key={sale.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">Venta #{sale.id.substring(0, 8)}</p>
                              <p className="text-sm text-gray-600">{formatDate(sale.created_at)}</p>
                            </div>
                            <p className="text-xl font-bold text-emerald-600">C${sale.total.toFixed(2)}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p><span className="font-medium">Cliente:</span> {sale.customer_name}</p>
                            <p><span className="font-medium">Vendedor:</span> {sale.user_name}</p>
                            <p><span className="font-medium">Método:</span> {sale.payment_method}</p>
                            <p><span className="font-medium">Productos:</span> {sale.details.length}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : modalData.type === 'low-stock' || modalData.type === 'products' ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Mín</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {modalData.data.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                              No hay productos para mostrar
                            </td>
                          </tr>
                        ) : (
                          modalData.data.map((product) => (
                            <tr key={product.id}>
                              <td className="px-4 py-3">
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.description}</p>
                              </td>
                              <td className="px-4 py-3 text-gray-900">C${product.price.toFixed(2)}</td>
                              <td className="px-4 py-3 text-gray-900">{product.stock}</td>
                              <td className="px-4 py-3 text-gray-900">{product.min_stock}</td>
                              <td className="px-4 py-3">
                                {product.stock <= product.min_stock ? (
                                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                    Stock Bajo
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    Normal
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : modalData.type === 'customers' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modalData.data.length === 0 ? (
                      <p className="text-center text-gray-500 col-span-2">No hay clientes para mostrar</p>
                    ) : (
                      modalData.data.map((customer) => (
                        <div key={customer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h3 className="font-semibold text-gray-900 mb-2">{customer.name}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Teléfono:</span> {customer.phone}</p>
                            {customer.email && <p><span className="font-medium">Email:</span> {customer.email}</p>}
                            {customer.address && <p><span className="font-medium">Dirección:</span> {customer.address}</p>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
