import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import OrdersSection from '../pages/OrdersSection';
import PaymentsSection from '../pages/PaymentsSection';

const CashierRoutes = () => {
  return (
    <Routes>
      <Route index element={<OrdersSection />} />
      <Route path="payments" element={<PaymentsSection />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
};

export default CashierRoutes;
