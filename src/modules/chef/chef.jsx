import React from 'react';
import ChefSidebar from './components/ChefSidebar';
import ChefRoutes from './routes/ChefRoutes';
import DashboardLayout from '../../shared/layouts/DashboardLayout';

const ChefModule = () => {
  return (
    <DashboardLayout Sidebar={ChefSidebar}>
      <ChefRoutes />
    </DashboardLayout>
  );
};

export default ChefModule;
