import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products
export const lookupProduct = (code) => api.get(`/products/lookup/${code}`);
export const createProduct = (data) => api.post('/products', data);
export const getAllProducts = () => api.get('/products');
export const updateProductStock = (id, stock) => api.patch(`/products/${id}/stock`, { stock });

// Transactions
export const checkout = (items) => api.post('/transactions/checkout', { items });
export const getTransactions = (limit = 50, offset = 0) => api.get('/transactions', { params: { limit, offset } });
export const getTransaction = (id) => api.get(`/transactions/${id}`);

// Reports
export const getDailyReport = (date) => api.get('/reports/daily', { params: { date } });
export const getRangeReport = (startDate, endDate) => api.get('/reports/range', { params: { startDate, endDate } });

// QR Codes
export const generateQR = (productId, format = 'dataurl') => api.get(`/qr/generate/${productId}`, { params: { format } });
export const generateBulkQRPDF = (productIds) => api.post('/qr/bulk-pdf', { productIds }, { responseType: 'blob' });

export default api;
