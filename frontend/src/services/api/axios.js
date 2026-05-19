/**
 * Axios API Client
 * Centralized HTTP client with interceptors for:
 * - Authorization header injection
 * - Session expiry handling
 * - Centralized error handling
 * - Request/response logging
 */

import axios from 'axios';
import { authStorage } from '../storage/index.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const AUTH_SESSION_EXPIRED_EVENT = 'auth:session-expired';

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const isInvalidTokenResponse = (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    return status === 401 || (status === 403 && message === 'Invalid token');
};

const expireSession = () => {
    authStorage.clearAll();
    window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

// Request interceptor: inject auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = authStorage.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Log outgoing request in development
        if (import.meta.env.DEV) {
            console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle auth expiry and normalize errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (isInvalidTokenResponse(error)) {
            expireSession();
        }

        // Handle other errors
        const errorResponse = {
            status: error.response?.status || 500,
            message: error.response?.data?.message || error.message || 'An error occurred',
            code: error.response?.data?.code || 'UNKNOWN_ERROR',
        };

        // Log non-auth errors in development
        if (import.meta.env.DEV && !isInvalidTokenResponse(error)) {
            console.error('[API Error]', errorResponse);
        }

        return Promise.reject(errorResponse);
    }
);

export default apiClient;
