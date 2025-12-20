import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import axios from 'axios';
import { AuthContext } from '../App';
import { Plus, Edit, Trash2, Eye, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Categories = () => {
  const { token, user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null, productsCount: 0 });
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`${API}/categories/${editingCategory.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API}/categories`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      fetchCategories();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error al guardar la categoría');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const category = categories.find(c => c.id === id);
    
    try {
      // Verificar si hay productos en esta categoría
      const productsResponse = await axios.get(`${API}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const productsInCategory = productsResponse.data.filter(p => p.category_id === id);
      
      let confirmMessage = '';
      if (productsInCategory.length > 0) {
        confirmMessage = `Esta categoría tiene ${productsInCategory.length} producto(s) asociado(s).\n\n¿Está seguro de eliminar la categoría "${category?.name}"?\n\nNota: Los productos no se eliminarán, pero quedarán sin categoría.`;
      } else {
        confirmMessage = `¿Está seguro de eliminar la categoría "${category?.name}"?\n\nEsta acción no se puede deshacer.`;
      }
      
      if (!window.confirm(confirmMessage)) {
        return;
      }
      
      await axios.delete(`${API}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
      alert('Categoría eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting category:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Error desconocido';
      alert('Error al eliminar la categoría: ' + errorMsg);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
  };

  const handleViewProducts = async (category) => {
    try {
      const response = await axios.get(`${API}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const filtered = response.data.filter(p => p.category_id === category.id);
      setSelectedCategory(category);
      setCategoryProducts(filtered);
      setShowProductsModal(true);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const canEdit = user?.role === 'administrador' || user?.role === 'vendedor';

  return (
    <Layout>
      <div className="space-y-6" data-testid="categories-page">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
          {canEdit && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              data-testid="add-category-button"
            >
              <Plus size={20} />
              <span>Nueva Categoría</span>
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" 
              data-testid={`category-card-${category.id}`}
              onClick={() => handleViewProducts(category)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                  <div className="mt-3 flex items-center text-sm text-blue-600">
                    <Eye size={16} className="mr-1" />
                    <span>Click para ver productos</span>
                  </div>
                </div>
                {canEdit && (
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-900"
                      data-testid={`edit-category-${category.id}`}
                    >
                      <Edit size={18} />
                    </button>
                    {user?.role === 'administrador' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(category.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                        data-testid={`delete-category-${category.id}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="category-modal">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
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
                    data-testid="category-name-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    data-testid="category-description-input"
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
                    data-testid="save-category-button"
                  >
                    {editingCategory ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Modal */}
        {showProductsModal && selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b bg-emerald-50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedCategory.description}</p>
                </div>
                <button 
                  onClick={() => setShowProductsModal(false)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {categoryProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No hay productos en esta categoría</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryProducts.map((product) => (
                      <div 
                        key={product.id} 
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                          </div>
                          {product.stock <= product.min_stock ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Stock Bajo
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Disponible
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Precio</p>
                            <p className="font-semibold text-emerald-600 text-lg">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Stock</p>
                            <p className="font-semibold text-gray-900 text-lg">
                              {product.stock} unidades
                            </p>
                          </div>
                        </div>

                        {product.barcode && (
                          <div className="mt-2 text-xs text-gray-500">
                            Código: {product.barcode}
                          </div>
                        )}

                        {product.expiration_date && (
                          <div className="mt-2 text-xs text-gray-500">
                            Vence: {new Date(product.expiration_date).toLocaleDateString('es-NI')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Total de productos en esta categoría:</span>
                    <span className="font-semibold text-lg text-gray-900">
                      {categoryProducts.length} productos
                    </span>
                  </div>
                  {categoryProducts.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span>Stock total: </span>
                      <span className="font-semibold">
                        {categoryProducts.reduce((sum, p) => sum + p.stock, 0)} unidades
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Categories;
