import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AdminDashboard from './dashboard/AdminDashboard';
import MenuSection from './sections/MenuSection';
import OrdersSection from './sections/OrdersSection';
import TablesSection from './sections/TablesSection';
import ReservationsSection from './sections/ReservationsSection';
import InventorySection from './sections/InventorySection';
import PaymentsSection from './sections/PaymentsSection';
import ReportsSection from './sections/ReportsSection';
import UsersSection from './sections/UsersSection';
import SettingsSection from './dashboard/SettingsSection';
import CustomerDashboard from './dashboard/CustomerDashboard';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const { currentUser, sidebarOpen } = useApp();

  if (!currentUser) return null;

  return (
    <div className="flex h-screen overflow-hidden" style={{
      background: 'var(--bg-light-almond)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <Sidebar />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={
              currentUser.role === 'customer' 
                ? <CustomerDashboard /> 
                : <AdminDashboard />
            } />
            <Route path="menu" element={<MenuSection />} />
            <Route path="orders" element={<OrdersSection />} />
            <Route path="tables" element={<TablesSection />} />
            <Route path="reservations" element={<ReservationsSection />} />
            <Route path="inventory" element={<InventorySection />} />
            <Route path="payments" element={<PaymentsSection />} />
            <Route path="reports" element={<ReportsSection />} />
            <Route path="users" element={<UsersSection />} />
            <Route path="settings" element={<SettingsSection />} />
            {/* Redirect unknown dashboard routes back to main dashboard */}
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;