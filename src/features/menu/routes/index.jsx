import React, { lazy } from 'react';
import { PERMISSIONS } from '../../../permissions/matrix.js';
const MenuPage = lazy(() => import('../pages/MenuPage.jsx'));

export const menuRoutes = [
  { path: '/menu', element: <MenuPage />, permissions: [PERMISSIONS.MENU_VIEW], meta: { title: 'Menu' } },
];
