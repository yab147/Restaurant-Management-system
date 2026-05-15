import React, { lazy } from 'react';
import { PERMISSIONS } from '../../../permissions/matrix.js';
const OrdersListPage = lazy(() => import('../pages/OrdersListPage.jsx'));

export const ordersRoutes = [
  { path: '/orders', element: <OrdersListPage />, permissions: [PERMISSIONS.ORDERS_VIEW], meta: { title: 'Orders' } },
];
