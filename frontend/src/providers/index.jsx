/**
 * Root Providers — Composition Root
 *
 * WHY THE ORDER MATTERS:
 *  1. QueryProvider  — must be outermost, wraps all server-state hooks
 *  2. AuthProvider   — reads from storage, provides user to everything below
 *  3. UIProvider     — sidebar/theme state, independent of auth
 *  4. PermissionProvider — derives permissions FROM auth user
 *
 * HOW TO ADD A NEW PROVIDER:
 *  Add it inside this file. Never scatter providers across App.jsx or feature files.
 */

import React, { createContext, useContext, useState } from 'react';
import { QueryProvider }     from './QueryProvider.jsx';
import { AuthProvider, useAuth } from './AuthProvider.jsx';
import { PermissionProvider } from './PermissionProvider.jsx';

// ─── UI Provider ────────────────────────────────────────────────────────────
// Manages application-level UI state that is NOT tied to auth or server state.
// Sidebar open/close, theme preference, global search visibility, etc.
// Using a simple context here is fine because these change infrequently.
const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <UIContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}

// ─── Permission bridge ───────────────────────────────────────────────────────
// Reads auth user from AuthProvider, feeds it into PermissionProvider.
// This bridge pattern keeps AuthProvider and PermissionProvider decoupled.
function PermissionBridge({ children }) {
  const { user } = useAuth();
  return (
    <PermissionProvider user={user}>
      {children}
    </PermissionProvider>
  );
}

// ─── Root Providers ──────────────────────────────────────────────────────────
export function RootProviders({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <UIProvider>
          <PermissionBridge>
            {children}
          </PermissionBridge>
        </UIProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

// ─── Re-exports for convenience ───────────────────────────────────────────────
export { useAuth }   from './AuthProvider.jsx';
export { usePermission, RequirePermission } from './PermissionProvider.jsx';

export default RootProviders;
