import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { AuthContext } from '../App';
import { Plus, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Customers = () => {
  const { token, user } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API}/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      if (!dataToSend.email) dataToSend.email = null;
      if (!dataToSend.address) dataToSend.address = null;

      if (editingCustomer) {
        await axios.put(`${API}/customers/${editingCustomer.id}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API}/customers`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      fetchCustomers();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Error al guardar el cliente');
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        await axios.delete(`${API}/customers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Error al eliminar el cliente');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: ''
    });
    setEditingCustomer(null);
  };

  const canEdit = user?.role === 'administrador' || user?.role === 'vendedor';

  return (
    <Layout>
      <div className="space-y-6" data-testid="customers-page">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          {canEdit && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              data-testid="add-customer-button"
            >
              <Plus size={20} />
              <span>Nuevo Cliente</span>
            </button>
          )}
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg shadow-md p-6" data-testid={`customer-card-${customer.id}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{customer.name}</h3>
                {canEdit && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="text-blue-600 hover:text-blue-900"
                      data-testid={`edit-customer-${customer.id}`}
                    >
                      <Edit size={18} />
                    </button>
                    {user?.role === 'administrador' && (
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-600 hover:text-red-900"
                        data-testid={`delete-customer-${customer.id}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span>{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center space-x-2">
                    <Mail size={16} />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span>{customer.address}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="customer-modal">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
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
                    data-testid="customer-name-input"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <textarea
                    name="address"
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
                    data-testid="save-customer-button"
                  >
                    {editingCustomer ? 'Actualizar' : 'Crear'}
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

export default Customers;
