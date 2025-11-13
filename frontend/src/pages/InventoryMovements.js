import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { AuthContext } from '../App';
import { Plus } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const InventoryMovements = () => {
  const { token, user } = useContext(AuthContext);
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    movement_type: 'entrada',
    quantity: '',
    reason: ''
  });

  useEffect(() => {
    fetchMovements();
    fetchProducts();
  }, []);

  const fetchMovements = async () => {
    try {
      const response = await axios.get(`${API}/inventory-movements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovements(response.data);
    } catch (error) {
      console.error('Error fetching movements:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/inventory-movements`, {
        ...formData,
        quantity: parseInt(formData.quantity)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMovements();
      fetchProducts();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating movement:', error);
      alert('Error al crear el movimiento');
    }
  };

  const resetForm = () => {
    setFormData({ product_id: '', movement_type: 'entrada', quantity: '', reason: '' });
  };

  const getMovementTypeBadge = (type) => {
    const colors = {
      entrada: 'bg-green-100 text-green-800',
      salida: 'bg-red-100 text-red-800',
      ajuste: 'bg-blue-100 text-blue-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const canEdit = user?.role === 'administrador' || user?.role === 'vendedor';

  return (
    <Layout>
      <div className="space-y-6" data-testid="inventory-movements-page">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Movimientos de Inventario</h1>
          {canEdit && (
            <button onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              data-testid="add-movement-button">
              <Plus size={20} />
              <span>Nuevo Movimiento</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Razón</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movements.map((movement) => (
                  <tr key={movement.id} data-testid={`movement-row-${movement.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(movement.created_at).toLocaleString('es-NI')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movement.product_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getMovementTypeBadge(movement.movement_type)}`}>
                        {movement.movement_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movement.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{movement.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{movement.user_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="movement-modal">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Nuevo Movimiento</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Producto *</label>
                  <select name="product_id" required value={formData.product_id} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    data-testid="product-select">
                    <option value="">Seleccione...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimiento *</label>
                  <select name="movement_type" required value={formData.movement_type} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="entrada">Entrada</option>
                    <option value="salida">Salida</option>
                    <option value="ajuste">Ajuste</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
                  <input type="number" name="quantity" required value={formData.quantity} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Razón *</label>
                  <textarea name="reason" required value={formData.reason} onChange={handleInputChange} rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    data-testid="save-movement-button">Crear</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InventoryMovements;
