import React, { lazy } from 'react';
import { PERMISSIONS } from '../../../permissions/matrix.js';
const DashboardPage = lazy(() => import('../pages/DashboardPage.jsx'));

export const dashboardRoutes = [
  { path: '/dashboard', element: <DashboardPage />, permissions: [PERMISSIONS.DASHBOARD_VIEW], meta: { title: 'Dashboard' } },
];
