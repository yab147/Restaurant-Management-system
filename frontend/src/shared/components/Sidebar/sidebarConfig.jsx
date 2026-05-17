/**
 * Sidebar Navigation Configuration
 *
 * WHY THIS EXISTS:
 * Your old system had AdminSidebar.jsx, ManagerSidebar.jsx, CashierSidebar.jsx,
 * WaiterSidebar.jsx, ChefSidebar.jsx, CustomerSidebar.jsx — each hardcoding
 * which nav items to show.
 *
 * This file is the SINGLE config that drives the sidebar for ALL roles.
 * At runtime, the AppSidebar filters this array by the user's permissions.
 * No more duplication. No more "update 6 sidebars when adding a new route."
 *
 * HOW PERMISSIONS WORK HERE:
 * Each item has a `permissions` array. The sidebar renders the item only if
 * the logged-in user has at least ONE of those permissions.
 * This maps exactly to your permissions/matrix.js definitions.
 *
 * HOW TO ADD A NEW NAV ITEM:
 * 1. Add the permission constant to permissions/matrix.js
 * 2. Add the role → permission mapping in ROLE_PERMISSIONS
 * 3. Add the item here with that permission
 * Done. No sidebar file to update.
 */

import React from 'react';
import {
  LayoutDashboard, ClipboardList, UtensilsCrossed, Package,
  CreditCard, Table2, Calendar, BarChart3, Users, Settings,
} from 'lucide-react';
import { PERMISSIONS } from '../../../permissions/matrix.js';
import { ROUTES }      from '../../../constants/routes.js';

/**
 * Nav item shape:
 * {
 *   id:          string   — unique key
 *   label:       string   — display label
 *   icon:        ReactElement
 *   path:        string   — route to navigate to
 *   permissions: string[] — at least one required to show item
 *   group:       string   — section header (for visual grouping)
 * }
 */
export const SIDEBAR_NAV = [
  {
    id:          'dashboard',
    label:       'Dashboard',
    icon:        <LayoutDashboard size={18} />,
    path:        ROUTES.DASHBOARD,
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
    group:       'main',
  },
  {
    id:          'orders',
    label:       'Orders',
    icon:        <ClipboardList size={18} />,
    path:        ROUTES.ORDERS,
    permissions: [PERMISSIONS.ORDERS_VIEW],
    group:       'operations',
  },
  {
    id:          'menu',
    label:       'Menu',
    icon:        <UtensilsCrossed size={18} />,
    path:        ROUTES.MENU,
    permissions: [PERMISSIONS.MENU_VIEW],
    group:       'operations',
  },
  {
    id:          'waiter-dashboard',
    label:       'My Station',
    icon:        <ClipboardList size={18} />,
    path:        ROUTES.WAITER,
    permissions: [PERMISSIONS.ORDERS_VIEW],
    roles:       ['waiter'],
    group:       'operations',
  },
  {
    id:          'tables',
    label:       'Tables',
    icon:        <Table2 size={18} />,
    path:        ROUTES.TABLES,
    permissions: [PERMISSIONS.TABLES_VIEW],
    group:       'operations',
  },
  {
    id:          'reservations',
    label:       'Reservations',
    icon:        <Calendar size={18} />,
    path:        ROUTES.RESERVATIONS,
    permissions: [PERMISSIONS.RESERVATIONS_VIEW],
    group:       'operations',
  },
  {
    id:          'inventory',
    label:       'Inventory',
    icon:        <Package size={18} />,
    path:        ROUTES.INVENTORY,
    permissions: [PERMISSIONS.INVENTORY_VIEW],
    group:       'management',
  },
  {
    id:          'payments',
    label:       'Payments',
    icon:        <CreditCard size={18} />,
    path:        ROUTES.PAYMENTS,
    permissions: [PERMISSIONS.PAYMENTS_VIEW],
    group:       'management',
  },
  {
    id:          'reports',
    label:       'Reports',
    icon:        <BarChart3 size={18} />,
    path:        ROUTES.REPORTS,
    permissions: [PERMISSIONS.REPORTS_VIEW],
    group:       'management',
  },
  {
    id:          'users',
    label:       'Users',
    icon:        <Users size={18} />,
    path:        ROUTES.USERS,
    permissions: [PERMISSIONS.USERS_VIEW],
    group:       'admin',
  },
  {
    id:          'settings',
    label:       'Settings',
    icon:        <Settings size={18} />,
    path:        ROUTES.SETTINGS,
    permissions: [PERMISSIONS.SETTINGS_VIEW],
    group:       'admin',
  },
];

/** Group labels for section headers */
export const GROUP_LABELS = {
  main:       '',
  operations: 'Operations',
  management: 'Management',
  admin:      'Administration',
};

/** Role accent colours used by sidebar + topbar */
export const ROLE_COLORS = {
  admin:    '#7C3AED',
  manager:  '#0369A1',
  waiter:   '#059669',
  chef:     '#D97706',
  cashier:  '#DC2626',
  customer: '#C8862A',
};
