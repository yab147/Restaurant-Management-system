import React from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminRoutes from './routes/AdminRoutes';
import DashboardLayout from '../../shared/layouts/DashboardLayout';

const AdminModule = () => {
  return (
    <DashboardLayout Sidebar={AdminSidebar}>
      <AdminRoutes />
    </DashboardLayout>
  );
};

export default AdminModule;
