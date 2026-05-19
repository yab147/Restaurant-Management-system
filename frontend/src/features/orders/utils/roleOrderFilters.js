import { ALL_ORDER_STATUSES, KITCHEN_QUEUE_STATUSES } from './orderUtils.js';

/** Status chips shown on Orders page per role */
export function getStatusFiltersForRole(role) {
  switch (role) {
    case 'chef':
      return ['all', ...KITCHEN_QUEUE_STATUSES];
    case 'waiter':
      return ['all', 'pending', 'confirmed', 'preparing', 'ready', 'served'];
    case 'cashier':
      return ['all', 'served', 'paid', 'pending', 'confirmed', 'preparing', 'ready'];
    default:
      return ALL_ORDER_STATUSES;
  }
}

/** Merge store filters with role-safe API params (server enforces scope) */
export function buildOrderQueryFilters(role, storeFilters = {}) {
  const { search, page, size, ...apiFilters } = storeFilters;
  if (role === 'waiter') {
    delete apiFilters.waiterId;
  }
  return apiFilters;
}
