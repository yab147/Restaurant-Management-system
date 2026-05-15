import apiClient from '../../../services/api/axios.js';

export const menuApi = {
  getAll:     (params)         => apiClient.get('/menu', { params }).then(r => r.data),
  getById:    (id)             => apiClient.get(`/menu/${id}`).then(r => r.data),
  create:     (payload)        => apiClient.post('/menu', payload).then(r => r.data),
  update:     (id, payload)    => apiClient.put(`/menu/${id}`, payload).then(r => r.data),
  delete:     (id)             => apiClient.delete(`/menu/${id}`).then(r => r.data),
  toggleAvailability: (id, v)  => apiClient.patch(`/menu/${id}/availability`, { availability: v }).then(r => r.data),
  getCategories: ()            => apiClient.get('/menu-categories').then(r => r.data),
  createCategory: (payload)    => apiClient.post('/menu-categories', payload).then(r => r.data),
};
