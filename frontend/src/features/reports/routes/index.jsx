import React, { lazy } from 'react';
import { PERMISSIONS } from '../../../permissions/matrix.js';
const ReportsPage = lazy(() => import('../pages/ReportsPage.jsx'));

export const reportsRoutes = [
  { path: '/reports', element: <ReportsPage />, permissions: [PERMISSIONS.REPORTS_VIEW], meta: { title: 'Reports' } },
];
