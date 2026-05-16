/**
 * Auth Storage Service
 * Manages secure storage of auth tokens and session data
 */

const AUTH_TOKEN_KEY = 'holy_restaurant_token';
const REFRESH_TOKEN_KEY = 'holy_restaurant_refresh';
const USER_KEY = 'holy_restaurant_user';

export const authStorage = {
    // Token management
    getAccessToken: () => localStorage.getItem(AUTH_TOKEN_KEY),
    setAccessToken: (token) => localStorage.setItem(AUTH_TOKEN_KEY, token),
    removeAccessToken: () => localStorage.removeItem(AUTH_TOKEN_KEY),

    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
    setRefreshToken: (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
    removeRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),

    // User data management
    getUser: () => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },
    setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
    removeUser: () => localStorage.removeItem(USER_KEY),

    // Clear all auth data
    clearAll: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    // Check if authenticated
    isAuthenticated: () => !!localStorage.getItem(AUTH_TOKEN_KEY),
};

export default authStorage;
