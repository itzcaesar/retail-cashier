import { useState } from 'react';
import { createProduct } from '@/lib/api';

export default function AddProductModal({ isOpen, onClose, scannedCode, onProductAdded }) {
  const [formData, setFormData] = useState({
    code: scannedCode || '',
    name: '',
    price: '',
    stock: '0'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await createProduct({
        code: formData.code,
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });

      // Notify parent and add to cart
      if (onProductAdded) {
        onProductAdded(response.data);
      }

      // Close modal
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-4">
          Create a new product for barcode: <strong>{scannedCode}</strong>
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Barcode / QR Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg text-lg"
              required
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg text-lg"
              placeholder="e.g., Coca Cola 330ml"
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Price (Rp) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg text-lg"
              placeholder="e.g., 5000"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Initial Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg text-lg"
              placeholder="e.g., 100"
              min="0"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create & Add to Cart'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
