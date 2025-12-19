import { useState, useEffect } from 'react';
import Head from 'next/head';
import ScannerInput from '@/components/ScannerInput';
import AddProductModal from '@/components/AddProductModal';
import { lookupProduct, checkout } from '@/lib/api';

export default function Home() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  // Calculate total whenever cart changes
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.quantity);
    }, 0);
    setTotal(newTotal);
  }, [cart]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleScan = async (code) => {
    setLoading(true);
    try {
      const response = await lookupProduct(code);
      const product = response.data;

      // Check stock
      if (product.stock <= 0) {
        showNotification(`${product.name} is out of stock!`, 'error');
        setLoading(false);
        return;
      }

      // Add to cart or increase quantity
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Check if we have enough stock
        if (existingItem.quantity >= product.stock) {
          showNotification(`Not enough stock for ${product.name}!`, 'error');
          setLoading(false);
          return;
        }

        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
        showNotification(`${product.name} quantity increased`);
      } else {
        setCart([...cart, {
          id: product.id,
          code: product.code,
          name: product.name,
          price: product.price,
          quantity: 1,
          maxStock: product.stock
        }]);
        showNotification(`${product.name} added to cart`);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // Product not found - open add product modal
        setScannedCode(code);
        setShowAddProductModal(true);
      } else {
        showNotification('Error looking up product', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProductAdded = (product) => {
    // Add newly created product to cart
    setCart([...cart, {
      id: product.id,
      code: product.code,
      name: product.name,
      price: product.price,
      quantity: 1,
      maxStock: product.stock
    }]);
    showNotification(`${product.name} created and added to cart`);
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        
        // Check bounds
        if (newQuantity <= 0) {
          return null; // Will be filtered out
        }
        if (newQuantity > item.maxStock) {
          showNotification('Not enough stock!', 'error');
          return item;
        }
        
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean));
  };

  const removeItem = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    showNotification('Item removed from cart');
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showNotification('Cart is empty!', 'error');
      return;
    }

    setLoading(true);
    try {
      const items = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const response = await checkout(items);
      
      showNotification(`Checkout successful! Total: Rp ${total.toLocaleString('id-ID')}`, 'success');
      
      // Clear cart
      setCart([]);
      
      // Show transaction summary
      console.log('Transaction:', response.data);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Checkout failed';
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    if (confirm('Clear entire cart?')) {
      setCart([]);
      showNotification('Cart cleared');
    }
  };

  return (
    <>
      <Head>
        <title>POS Cashier</title>
        <meta name="description" content="Point of Sale System" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">🛒 POS Cashier</h1>
            <p className="text-gray-600 mt-2">Scan items to add to cart</p>
          </div>

          {/* Notification */}
          {notification && (
            <div className={`mb-6 p-4 rounded-lg ${
              notification.type === 'error' 
                ? 'bg-red-100 text-red-800 border border-red-300' 
                : 'bg-green-100 text-green-800 border border-green-300'
            }`}>
              {notification.message}
            </div>
          )}

          {/* Scanner Input */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <ScannerInput onScan={handleScan} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Cart ({cart.length} items)</h2>
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-xl">Cart is empty</p>
                    <p className="text-sm mt-2">Scan a barcode to add items</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-sm text-gray-600">Rp {parseFloat(item.price).toLocaleString('id-ID')} × {item.quantity}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-10 h-10 bg-gray-300 hover:bg-gray-400 rounded-lg text-xl font-bold"
                            >
                              -
                            </button>
                            <span className="w-12 text-center text-xl font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xl font-bold"
                            >
                              +
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="w-32 text-right">
                            <p className="text-xl font-bold">
                              Rp {(parseFloat(item.price) * item.quantity).toLocaleString('id-ID')}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Summary & Checkout */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-bold mb-4">Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-lg">
                    <span>Items:</span>
                    <span className="font-semibold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || loading}
                  className="w-full btn-success text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : '💰 Checkout'}
                </button>

                <div className="mt-4 text-sm text-gray-600">
                  <p>💵 Payment: Cash Only</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        scannedCode={scannedCode}
        onProductAdded={handleProductAdded}
      />
    </>
  );
}
