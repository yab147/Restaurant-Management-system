import React, { lazy } from 'react';
import { PERMISSIONS } from '../../../permissions/matrix.js';
const ReservationsPage = lazy(() => import('../pages/ReservationsPage.jsx'));

export const reservationsRoutes = [
  { path: '/reservations', element: <ReservationsPage />, permissions: [PERMISSIONS.RESERVATIONS_VIEW], meta: { title: 'Reservations' } },
];
