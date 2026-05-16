import apiClient from '../../../services/api/axios.js';

export const paymentsApi = {
  getAll:   (params)      => apiClient.get('/payments', { params }).then(r => r.data),
  getById:  (id)          => apiClient.get(`/payments/${id}`).then(r => r.data),
  process:  (payload)     => apiClient.post('/payments', payload).then(r => r.data),
  refund:   (id)          => apiClient.post(`/payments/${id}/refund`).then(r => r.data),
  getStats: (params)      => apiClient.get('/payments/stats', { params }).then(r => r.data),
};
