/**
 * Auth Feature API
 *
 * WHY THIS EXISTS:
 * All auth HTTP calls are isolated here. The AuthProvider calls these functions,
 * never calling fetch() or axios directly. This means if the backend changes
 * its endpoint from /api/login to /api/auth/login, you change ONE file, not
 * every component that ever touched authentication.
 *
 * HOW IT WORKS:
 * Uses apiClient (axios instance with interceptors) so all requests
 * automatically get auth headers, error normalization, and 401 handling.
 *
 * NOTE: login/signup/refresh are exceptions — they DON'T need a Bearer token.
 * The apiClient is smart enough to not break without a token.
 */

import apiClient from '../../../services/api/axios.js';

export const authApi = {
  /** POST /auth/login — returns { success, user, accessToken, refreshToken } */
  login: async (email, password) => {
    const { data } = await apiClient.post('/login', { email, password });
    return data;
  },

  /** POST /auth/signup — returns { success, message } */
  signup: async (name, email, password, phone) => {
    const { data } = await apiClient.post('/signup', { name, email, password, phone });
    return data;
  },

  /** POST /auth/refresh — returns { accessToken, refreshToken? } */
  refresh: async (refreshToken) => {
    const { data } = await apiClient.post('/refresh', { token: refreshToken });
    return data;
  },

  /** GET /auth/me — returns current user profile from server */
  getMe: async () => {
    const { data } = await apiClient.get('/me');
    return data;
  },
};
