import React, { lazy } from 'react';
import { PERMISSIONS } from '../../../permissions/matrix.js';
const InventoryPage = lazy(() => import('../pages/InventoryPage.jsx'));

export const inventoryRoutes = [
  { path: '/inventory', element: <InventoryPage />, permissions: [PERMISSIONS.INVENTORY_VIEW], meta: { title: 'Inventory' } },
];
