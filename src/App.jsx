import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
const AppContent = () => {
  const {
    currentUser
  } = useApp();
  const [view, setView] = useState('landing');

  // If logged in, always show dashboard
  if (currentUser) {
    return <Dashboard />;
  }
  if (view === 'login') {
    return <LoginPage onBack={() => setView('landing')} onSuccess={() => setView('dashboard')} />;
  }
  return <LandingPage onLoginClick={() => setView('login')} />;
};
const App = () => {
  return <AppProvider>
      <AppContent />
    </AppProvider>;
};
export default App;