/**
 * Application Route Constants
 *
 * WHY THIS EXISTS:
 * Hardcoding route strings like '/orders' in 30 different components means
 * changing a route path requires a global search-and-replace. That's fragile.
 *
 * With this file, every component imports ROUTES.ORDERS.LIST and if the path
 * ever changes (e.g., from '/orders' to '/app/orders'), you change ONE line here.
 *
 * HOW TO USE:
 *   import { ROUTES } from '../constants/routes.js';
 *   <Link to={ROUTES.ORDERS.LIST}>Orders</Link>
 *   navigate(ROUTES.AUTH.LOGIN);
 */

export const ROUTES = {
  // Public routes
  HOME:   '/',
  AUTH: {
    LOGIN:  '/login',
    SIGNUP: '/signup',
  },

  // Feature routes (domain-driven, single path per domain)
  DASHBOARD:    '/dashboard',
  ORDERS:       '/orders',
  KITCHEN:      '/kitchen',
  MENU:         '/menu',
  INVENTORY:    '/inventory',
  PAYMENTS:     '/payments',
  TABLES:       '/tables',
  RESERVATIONS: '/reservations',
  REPORTS:      '/reports',
  USERS:        '/users',
  SETTINGS:     '/settings',
  WAITER:       '/waiter',

  // Role-based redirect targets (used only in auth redirect logic)
  ROLE_DEFAULTS: {
    admin:    '/dashboard',
    manager:  '/dashboard',
    cashier:  '/dashboard',
    waiter:   '/waiter',
    chef:     '/kitchen',
    customer: '/dashboard',
  },
};
