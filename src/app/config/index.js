/**
 * Environment Configuration
 * Centralized config that reads from .env files
 */

const config = {
    // API Configuration
    api: {
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
        timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
        retryCount: parseInt(import.meta.env.VITE_API_RETRY_COUNT || '3'),
    },

    // Auth Configuration
    auth: {
        tokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token',
        refreshTokenKey: import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token',
        userKey: import.meta.env.VITE_AUTH_USER_KEY || 'auth_user',
        tokenRefreshPath: '/auth/refresh',
        loginPath: '/login',
    },

    // Feature Flags
    features: {
        enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
        enableReports: import.meta.env.VITE_ENABLE_REPORTS === 'true',
        enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    },

    // UI Configuration
    ui: {
        theme: import.meta.env.VITE_THEME || 'light',
        itemsPerPage: parseInt(import.meta.env.VITE_ITEMS_PER_PAGE || '25'),
    },

    // Debug Mode
    debug: import.meta.env.VITE_DEBUG === 'true' || import.meta.env.DEV,
};

export default config;

// Export individual config sections for convenience
export const apiConfig = config.api;
export const authConfig = config.auth;
export const featureFlags = config.features;
export const uiConfig = config.ui;
