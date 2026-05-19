/**
 * Master Route Registry — app/routes.jsx
 *
 * WHY THIS IS THE HEART OF THE NEW ARCHITECTURE:
 * The old App.jsx had routes like <Route path="/admin/*"> locked by role.
 * This file registers routes by PERMISSION, not role.
 *
 * HOW IT WORKS:
 *  1. AllFeatureRoutes = merged array from every feature's routes/index.jsx
 *  2. <AppShell> wraps all authenticated feature routes
 *  3. ProtectedRoute checks auth AND permissions before rendering
 *  4. Lazy loading means each feature page is a separate bundle chunk
 *
 * ADDING A NEW FEATURE:
 *  1. Create features/myFeature/routes/index.jsx
 *  2. Import it here and spread into ALL_FEATURE_ROUTES
 *  Done. The sidebar, route guard, and code splitting all work automatically.
 */

import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { useAuth }       from '../providers/AuthProvider.jsx';
import { usePermission } from '../providers/PermissionProvider.jsx';
import AppShell          from '../layouts/AppShell.jsx';
import AuthLayout        from '../layouts/AuthLayout.jsx';
import Spinner           from '../shared/components/ui/Spinner.jsx';

// Public pages (kept in src/pages/ as agreed)
import LandingPage  from '../pages/LandingPage.jsx';
import LoginPage    from '../pages/LoginPage.jsx';
import SignupPage   from '../pages/SignupPage.jsx';
import { ROUTES }   from '../constants/routes.js';

// Feature route registries (each feature self-registers its routes)
import { ordersRoutes }      from '../features/orders/routes/index.jsx';
import { menuRoutes }        from '../features/menu/routes/index.jsx';
import { inventoryRoutes }   from '../features/inventory/routes/index.jsx';
import { paymentsRoutes }    from '../features/payments/routes/index.jsx';
import { tablesRoutes }      from '../features/tables/routes/index.jsx';
import { reservationsRoutes} from '../features/reservations/routes/index.jsx';
import { reportsRoutes }     from '../features/reports/routes/index.jsx';
import { usersRoutes }       from '../features/users/routes/index.jsx';
import { dashboardRoutes }   from '../features/dashboard/routes/index.jsx';

// All feature routes in one flat array
const ALL_FEATURE_ROUTES = [
  ...dashboardRoutes,
  ...ordersRoutes,
  ...menuRoutes,
  ...inventoryRoutes,
  ...paymentsRoutes,
  ...tablesRoutes,
  ...reservationsRoutes,
  ...reportsRoutes,
  ...usersRoutes,
];

// ── Loading fallback ─────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" />
    </div>
  );
}

// ── Protected route wrapper ──────────────────────────────────────────────────
function ProtectedRoute({ route }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { hasAnyPermission }               = usePermission();
  const location                           = useLocation();

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (route.roles?.length > 0 && !route.roles.includes(user?.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 p-8 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
          Access Denied
        </h2>
        <p className="text-sm" style={{ color: '#8B6E52' }}>
          This page is not available for your role.
        </p>
      </div>
    );
  }

  // Permission gate — if route declares required permissions, enforce them
  if (route.permissions?.length > 0 && !hasAnyPermission(route.permissions)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 p-8 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
          Access Denied
        </h2>
        <p className="text-sm" style={{ color: '#8B6E52' }}>
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  return <Suspense fallback={<PageLoader />}>{route.element}</Suspense>;
}

// ── Guest route wrapper (redirect to dashboard if already logged in) ─────────
function GuestRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <PageLoader />;
  if (isAuthenticated) {
    const dest = ROUTES.ROLE_DEFAULTS[user?.role] || ROUTES.DASHBOARD;
    return <Navigate to={dest} replace />;
  }
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

// ── App Routes ───────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public landing page ─── */}
      <Route path="/" element={<LandingPage />} />

      {/* ── Auth pages (guest-only) ─── */}
      <Route element={<AuthLayout />}>
        <Route path="/login"  element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
      </Route>

      {/* ── Protected app pages (all feature routes inside AppShell) ─── */}
      <Route element={<AppShell />}>
        {ALL_FEATURE_ROUTES.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={<ProtectedRoute route={route} />}
          />
        ))}
        {/* Default authenticated redirect */}
        <Route path="/app" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* ── 404 ─── */}
      <Route path="*" element={
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
          <div className="text-6xl mb-4">404</div>
          <h2 className="text-2xl font-black mb-2" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
            Page Not Found
          </h2>
          <a href="/" className="text-sm font-semibold" style={{ color: '#C8862A' }}>← Back to Home</a>
        </div>
      } />
    </Routes>
  );
}
