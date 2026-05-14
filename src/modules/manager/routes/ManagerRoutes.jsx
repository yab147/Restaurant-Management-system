import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import MenuSection from '../pages/MenuSection';
import OrdersSection from '../pages/OrdersSection';
import TablesSection from '../pages/TablesSection';
import ReservationsSection from '../pages/ReservationsSection';
import InventorySection from '../pages/InventorySection';
import PaymentsSection from '../pages/PaymentsSection';
import ReportsSection from '../pages/ReportsSection';

import SettingsSection from '../pages/SettingsSection';

const ManagerRoutes = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="menu" element={<MenuSection />} />
      <Route path="orders" element={<OrdersSection />} />
      <Route path="tables" element={<TablesSection />} />
      <Route path="reservations" element={<ReservationsSection />} />
      <Route path="inventory" element={<InventorySection />} />
      <Route path="payments" element={<PaymentsSection />} />
      <Route path="reports" element={<ReportsSection />} />

      <Route path="settings" element={<SettingsSection />} />
      {/* Redirect unknown dashboard routes back to main dashboard */}
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
};

export default ManagerRoutes;
