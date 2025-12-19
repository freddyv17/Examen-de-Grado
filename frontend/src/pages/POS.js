import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import Receipt from '../components/Receipt';
import axios from 'axios';
import { AuthContext } from '../App';
import { Plus, Minus, Trash2, Search, ShoppingCart } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const POS = () => {
  const { token, user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.filter(p => p.active && p.stock > 0));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

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

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unit_price }
            : item
        ));
      } else {
        alert('Stock insuficiente');
      }
    } else {
      setCart([...cart, {
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.price,
        subtotal: product.price
      }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.product_id !== productId));
    } else if (newQuantity <= product.stock) {
      setCart(cart.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.unit_price }
          : item
      ));
    } else {
      alert('Stock insuficiente');
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + parseFloat(tax || 0) - parseFloat(discount || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    try {
      const saleData = {
        customer_id: selectedCustomer?.id || null,
        customer_name: selectedCustomer?.name || 'Cliente General',
        details: cart,
        tax: parseFloat(tax || 0),
        discount: parseFloat(discount || 0),
        payment_method: paymentMethod
      };

      await axios.post(`${API}/sales`, saleData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Venta realizada con éxito');
      setCart([]);
      setSelectedCustomer(null);
      setDiscount(0);
      setTax(0);
      fetchProducts();
    } catch (error) {
      console.error('Error creating sale:', error);
      alert('Error al realizar la venta');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.barcode && product.barcode.includes(searchTerm))
  );

  return (
    <Layout>
      <div className="space-y-6" data-testid="pos-page">
        <h1 className="text-3xl font-bold text-gray-900">Punto de Venta</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  data-testid="product-search"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.slice(0, 12).map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  data-testid={`product-item-${product.id}`}
                >
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-emerald-600">${product.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <ShoppingCart className="mr-2" size={24} />
                Carrito
              </h2>

              {/* Customer Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select
                  value={selectedCustomer?.id || ''}
                  onChange={(e) => {
                    const customer = customers.find(c => c.id === e.target.value);
                    setSelectedCustomer(customer || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  data-testid="customer-select"
                >
                  <option value="">Cliente General</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </div>

              {/* Cart Items */}
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Carrito vacío</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.product_id} className="flex items-center justify-between border-b pb-2" data-testid={`cart-item-${item.product_id}`}>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.product_name}</p>
                        <p className="text-xs text-gray-500">${item.unit_price.toFixed(2)} c/u</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                          data-testid={`decrease-${item.product_id}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                          data-testid={`increase-${item.product_id}`}
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          data-testid={`remove-${item.product_id}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              {cart.length > 0 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <label className="text-sm">Impuesto:</label>
                      <input
                        type="number"
                        step="0.01"
                        value={tax}
                        onChange={(e) => setTax(e.target.value)}
                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <label className="text-sm">Descuento:</label>
                      <input
                        type="number"
                        step="0.01"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-emerald-600" data-testid="cart-total">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      data-testid="payment-method"
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="transferencia">Transferencia</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 font-semibold"
                    data-testid="complete-sale-button"
                  >
                    Completar Venta
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default POS;
