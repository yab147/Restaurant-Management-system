import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/** Public catalog — no JWT (landing page) */
export const publicMenuApi = {
  getItems: () => axios.get(`${API_BASE}/public/menu`).then(r => r.data),
  getCategories: () => axios.get(`${API_BASE}/public/menu-categories`).then(r => r.data),
};
