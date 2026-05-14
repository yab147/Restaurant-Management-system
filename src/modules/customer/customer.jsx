import React from 'react';
import CustomerSidebar from './components/CustomerSidebar';
import CustomerRoutes from './routes/CustomerRoutes';
import DashboardLayout from '../../shared/layouts/DashboardLayout';

const CustomerModule = () => {
  return (
    <DashboardLayout Sidebar={CustomerSidebar}>
      <CustomerRoutes />
    </DashboardLayout>
  );
};

export default CustomerModule;
