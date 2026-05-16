import React, { lazy } from 'react';
import { PERMISSIONS } from '../../../permissions/matrix.js';
const TablesPage = lazy(() => import('../pages/TablesPage.jsx'));

export const tablesRoutes = [
  { path: '/tables', element: <TablesPage />, permissions: [PERMISSIONS.TABLES_VIEW], meta: { title: 'Tables' } },
];
