import React from 'react';
import WaiterSidebar from './components/WaiterSidebar';
import WaiterRoutes from './routes/WaiterRoutes';
import DashboardLayout from '../../shared/layouts/DashboardLayout';

const WaiterModule = () => {
  return (
    <DashboardLayout Sidebar={WaiterSidebar}>
      <WaiterRoutes />
    </DashboardLayout>
  );
};

export default WaiterModule;
