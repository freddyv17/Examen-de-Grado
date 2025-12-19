import React, { useState, useContext } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { AuthContext } from '../App';
import { Download, FileText } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Reports = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(null);

  const downloadReport = async (endpoint, filename, params = {}) => {
    setLoading(endpoint);
    try {
      const queryParams = new URLSearchParams({ ...params, export: 'true' }).toString();
      const response = await axios.get(`${API}/reports/${endpoint}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Crear un blob y descargarlo
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      alert('Reporte descargado exitosamente');
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error al descargar el reporte: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(null);
    }
  };

  const reports = [
    {
      id: 'sales',
      title: 'Reporte de Ventas',
      description: 'Reporte maestro-detalle de todas las ventas con detalles de productos',
      endpoint: 'sales-report',
      filename: 'reporte_ventas.xlsx',
      hasDateRange: true
    },
    {
      id: 'inventory',
      title: 'Reporte de Inventario',
      description: 'Listado completo de productos con stock actual y estado',
      endpoint: 'inventory-report',
      filename: 'reporte_inventario.xlsx',
      hasDateRange: false
    },
    {
      id: 'expiring',
      title: 'Productos Próximos a Vencer',
      description: 'Productos que vencen en los próximos 30 días',
      endpoint: 'expiring-products',
      filename: 'reporte_productos_vencer.xlsx',
      hasDateRange: false,
      params: { days: 30 }
    },
    {
      id: 'top-selling',
      title: 'Productos Más Vendidos',
      description: 'Top 10 productos más vendidos con estadísticas',
      endpoint: 'top-selling',
      filename: 'reporte_mas_vendidos.xlsx',
      hasDateRange: true,
      params: { limit: 10 }
    },
    {
      id: 'movements',
      title: 'Movimientos de Inventario',
      description: 'Historial completo de movimientos con parámetros de fecha',
      endpoint: 'inventory-movements',
      filename: 'reporte_movimientos.xlsx',
      hasDateRange: true
    },
    {
      id: 'transactions',
      title: 'Historial de Transacciones',
      description: 'Registro completo de todas las transacciones de venta',
      endpoint: 'transactions',
      filename: 'reporte_transacciones.xlsx',
      hasDateRange: true
    }
  ];

  const ReportCard = ({ report }) => {
    const [dateRange, setDateRange] = useState({ start_date: '', end_date: '' });

    const handleDownload = () => {
      let params = report.params || {};
      if (report.hasDateRange && dateRange.start_date && dateRange.end_date) {
        params = { ...params, ...dateRange };
      }
      downloadReport(report.endpoint, report.filename, params);
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6" data-testid={`report-card-${report.id}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-3 rounded-full">
              <FileText className="text-emerald-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
              <p className="text-sm text-gray-600">{report.description}</p>
            </div>
          </div>
        </div>

        {report.hasDateRange && (
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <input
                type="date"
                value={dateRange.start_date}
                onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleDownload}
          disabled={loading === report.endpoint}
          className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid={`download-${report.id}`}
        >
          <Download size={20} />
          <span>{loading === report.endpoint ? 'Descargando...' : 'Descargar Excel'}</span>
        </button>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6" data-testid="reports-page">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
          <p className="mt-2 text-gray-600">Genera y descarga reportes en formato Excel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Información sobre Reportes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Los reportes se generan en formato Excel (.xlsx)</li>
            <li>• Los reportes con parámetros de fecha son opcionales (sin fechas = todos los registros)</li>
            <li>• Los reportes maestro-detalle incluyen información completa de ventas y productos</li>
            <li>• Los datos se exportan con formato y son editables en Excel</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
