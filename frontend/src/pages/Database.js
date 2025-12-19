import React, { useState, useContext } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { AuthContext } from '../App';
import { Download, Upload, Database as DatabaseIcon, AlertTriangle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Database = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [restoreFile, setRestoreFile] = useState(null);

  const handleBackup = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/database/backup`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `backup_${new Date().toISOString().split('T')[0]}.json`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      alert('Respaldo creado exitosamente');
    } catch (error) {
      console.error('Error creating backup:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido';
      alert('Error al crear el respaldo: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRestoreFile(file);
    }
  };

  const handleRestore = async () => {
    if (!restoreFile) {
      alert('Por favor seleccione un archivo de respaldo');
      return;
    }

    if (!window.confirm('¿Está seguro de restaurar la base de datos? Esto reemplazará todos los datos actuales.')) {
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const backupData = JSON.parse(e.target.result);
          await axios.post(`${API}/database/restore`, backupData, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert('Base de datos restaurada exitosamente');
          setRestoreFile(null);
        } catch (error) {
          console.error('Error restoring database:', error);
          alert('Error al restaurar la base de datos');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsText(restoreFile);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error al leer el archivo');
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6" data-testid="database-page">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Base de Datos</h1>
          <p className="mt-2 text-gray-600">Realizar respaldo y restauración de la base de datos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Backup Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Download className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Respaldo de Base de Datos</h2>
                <p className="text-sm text-gray-600">Exportar todos los datos del sistema</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">¿Qué incluye el respaldo?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Usuarios del sistema</li>
                  <li>• Productos y categorías</li>
                  <li>• Proveedores y clientes</li>
                  <li>• Historial de ventas completo</li>
                  <li>• Movimientos de inventario</li>
                </ul>
              </div>

              <button
                onClick={handleBackup}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="backup-button"
              >
                <Download size={20} />
                <span>{loading ? 'Creando respaldo...' : 'Crear Respaldo'}</span>
              </button>
            </div>
          </div>

          {/* Restore Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <Upload className="text-emerald-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Restaurar Base de Datos</h2>
                <p className="text-sm text-gray-600">Importar datos desde un respaldo</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-1">Advertencia</h3>
                    <p className="text-sm text-yellow-800">
                      La restauración reemplazará todos los datos actuales. Asegúrese de tener un respaldo reciente antes de continuar.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar archivo de respaldo
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  data-testid="restore-file-input"
                />
                {restoreFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Archivo seleccionado: {restoreFile.name}
                  </p>
                )}
              </div>

              <button
                onClick={handleRestore}
                disabled={loading || !restoreFile}
                className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="restore-button"
              >
                <Upload size={20} />
                <span>{loading ? 'Restaurando...' : 'Restaurar Base de Datos'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DatabaseIcon className="text-gray-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Información Importante</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Recomendaciones para Respaldo</h3>
              <ul className="space-y-1">
                <li>• Realice respaldos periódicos (diarios o semanales)</li>
                <li>• Guarde los respaldos en múltiples ubicaciones</li>
                <li>• Verifique la integridad de los archivos de respaldo</li>
                <li>• Etiquete los respaldos con fecha y hora</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Recomendaciones para Restauración</h3>
              <ul className="space-y-1">
                <li>• Verifique que el archivo sea un respaldo válido</li>
                <li>• Cree un respaldo actual antes de restaurar</li>
                <li>• Realice la restauración en horarios de baja actividad</li>
                <li>• Verifique los datos después de la restauración</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Database;
