import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MenuSection from '../pages/MenuSection';
import OrdersSection from '../pages/OrdersSection';
import InventorySection from '../pages/InventorySection';

const ChefRoutes = () => {
  return (
    <Routes>
      <Route index element={
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>Chef Dashboard</h1>
          <p className="text-gray-600">Welcome to the kitchen dashboard. Select an option from the sidebar to continue.</p>
        </div>
      } />
      <Route path="menu" element={<MenuSection />} />
      <Route path="orders" element={<OrdersSection />} />
      <Route path="inventory" element={<InventorySection />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
};

export default ChefRoutes;
