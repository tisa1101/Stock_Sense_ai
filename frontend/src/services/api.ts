import axios from 'axios';
import { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('stocksense_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract data or reject with server error message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred.';
    if (error.response && error.response.data) {
      const apiResp = error.response.data as ApiResponse<unknown>;
      errorMessage = apiResp.message || (apiResp.errors && apiResp.errors.length > 0 ? apiResp.errors[0] : errorMessage);
    } else if (error.message) {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;

// ===== COMMIT 3 API FUNCTIONS =====

// Notifications
export const getNotifications = (page = 1) =>
  api.get(`/notifications?page=${page}`);
export const getUnreadCount = () =>
  api.get('/notifications/unread-count');
export const markNotificationRead = (id: number) =>
  api.post(`/notifications/${id}/read`);
export const markAllNotificationsRead = () =>
  api.post('/notifications/read-all');

// Suppliers (enhanced)
export const getSuppliers = (search?: string) =>
  api.get(`/suppliers${search ? `?search=${search}` : ''}`);
export const getSupplierById = (id: number) =>
  api.get(`/suppliers/${id}`);
export const getSupplierReceipts = (id: number) =>
  api.get(`/suppliers/${id}/receipts`);
export const getSupplierStats = () =>
  api.get('/suppliers/stats');
export const createSupplier = (data: object) =>
  api.post('/suppliers', data);
export const updateSupplier = (id: number, data: object) =>
  api.put(`/suppliers/${id}`, data);
export const deleteSupplier = (id: number) =>
  api.delete(`/suppliers/${id}`);

// Analytics
export const getCategoryBreakdown = () =>
  api.get('/analytics/category-breakdown');
export const getWarehouseComparison = () =>
  api.get('/analytics/warehouse-comparison');
export const getMovementTrends = (days = 30) =>
  api.get(`/analytics/movement-trends?days=${days}`);
export const getTopProducts = (limit = 10) =>
  api.get(`/analytics/top-products?limit=${limit}`);
export const getStockOverTime = (days = 30) =>
  api.get(`/analytics/stock-value-over-time?days=${days}`);
export const getOperationSummary = (days = 30) =>
  api.get(`/analytics/operation-summary?days=${days}`);

// Reports (download triggers)
export const downloadReport = (type: string, params: Record<string, string | number | undefined>, format: string) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined) searchParams.set(k, String(v)); });
  searchParams.set('format', format);
  return api.get(`/reports/${type}?${searchParams.toString()}`, { responseType: 'blob' });
};

// User Management
export const getAllUsers = () => api.get('/users');
export const getMyProfile = () => api.get('/profile');
export const updateProfile = (data: object) => api.put('/profile', data);
export const changePassword = (data: object) => api.put('/profile/password', data);
export const changeUserRole = (id: number, role: number) => api.put(`/users/${id}/role`, { role });
export const toggleUserStatus = (id: number, isActive: boolean) => api.put(`/users/${id}/status`, { isActive });
export const deleteUser = (id: number) => api.delete(`/users/${id}`);
