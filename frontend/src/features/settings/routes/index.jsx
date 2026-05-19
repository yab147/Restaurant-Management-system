import React, { lazy } from 'react';
import { PERMISSIONS } from '../../../permissions/matrix.js';
import { ROUTES } from '../../../constants/routes.js';

const SettingsPage = lazy(() => import('../pages/SettingsPage.jsx'));

export const settingsRoutes = [
  { path: ROUTES.SETTINGS, element: <SettingsPage />, permissions: [PERMISSIONS.SETTINGS_VIEW], meta: { title: 'Settings' } },
];
