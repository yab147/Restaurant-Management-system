import React, { lazy } from 'react';
const LoginPage  = lazy(() => import('../../../pages/LoginPage.jsx'));
const SignupPage = lazy(() => import('../../../pages/SignupPage.jsx'));

export const authRoutes = [
  { path: '/login',  element: <LoginPage />,  isPublic: true },
  { path: '/signup', element: <SignupPage />,  isPublic: true },
];
