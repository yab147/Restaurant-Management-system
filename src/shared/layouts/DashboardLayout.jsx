import React from 'react';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, Sidebar }) => {
  const { currentUser, sidebarOpen } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="flex h-screen overflow-hidden" style={{
      background: 'var(--bg-light-almond)',
      fontFamily: "'Inter', sans-serif"
    }}>
      {Sidebar && <Sidebar />}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <Topbar />
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
