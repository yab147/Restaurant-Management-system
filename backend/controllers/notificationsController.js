import { queryDB } from '../db/index.js';
import { KITCHEN_STATUSES } from '../utils/orderScope.js';

const mapOrderNotification = (order) => ({
  id: `order-${order.orderId}`,
  type: 'order',
  title: `Order #${order.orderId}`,
  detail: `${order.customerName || 'Guest'} · ${order.status} · ETB ${order.totalAmount || 0}`,
  path: '/orders',
  color: '#D97706',
});

const mapKitchenNotification = (order) => ({
  id: `kitchen-${order.orderId}`,
  type: 'kitchen',
  title: `Kitchen: #${order.orderId}`,
  detail: `${order.customerName || 'Guest'} · ${order.status}`,
  path: '/kitchen',
  color: '#D97706',
});

export const getNotifications = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const items = [];
    const today = new Date().toISOString().slice(0, 10);

    if (role === 'waiter') {
      const pool = await queryDB(
        `SELECT * FROM orders WHERE status = 'pending' AND waiterId IS NULL ORDER BY orderDate DESC LIMIT 5`,
      );
      pool.forEach(o => items.push({ ...mapOrderNotification(o), title: `New order #${o.orderId}`, path: '/waiter' }));

      const mine = await queryDB(
        `SELECT * FROM orders WHERE waiterId = ? AND status IN ('pending','confirmed','preparing','ready') ORDER BY orderDate DESC LIMIT 5`,
        [userId],
      );
      mine.forEach(o => items.push({ ...mapOrderNotification(o), path: '/waiter' }));
    } else if (role === 'chef') {
      const kitchen = await queryDB(
        `SELECT * FROM orders WHERE status IN (?, ?, ?) ORDER BY orderDate DESC LIMIT 8`,
        KITCHEN_STATUSES,
      );
      kitchen.forEach(o => items.push(mapKitchenNotification(o)));
    } else if (['admin', 'manager', 'cashier'].includes(role)) {
      const pending = await queryDB(
        `SELECT * FROM orders WHERE status = 'pending' ORDER BY orderDate DESC LIMIT 5`,
      );
      pending.forEach(o => items.push(mapOrderNotification(o)));
    }

    if (['admin', 'manager', 'chef'].includes(role)) {
      const lowStock = await queryDB(
        `SELECT * FROM ingredients WHERE quantity <= threshold ORDER BY quantity ASC LIMIT 5`,
      );
      lowStock.forEach(item => {
        items.push({
          id: `stock-${item.ingredientId}`,
          type: 'inventory',
          title: `${item.name} is low`,
          detail: `${item.quantity} ${item.unit} left`,
          path: '/inventory',
          color: '#DC2626',
        });
      });
    }

    if (['admin', 'manager', 'waiter'].includes(role)) {
      const reservations = await queryDB(
        `SELECT * FROM reservations WHERE DATE(dateTime) = ? AND status = 'pending' ORDER BY dateTime ASC LIMIT 5`,
        [today],
      );
      reservations.forEach(r => {
        items.push({
          id: `reservation-${r.reservationId}`,
          type: 'reservation',
          title: 'Reservation waiting',
          detail: `${r.customerName} · ${r.guests || r.partySize || '?'} guests`,
          path: '/reservations',
          color: '#0369A1',
        });
      });
    }

    if (['admin', 'manager', 'cashier'].includes(role)) {
      const served = await queryDB(
        `SELECT * FROM orders WHERE status = 'served' ORDER BY orderDate DESC LIMIT 5`,
      );
      served.forEach(o => {
        items.push({
          id: `payment-${o.orderId}`,
          type: 'payment',
          title: `Awaiting payment #${o.orderId}`,
          detail: `${o.customerName || 'Guest'} · ETB ${o.totalAmount || 0}`,
          path: '/payments',
          color: '#DC2626',
        });
      });
    }

    res.json(items.slice(0, 12));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
