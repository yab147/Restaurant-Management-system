import React, { lazy } from 'react';
import { PERMISSIONS } from '../../../permissions/matrix.js';
const MenuPage = lazy(() => import('../pages/MenuPage.jsx'));
const OrderDetail = lazy(() => import('../pages/OrderDetail.jsx'));
export const menuRoutes = [
  { path: '/menu', element: <MenuPage />, permissions: [PERMISSIONS.MENU_VIEW], meta: { title: 'Menu' }},
  { path: 'customerOrders', element: <OrderDetail />, permissions: [PERMISSIONS.ORDERS_VIEW], roles: ['customer'], meta: { title: 'My Orders' } },

];
