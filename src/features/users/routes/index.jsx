import React, { lazy } from 'react';
import { PERMISSIONS } from '../../../permissions/matrix.js';
const UsersPage = lazy(() => import('../pages/UsersPage.jsx'));

export const usersRoutes = [
  { path: '/users', element: <UsersPage />, permissions: [PERMISSIONS.USERS_VIEW], meta: { title: 'Users' } },
];
