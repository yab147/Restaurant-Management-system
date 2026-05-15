/**
 * AuthLayout — Layout for Login & Signup Pages
 * Centers the auth card on a branded background.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg-light-cream)' }}
    >
      <Outlet />
    </div>
  );
}
