import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getAllProducts, updateProductStock, generateQR } from '@/lib/api';
import StockBadge from '@/components/StockBadge';
import { QRCodeSVG } from 'qrcode.react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      await updateProductStock(productId, newStock);
      setProducts(products.map(p =>
        p.id === productId ? { ...p, stock: parseInt(newStock) } : p
      ));
      setEditingStock(null);
    } catch (error) {
      console.error('Failed to update stock:', error);
      alert('Failed to update stock');
    }
  };

  const showQR = (product) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <Head>
        <title>Product Management - POS Cashier</title>
      </Head>

      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">📦 Product Management</h1>
                <p className="text-gray-600 mt-2">Manage inventory and view QR codes</p>
              </div>
              <div className="flex gap-3">
                <Link href="/reports" className="btn-secondary">
                  📊 Reports
                </Link>
                <Link href="/" className="btn-primary">
                  ← Back to POS
                </Link>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Products ({products.length})</h2>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No products yet</p>
                <p className="text-sm text-gray-400 mt-2">Scan a barcode on the POS to create products</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3">Code</th>
                      <th className="text-left p-3">Name</th>
                      <th className="text-right p-3">Price</th>
                      <th className="text-left p-3">Stock</th>
                      <th className="text-center p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-mono text-sm">{product.code}</td>
                        <td className="p-3 font-medium">{product.name}</td>
                        <td className="p-3 text-right">
                          Rp {parseFloat(product.price).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3">
                          {editingStock === product.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                defaultValue={product.stock}
                                className="w-24 p-2 border rounded text-right"
                                onBlur={(e) => handleUpdateStock(product.id, e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleUpdateStock(product.id, e.target.value);
                                  }
                                }}
                                autoFocus
                              />
                              <button
                                onClick={() => setEditingStock(null)}
                                className="text-gray-500 hover:text-gray-700 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => setEditingStock(product.id)}
                              className="cursor-pointer"
                            >
                              <StockBadge stock={product.stock} threshold={10} />
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => showQR(product)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                          >
                            📱 QR
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
            
            <div className="flex justify-center mb-4">
              <QRCodeSVG value={selectedProduct.code} size={256} />
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">Code: {selectedProduct.code}</p>
              <p className="text-lg font-bold">Rp {parseFloat(selectedProduct.price).toLocaleString('id-ID')}</p>
            </div>

            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
