import apiClient from '../../../services/api/axios.js';

export const reportsApi = {
  getSalesSummary: (params) => apiClient.get('/reports/sales',    { params }).then(r => r.data),
  getTopItems:     (params) => apiClient.get('/reports/top-items',{ params }).then(r => r.data),
  getDashboard:    (params) => apiClient.get('/reports/dashboard', { params }).then(r => r.data),
  exportCsv:       (params) => apiClient.get('/reports/export',   { params, responseType: 'blob' }).then(r => r.data),
};
