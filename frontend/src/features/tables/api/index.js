import apiClient from '../../../services/api/axios.js';

export const tablesApi = {
  getAll:         ()             => apiClient.get('/tables').then(r => r.data),
  getById:        (id)           => apiClient.get(`/tables/${id}`).then(r => r.data),
  create:         (payload)      => apiClient.post('/tables', payload).then(r => r.data),
  update:         (id, payload)  => apiClient.put(`/tables/${id}`, payload).then(r => r.data),
  delete:         (id)           => apiClient.delete(`/tables/${id}`).then(r => r.data),
  updateStatus:   (id, status)   => apiClient.patch(`/tables/${id}/status`, { status }).then(r => r.data),
};
