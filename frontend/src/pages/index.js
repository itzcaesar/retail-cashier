import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ScannerInput from '@/components/ScannerInput';
import AddProductModal from '@/components/AddProductModal';
import TransactionSuccessModal from '@/components/TransactionSuccessModal';
import StockBadge from '@/components/StockBadge';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { lookupProduct, checkout } from '@/lib/api';

export default function Home() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
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
      
      // Store transaction details
      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      setLastTransaction({
        ...response.data,
        total,
        itemCount
      });
      
      // Clear cart
      setCart([]);
      
      // Show success modal
      setShowSuccessModal(true);
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

  // Keyboard shortcuts (must be after function declarations)
  useKeyboardShortcuts({
    'ctrl+enter': handleCheckout,
    'ctrl+c': clearCart,
    'esc': () => {
      if (showSuccessModal) {
        setShowSuccessModal(false);
      } else if (showAddProductModal) {
        setShowAddProductModal(false);
      }
    }
  }, !showAddProductModal && !showSuccessModal);

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
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">🛒 POS Cashier</h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Scan items to add to cart</p>
              </div>
              <div className="flex gap-2 md:gap-3">
                <Link href="/products" className="btn-secondary text-sm md:text-base py-2 px-4">
                  📦 Products
                </Link>
                <Link href="/reports" className="btn-primary text-sm md:text-base py-2 px-4">
                  📊 Reports
                </Link>
              </div>
            </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-32 lg:pb-0">
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
                      <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base md:text-lg truncate">{item.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs md:text-sm text-gray-600">
                              Rp {parseFloat(item.price).toLocaleString('id-ID')} × {item.quantity}
                            </p>
                            {item.maxStock - item.quantity < 5 && item.maxStock - item.quantity >= 0 && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                                {item.maxStock - item.quantity} left
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 md:gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-10 h-10 md:w-10 md:h-10 bg-gray-300 hover:bg-gray-400 rounded-lg text-lg md:text-xl font-bold flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-10 md:w-12 text-center text-lg md:text-xl font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-10 h-10 md:w-10 md:h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg md:text-xl font-bold flex items-center justify-center"
                              disabled={item.quantity >= item.maxStock}
                            >
                              +
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="flex-1 sm:w-28 text-right">
                            <p className="text-lg md:text-xl font-bold">
                              Rp {(parseFloat(item.price) * item.quantity).toLocaleString('id-ID')}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-10 h-10 md:w-10 md:h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center justify-center"
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

            {/* Desktop Summary & Checkout */}
            <div className="hidden lg:block lg:col-span-1">
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

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>💵 Payment: Cash Only</p>
                  <div className="border-t pt-2 text-xs space-y-1">
                    <p className="font-medium text-gray-700">⌨️ Keyboard Shortcuts:</p>
                    <p><kbd className="px-2 py-0.5 bg-gray-200 rounded">Ctrl+Enter</kbd> Checkout</p>
                    <p><kbd className="px-2 py-0.5 bg-gray-200 rounded">Ctrl+C</kbd> Clear Cart</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer Checkout */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 lg:hidden z-40">
        <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
          <div>
             <p className="text-sm text-gray-500">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</p>
             <p className="text-xl font-bold text-blue-600">Rp {total.toLocaleString('id-ID')}</p>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || loading}
            className="btn-success flex-1 text-lg py-3 px-6 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : '💰 Checkout'}
          </button>
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        scannedCode={scannedCode}
        onProductAdded={handleProductAdded}
      />

      {/* Transaction Success Modal */}
      <TransactionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        transaction={lastTransaction}
        total={lastTransaction?.total || 0}
        itemCount={lastTransaction?.itemCount || 0}
      />
    </>
  );
}
