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

        // Handle 401 - attempt token refresh
        if (error.response?.status === 401 && !originalRequest._isRetry) {
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
                authStorage.clearAll();
                isRefreshing = false;
                window.location.href = '/login'; // Redirect to login
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        const errorResponse = {
            status: error.response?.status || 500,
            message: error.response?.data?.message || error.message || 'An error occurred',
            code: error.response?.data?.code || 'UNKNOWN_ERROR',
        };

        // Log errors in development
        if (import.meta.env.DEV) {
            console.error('[API Error]', errorResponse);
        }

        return Promise.reject(errorResponse);
    }
);

export default apiClient;
