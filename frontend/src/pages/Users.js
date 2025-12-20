import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { AuthContext } from '../App';
import { Plus, Edit, Trash2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Users = () => {
  const { token, user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'consulta',
    full_name: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = editingUser 
        ? { email: formData.email, role: formData.role, full_name: formData.full_name, ...(formData.password ? { password: formData.password } : {}) }
        : formData;

      if (editingUser) {
        await axios.put(`${API}/users/${editingUser.id}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API}/users`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      fetchUsers();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.response?.data?.detail || 'Error al guardar el usuario');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      full_name: user.full_name
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const user = users.find(u => u.id === id);
    
    try {
      // Verificar si es el usuario actual
      const currentUserData = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (currentUserData.data.id === id) {
        alert('No puedes eliminar tu propio usuario mientras estés conectado.');
        return;
      }
      
      // Verificar si el usuario tiene ventas registradas
      const salesResponse = await axios.get(`${API}/sales`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userSales = salesResponse.data.filter(s => s.user_id === id);
      
      let confirmMessage = '';
      if (userSales.length > 0) {
        confirmMessage = `Este usuario tiene ${userSales.length} venta(s) registrada(s).\n\n¿Está seguro de eliminar al usuario "${user?.full_name}" (@${user?.username})?\n\nNota: Las ventas se mantendrán en el historial.`;
      } else {
        confirmMessage = `¿Está seguro de eliminar al usuario "${user?.full_name}" (@${user?.username})?\n\nEsta acción no se puede deshacer.`;
      }
      
      if (!window.confirm(confirmMessage)) {
        return;
      }
      
      await axios.delete(`${API}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
      alert('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Error desconocido';
      alert('Error al eliminar el usuario: ' + errorMsg);
    }
  };

  const resetForm = () => {
    setFormData({ username: '', email: '', password: '', role: 'consulta', full_name: '' });
    setEditingUser(null);
  };

  const getRoleBadge = (role) => {
    const colors = {
      administrador: 'bg-red-100 text-red-800',
      vendedor: 'bg-blue-100 text-blue-800',
      consulta: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || colors.consulta;
  };

  return (
    <Layout>
      <div className="space-y-6" data-testid="users-page">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            data-testid="add-user-button"
          >
            <Plus size={20} />
            <span>Nuevo Usuario</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} data-testid={`user-row-${user.id}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-900 mr-4" data-testid={`edit-user-${user.id}`}>
                      <Edit size={18} />
                    </button>
                    {currentUser?.role === 'administrador' && (
                      <button 
                        onClick={() => handleDelete(user.id)} 
                        className="text-red-600 hover:text-red-900"
                        data-testid={`delete-user-${user.id}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="user-modal">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usuario *</label>
                    <input type="text" name="username" required value={formData.username} onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      data-testid="username-input" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                  <input type="text" name="full_name" required value={formData.full_name} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña {editingUser ? '(dejar vacío para no cambiar)' : '*'}
                  </label>
                  <input type="password" name="password" required={!editingUser} value={formData.password} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    data-testid="password-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
                  <select name="role" required value={formData.role} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    data-testid="role-select">
                    <option value="administrador">Administrador</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="consulta">Consulta</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    data-testid="save-user-button">{editingUser ? 'Actualizar' : 'Crear'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Users;
