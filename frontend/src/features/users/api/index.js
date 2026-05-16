import apiClient from '../../../services/api/axios.js';

export const usersApi = {
  getAll:    ()             => apiClient.get('/users').then(r => r.data),
  getById:   (id)           => apiClient.get(`/users/${id}`).then(r => r.data),
  create:    (payload)      => apiClient.post('/users', payload).then(r => r.data),
  update:    (id, payload)  => apiClient.put(`/users/${id}`, payload).then(r => r.data),
  delete:    (id)           => apiClient.delete(`/users/${id}`).then(r => r.data),
  changeRole:(id, role)     => apiClient.patch(`/users/${id}/role`, { role }).then(r => r.data),
};
