/**
 * Auth Storage Service
 * Manages tab-scoped auth tokens and session data
 */

const AUTH_TOKEN_KEY = 'holy_restaurant_token';
const USER_KEY = 'holy_restaurant_user';

const removeLegacyLocalStorageAuth = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem('holy_restaurant_refresh');
    localStorage.removeItem(USER_KEY);
};

export const authStorage = {
    // Token management
    getAccessToken: () => sessionStorage.getItem(AUTH_TOKEN_KEY),
    setAccessToken: (token) => {
        removeLegacyLocalStorageAuth();
        sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    },
    removeAccessToken: () => sessionStorage.removeItem(AUTH_TOKEN_KEY),

    // User data management
    getUser: () => {
        const user = sessionStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },
    setUser: (user) => {
        removeLegacyLocalStorageAuth();
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    removeUser: () => sessionStorage.removeItem(USER_KEY),

    // Clear all auth data
    clearAll: () => {
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        removeLegacyLocalStorageAuth();
    },

    // Check if authenticated
    isAuthenticated: () => !!sessionStorage.getItem(AUTH_TOKEN_KEY),
};

export default authStorage;
