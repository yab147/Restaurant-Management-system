import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import RootProviders from './providers/index.jsx';
import AppRoutes from './app/routes.jsx';
import ErrorBoundary from './shared/components/ErrorBoundary.jsx';

/**
 * App — The New Domain-Driven Entry Point
 */
function App() {
  console.log('[App] Initializing...');
  
  return (
    <ErrorBoundary>
      <RootProviders>
        <Router>
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#2C1810',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
        </Router>
      </RootProviders>
    </ErrorBoundary>
  );
}

export default App;