import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './shared/context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import ManagerModule from './modules/manager/manager';
import CashierModule from './modules/cashier/cashier';
import AdminModule from './modules/admin/admin';
import WaiterModule from './modules/waiter/waiter';
import ChefModule from './modules/chef/chef';
import CustomerModule from './modules/customer/customer';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If no specific roles are required, just let them in (this is a fallback)
  if (!allowedRoles) {
    return children;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to their respective dashboard
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }
  
  return children;
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        } 
      />
      
      {/* Role-based Modules */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminModule />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/manager/*" 
        element={
          <ProtectedRoute allowedRoles={['manager', 'admin']}>
            <ManagerModule />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cashier/*" 
        element={
          <ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <CashierModule />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/waiter/*" 
        element={
          <ProtectedRoute allowedRoles={['waiter', 'admin']}>
            <WaiterModule />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chef/*" 
        element={
          <ProtectedRoute allowedRoles={['chef', 'admin']}>
            <ChefModule />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer/*" 
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerModule />
          </ProtectedRoute>
        } 
      />

      {/* Redirect unknown routes to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;