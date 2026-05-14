import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import MenuSection from '../pages/MenuSection';
import ReservationsSection from '../pages/ReservationsSection';
import OrdersSection from '../pages/OrdersSection';

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="menu" element={<MenuSection />} />
      <Route path="reservations" element={<ReservationsSection />} />
      <Route path="orders" element={<OrdersSection />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
};

export default CustomerRoutes;
