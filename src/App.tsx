import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

type View = 'landing' | 'login' | 'dashboard';

const AppContent: React.FC = () => {
  const { currentUser } = useApp();
  const [view, setView] = useState<View>('landing');

  // If logged in, always show dashboard
  if (currentUser) {
    return <Dashboard />;
  }

  if (view === 'login') {
    return (
      <LoginPage
        onBack={() => setView('landing')}
        onSuccess={() => setView('dashboard')}
      />
    );
  }

  return (
    <LandingPage
      onLoginClick={() => setView('login')}
    />
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
