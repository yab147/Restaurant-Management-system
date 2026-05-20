/** Role-based SQL scope for orders queries */

export const KITCHEN_STATUSES = ['confirmed', 'preparing', 'ready'];

const PAYMENT_ROLES = new Set(['admin', 'manager', 'cashier']);

export function canAccessPayments(role) {
  return PAYMENT_ROLES.has(role);
}

/**
 * Apply role constraints to order list queries.
 * Mutates conditions[] and params[].
 */
export function applyOrderListScope(req, conditions, params) {
  const user = req.user;
  if (!user?.role) return;

  const { role, userId } = user;

  if (role === 'waiter') {
    if (req.query.unassigned === 'true') {
      conditions.push('waiterId IS NULL');
      if (!req.query.status || req.query.status === 'all') {
        conditions.push("status = 'pending'");
      }
    } else {
      conditions.push('waiterId = ?');
      params.push(Number(userId));
    }
    return;
  }

  if (role === 'chef') {
    if (req.query.status && req.query.status !== 'all') {
      if (!KITCHEN_STATUSES.includes(req.query.status)) {
        conditions.push('1 = 0');
      }
    } else {
      conditions.push(`status IN (${KITCHEN_STATUSES.map(() => '?').join(', ')})`);
      params.push(...KITCHEN_STATUSES);
    }
    return;
  }

  if (role === 'customer') {
    conditions.push('customerId = ?');
    params.push(Number(userId));
  }
}

/** Verify single-order access for detail/mutations */
export async function assertOrderAccess(req, order, queryDB) {
  const user = req.user;
  if (!user?.role) return true;

  const { role, userId } = user;
  if (['admin', 'manager', 'cashier'].includes(role)) return true;

  if (role === 'waiter') {
    if (Number(order.waiterId) === Number(userId)) return true;
    if (req.query?.unassigned === 'true' && order.waiterId == null && order.status === 'pending') return true;
    return false;
  }

  if (role === 'chef') {
    return KITCHEN_STATUSES.includes(order.status);
  }

  if (role === 'customer') {
    return Number(order.customerId) === Number(userId);
  }

  return false;
}

const STATUS_FLOW = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'served',
  served: 'paid',
};

const CHEF_NEXT = { confirmed: 'preparing', preparing: 'ready' };

export function assertStatusTransition(role, currentStatus, nextStatus) {
  if (!nextStatus) return { ok: false, error: 'Status required' };

  if (role === 'admin' || role === 'manager') return { ok: true };

  if (role === 'chef') {
    if (CHEF_NEXT[currentStatus] === nextStatus) return { ok: true };
    return { ok: false, error: 'Chefs can only move confirmed→preparing or preparing→ready' };
  }

  if (role === 'waiter') {
    if (STATUS_FLOW[currentStatus] === nextStatus) return { ok: true };
    return { ok: false, error: 'Invalid status transition for waiter' };
  }

  if (role === 'cashier') {
    if (currentStatus === 'served' && nextStatus === 'paid') return { ok: true };
    return { ok: false, error: 'Cashiers can only mark served orders as paid' };
  }

  return { ok: false, error: 'Not allowed to update order status' };
}
