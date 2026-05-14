import React from 'react';
import CashierSidebar from './components/CashierSidebar';
import CashierRoutes from './routes/CashierRoutes';
import DashboardLayout from '../../shared/layouts/DashboardLayout';

const CashierModule = () => {
  return (
    <DashboardLayout Sidebar={CashierSidebar}>
      <CashierRoutes />
    </DashboardLayout>
  );
};

export default CashierModule;
