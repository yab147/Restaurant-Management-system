import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MenuSection from '../pages/MenuSection';
import OrdersSection from '../pages/OrdersSection';
import TablesSection from '../pages/TablesSection';
import ReservationsSection from '../pages/ReservationsSection';

const WaiterRoutes = () => {
  return (
    <Routes>
      <Route index element={
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>Waiter Dashboard</h1>
          <p className="text-gray-600">Welcome to your dashboard. Select an option from the sidebar to continue.</p>
        </div>
      } />
      <Route path="menu" element={<MenuSection />} />
      <Route path="orders" element={<OrdersSection />} />
      <Route path="tables" element={<TablesSection />} />
      <Route path="reservations" element={<ReservationsSection />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
};

export default WaiterRoutes;
