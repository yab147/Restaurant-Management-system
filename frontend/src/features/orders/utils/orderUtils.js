/**
 * Order Domain Utilities
 * The single source of truth for order business logic constants.
 * Moved here from being duplicated across every role's OrdersSection.
 */

export const ORDER_STATUS_FLOW = {
  pending:   'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready:     'served',
  served:    'paid',
};

export const ORDER_STATUS_LABELS = {
  pending:   'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready:     'Ready',
  served:    'Served',
  paid:      'Paid',
  cancelled: 'Cancelled',
};

export const ALL_ORDER_STATUSES = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'served', 'paid', 'cancelled'];

/** Get next status in the workflow. Returns null if terminal state. */
export function getNextStatus(currentStatus) {
  return ORDER_STATUS_FLOW[currentStatus] ?? null;
}

/** Returns true if order is in a terminal state (no further progression) */
export function isTerminalStatus(status) {
  return ['paid', 'cancelled'].includes(status);
}

/** Calculate order total from items array */
export function calculateOrderTotal(items = []) {
  return items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
}

/** Format order display ID */
export function formatOrderId(orderId) {
  return `#${String(orderId).padStart(4, '0')}`;
}
