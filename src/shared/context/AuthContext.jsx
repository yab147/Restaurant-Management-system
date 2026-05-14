import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Restore persisted auth state on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.warn('Failed to parse stored user:', e);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        try {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
          if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        } catch (e) {
          console.warn('Failed to persist auth data:', e);
        }
        return data.user;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    return null;
  };

  const signup = async (name, email, password, phone) => {
    try {
      const response = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (e) {
      console.warn('Error clearing local storage on logout', e);
    }
  };

  const refreshAuthToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;
    try {
      const response = await fetch('http://localhost:3001/api/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken })
      });
      const data = await response.json();
      if (data.success && data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
    logout();
    return null;
  };

  // Keep localStorage in sync if currentUser changes elsewhere
  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
      else localStorage.removeItem('currentUser');
    } catch (e) {
      console.warn('Failed to sync currentUser to localStorage:', e);
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      signup,
      logout,
      refreshAuthToken,
      sidebarOpen,
      setSidebarOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
