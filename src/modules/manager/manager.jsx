import React from 'react';
import ManagerSidebar from './components/ManagerSidebar';
import ManagerRoutes from './routes/ManagerRoutes';
import DashboardLayout from '../../shared/layouts/DashboardLayout';

const ManagerModule = () => {
  return (
    <DashboardLayout Sidebar={ManagerSidebar}>
      <ManagerRoutes />
    </DashboardLayout>
  );
};

export default ManagerModule;
