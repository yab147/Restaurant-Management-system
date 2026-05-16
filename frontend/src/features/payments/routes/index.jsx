import React, { lazy } from 'react';
import { PERMISSIONS } from '../../../permissions/matrix.js';
const PaymentsPage = lazy(() => import('../pages/PaymentsPage.jsx'));

export const paymentsRoutes = [
  { path: '/payments', element: <PaymentsPage />, permissions: [PERMISSIONS.PAYMENTS_VIEW], meta: { title: 'Payments' } },
];
