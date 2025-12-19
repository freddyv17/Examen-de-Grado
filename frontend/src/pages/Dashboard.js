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
                <p className="text-3xl font-bold text-gray-900">${stats?.total_sales_today?.toFixed(2)}</p>
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
            <div className="border-l-4 border-emerald-500 pl-4">
              <p className="text-sm font-medium text-gray-600">Total Ventas del Mes</p>
              <p className="text-2xl font-bold text-gray-900">${stats?.total_sales_month?.toFixed(2)}</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm font-medium text-gray-600">Productos con Stock Bajo</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.low_stock_count}</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-sm font-medium text-gray-600">Clientes Registrados</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_customers}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
