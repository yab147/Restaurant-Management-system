import React, { lazy } from 'react';
import { PERMISSIONS } from '../../../permissions/matrix.js';
import { ROUTES } from '../../../constants/routes.js';
const OrdersListPage = lazy(() => import('../pages/OrdersListPage.jsx'));
const WaiterDashboard = lazy(() => import('../pages/WaiterDashboard.jsx'));
const KitchenQueuePage = lazy(() => import('../pages/KitchenQueuePage.jsx'));

export const ordersRoutes = [
  { path: ROUTES.ORDERS, element: <OrdersListPage />, permissions: [PERMISSIONS.ORDERS_VIEW], meta: { title: 'Orders' } },
  { path: ROUTES.KITCHEN, element: <KitchenQueuePage />, permissions: [PERMISSIONS.ORDERS_QUEUE_MANAGE], meta: { title: 'Kitchen Queue' } },
  { path: ROUTES.WAITER, element: <WaiterDashboard />, permissions: [PERMISSIONS.ORDERS_VIEW], roles: ['waiter'], meta: { title: 'Waiter Dashboard' } },
];
