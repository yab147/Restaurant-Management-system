/**
 * AuthProvider — Single Source of Truth for Authentication
 *
 * WHY THIS EXISTS:
 * The old system had two auth contexts fighting each other:
 *   - shared/context/AuthContext.jsx (used by modules/)
 *   - providers/AuthProvider.jsx (unused skeleton)
 *
 * This file is the consolidated replacement. It owns:
 *   - JWT access token lifecycle
 *   - User session persistence via sessionStorage (keys: holy_restaurant_*)
 *   - Login, signup, logout
 *
 * HOW DATA FLOWS:
 *   Login form → authApi.login() → stores tokens → setUser()
 *   App boot   → authStorage.getUser() → restores current tab session
 *   Auth error → axios interceptor clears session → redirects to login
 *   Logout     → authStorage.clearAll() → setUser(null)
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authStorage } from '../services/storage/index.js';
import { authApi } from '../features/auth/api/index.js';

const AuthContext = createContext(null);
const AUTH_SESSION_EXPIRED_EVENT = 'auth:session-expired';

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Restore session from sessionStorage on first render
  useEffect(() => {
    const storedUser  = authStorage.getUser();
    const storedToken = authStorage.getAccessToken();
    if (storedUser && storedToken) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setAuthError(null);
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, []);

  /** Login — calls backend, stores tokens & user, updates state */
  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const data = await authApi.login(email, password);
      if (data.success && data.user) {
        authStorage.setUser(data.user);
        authStorage.setAccessToken(data.accessToken);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      const msg = data.message || 'Invalid credentials';
      setAuthError(msg);
      return { success: false, error: msg };
    } catch (err) {
      const msg = err?.message || 'Login failed. Please try again.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  }, []);

  /** Signup — creates account, does NOT auto-login */
  const signup = useCallback(async (name, email, password, phone) => {
    setAuthError(null);
    try {
      const data = await authApi.signup(name, email, password, phone);
      if (data.success) return { success: true };
      const msg = data.message || 'Signup failed';
      setAuthError(msg);
      return { success: false, error: msg };
    } catch (err) {
      const msg = err?.message || 'Signup failed. Please try again.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  }, []);

  /** Logout — clears all tokens & user from memory and storage */
  const logout = useCallback(() => {
    authStorage.clearAll();
    setUser(null);
    setAuthError(null);
  }, []);

  /** Update stored user profile (e.g., after profile edit) */
  const updateUser = useCallback((updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    authStorage.setUser(updated);
  }, [user]);

  const value = {
    user,
    isLoading,
    authError,
    isAuthenticated: !!user && authStorage.isAuthenticated(),
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
