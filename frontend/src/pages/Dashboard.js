import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { AuthContext } from '../App';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Package, Users, AlertTriangle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [salesChartData, setSalesChartData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <div className="bg-white rounded-lg shadow-md p-6" data-testid="stat-sales-today">
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
          </div>

          <div className="bg-white rounded-lg shadow-md p-6" data-testid="stat-low-stock">
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
          </div>

          <div className="bg-white rounded-lg shadow-md p-6" data-testid="stat-products">
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
          </div>

          <div className="bg-white rounded-lg shadow-md p-6" data-testid="stat-customers">
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
