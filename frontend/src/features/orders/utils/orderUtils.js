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

/** Kitchen statuses shown on the chef queue board */
export const KITCHEN_QUEUE_STATUSES = ['confirmed', 'preparing', 'ready'];

/** Get next status in the workflow. Returns null if terminal state. */
export function getNextStatus(currentStatus) {
  return ORDER_STATUS_FLOW[currentStatus] ?? null;
}

/**
 * Next status the current user may set.
 * - Full edit: normal workflow (waiter, manager, admin)
 * - Queue only: kitchen steps only (confirmed → preparing → ready)
 */
export function getAdvanceableNextStatus(currentStatus, { canEdit, canQueueManage }) {
  if (canEdit) return getNextStatus(currentStatus);
  if (canQueueManage) {
    if (currentStatus === 'confirmed') return 'preparing';
    if (currentStatus === 'preparing') return 'ready';
    return null;
  }
  return null;
}

export function canAdvanceOrderStatus(currentStatus, options) {
  return !!getAdvanceableNextStatus(currentStatus, options);
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
