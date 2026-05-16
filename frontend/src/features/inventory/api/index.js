import apiClient from '../../../services/api/axios.js';

export const inventoryApi = {
  getAll:   (params)      => apiClient.get('/ingredients', { params }).then(r => r.data),
  getById:  (id)          => apiClient.get(`/ingredients/${id}`).then(r => r.data),
  create:   (payload)     => apiClient.post('/ingredients', payload).then(r => r.data),
  update:   (id, payload) => apiClient.put(`/ingredients/${id}`, payload).then(r => r.data),
  delete:   (id)          => apiClient.delete(`/ingredients/${id}`).then(r => r.data),
  restock:  (id, amount)  => apiClient.patch(`/ingredients/${id}/restock`, { amount }).then(r => r.data),
  getLowStock: ()         => apiClient.get('/ingredients/low-stock').then(r => r.data),
};
