/**
 * Axios API Client
 * Centralized HTTP client with interceptors for:
 * - Authorization header injection
 * - Token refresh on 401
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

// Token refresh queue management (atomic refresh)
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
    refreshQueue.forEach(callback => {
        if (error) {
            callback(error);
        } else {
            callback(null, token);
        }
    });
    refreshQueue = [];
};

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

// Response interceptor: handle 401 and token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle expired/invalid access tokens - attempt token refresh once
        if (originalRequest && isInvalidTokenResponse(error) && !originalRequest._isRetry) {
            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshQueue.push((err, token) => {
                        if (err) {
                            reject(err);
                        } else {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(apiClient(originalRequest));
                        }
                    });
                });
            }

            // Mark request as retried to prevent infinite loop
            originalRequest._isRetry = true;
            isRefreshing = true;

            try {
                const refreshToken = authStorage.getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Call refresh endpoint
                const { data } = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    { refreshToken },
                    { timeout: 10000 }
                );

                // Update stored token
                authStorage.setAccessToken(data.accessToken);
                if (data.refreshToken) {
                    authStorage.setRefreshToken(data.refreshToken);
                }

                // Process queued requests
                processQueue(null, data.accessToken);
                isRefreshing = false;

                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Token refresh failed - logout user
                processQueue(refreshError, null);
                isRefreshing = false;
                expireSession();
                return Promise.reject(refreshError);
            }
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
