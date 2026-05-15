import apiClient from '../../../services/api/axios.js';

export const reservationsApi = {
  getAll:   (params)      => apiClient.get('/reservations', { params }).then(r => r.data),
  getById:  (id)          => apiClient.get(`/reservations/${id}`).then(r => r.data),
  create:   (payload)     => apiClient.post('/reservations', payload).then(r => r.data),
  update:   (id, payload) => apiClient.put(`/reservations/${id}`, payload).then(r => r.data),
  cancel:   (id)          => apiClient.patch(`/reservations/${id}/cancel`).then(r => r.data),
  confirm:  (id)          => apiClient.patch(`/reservations/${id}/confirm`).then(r => r.data),
};
