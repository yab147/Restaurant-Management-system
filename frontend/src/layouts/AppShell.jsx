/**
 * AppShell — The Main Application Layout
 *
 * WHY THIS EXISTS:
 * Replaces DashboardLayout + the role-specific module wrappers (admin.jsx,
 * manager.jsx, etc.). Those old wrappers each accepted a `Sidebar` prop and
 * composed the layout differently per role.
 *
 * This single layout wraps EVERY authenticated page. It renders:
 *  - AppSidebar (universal, permission-filtered)
 *  - AppTopbar  (universal)
 *  - <main>     (page content via Outlet)
 *
 * HOW IT INTEGRATES WITH ROUTING:
 * In routes.jsx, all protected feature routes are nested inside AppShell:
 *   <Route element={<AppShell />}>
 *     <Route path="/orders" element={<OrdersListPage />} />
 *     ...
 *   </Route>
 * React Router's <Outlet /> renders the active child route inside <main>.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from '../shared/components/Sidebar/AppSidebar.jsx';
import AppTopbar  from '../shared/components/Topbar/AppTopbar.jsx';
import { useUI }  from '../providers/index.jsx';

export default function AppShell() {
  const { sidebarOpen } = useUI();

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--bg-light-almond)', fontFamily: "'Inter', sans-serif" }}
    >
      <AppSidebar />

      {/* Main content area shifts right when sidebar is open */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300
          ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}
      >
        <AppTopbar />
        <main className="flex-1 overflow-y-auto relative">
          {/* React Router renders the active feature page here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
