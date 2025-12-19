import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { AuthContext } from '../App';
import { Plus, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Suppliers = () => {
  const { token, user } = useContext(AuthContext);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${API}/suppliers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await axios.put(`${API}/suppliers/${editingSupplier.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API}/suppliers`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      fetchSuppliers();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Error al guardar el proveedor');
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact_person: supplier.contact_person,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const supplier = suppliers.find(s => s.id === id);
    
    // Verificar si hay productos de este proveedor
    try {
      const productsResponse = await axios.get(`${API}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const productsFromSupplier = productsResponse.data.filter(p => p.supplier_id === id);
      
      if (productsFromSupplier.length > 0) {
        if (!window.confirm(`Este proveedor tiene ${productsFromSupplier.length} producto(s) asociado(s).\n\n¿Está seguro de eliminar al proveedor "${supplier?.name}"?\n\nNota: Los productos no se eliminarán, pero quedarán sin proveedor.`)) {
          return;
        }
      } else {
        if (!window.confirm(`¿Está seguro de eliminar al proveedor "${supplier?.name}"?\n\nEsta acción no se puede deshacer.`)) {
          return;
        }
      }
      
      await axios.delete(`${API}/suppliers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSuppliers();
      alert('Proveedor eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting supplier:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Error desconocido';
      alert('Error al eliminar el proveedor: ' + errorMsg);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: ''
    });
    setEditingSupplier(null);
  };

  const canEdit = user?.role === 'administrador' || user?.role === 'vendedor';

  return (
    <Layout>
      <div className="space-y-6" data-testid="suppliers-page">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
          {canEdit && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              data-testid="add-supplier-button"
            >
              <Plus size={20} />
              <span>Nuevo Proveedor</span>
            </button>
          )}
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-lg shadow-md p-6" data-testid={`supplier-card-${supplier.id}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{supplier.name}</h3>
                {canEdit && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="text-blue-600 hover:text-blue-900"
                      data-testid={`edit-supplier-${supplier.id}`}
                    >
                      <Edit size={18} />
                    </button>
                    {user?.role === 'administrador' && (
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="text-red-600 hover:text-red-900"
                        data-testid={`delete-supplier-${supplier.id}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">Contacto:</span>
                  <span>{supplier.contact_person}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>{supplier.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="supplier-modal">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                {editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    data-testid="supplier-name-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Persona de Contacto *</label>
                  <input
                    type="text"
                    name="contact_person"
                    required
                    value={formData.contact_person}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                  <textarea
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    data-testid="save-supplier-button"
                  >
                    {editingSupplier ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Suppliers;
