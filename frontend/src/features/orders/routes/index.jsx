import React, { lazy } from 'react';
import { PERMISSIONS } from '../../../permissions/matrix.js';
import { ROUTES } from '../../../constants/routes.js';
const OrdersListPage = lazy(() => import('../pages/OrdersListPage.jsx'));
const WaiterDashboard = lazy(() => import('../pages/WaiterDashboard.jsx'));

export const ordersRoutes = [
  { path: ROUTES.ORDERS, element: <OrdersListPage />, permissions: [PERMISSIONS.ORDERS_VIEW], meta: { title: 'Orders' } },
  { path: ROUTES.WAITER, element: <WaiterDashboard />, permissions: [PERMISSIONS.ORDERS_VIEW], meta: { title: 'Waiter Dashboard' } },
];
