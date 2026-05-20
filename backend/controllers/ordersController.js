import { pool, queryDB } from '../db/index.js';
import {
    applyOrderListScope,
    assertOrderAccess,
    assertStatusTransition,
    KITCHEN_STATUSES,
} from '../utils/orderScope.js';

const mapOrderItem = (item) => ({
    ...item,
    quantity: Number(item.quantity) || 0,
    unitPrice: Number(item.unitPrice) || 0,
    subTotal: Number(item.subTotal) || 0,
});

const mapOrder = async (order) => ({
    ...order,
    totalAmount: Number(order.totalAmount) || 0,
    items: (await queryDB('SELECT * FROM order_items WHERE orderId = ?', [order.orderId])).map(mapOrderItem),
});

export const getOrders = async (req, res) => {
    try {
        const conditions = [];
        const params = [];

        if (req.query.status && req.query.status !== 'all') {
            conditions.push('status = ?');
            params.push(req.query.status);
        }
        if (req.query.type && req.query.type !== 'all') {
            conditions.push('type = ?');
            params.push(req.query.type);
        }
        if (req.query.tableId) {
            conditions.push('tableId = ?');
            params.push(Number(req.query.tableId));
        }
        if (req.query.startDate) {
            conditions.push('DATE(orderDate) >= ?');
            params.push(req.query.startDate);
        }
        if (req.query.endDate) {
            conditions.push('DATE(orderDate) <= ?');
            params.push(req.query.endDate);
        }

        applyOrderListScope(req, conditions, params);

        const sql = `SELECT * FROM orders${conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''} ORDER BY orderDate DESC`;
        const orders = await queryDB(sql, params);
        res.json(await Promise.all(orders.map(mapOrder)));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getOrderQueue = async (req, res) => {
    req.query.status = req.query.status || 'preparing';
    if (req.user?.role === 'chef' && !KITCHEN_STATUSES.includes(req.query.status)) {
        req.query.status = 'preparing';
    }
    return getOrders(req, res);
};

export const getOrderById = async (req, res) => {
    try {
        const order = await queryDB('SELECT * FROM orders WHERE orderId = ?', [req.params.id]);
        if (order.length === 0) return res.status(404).json({ error: 'Order not found' });
        const allowed = await assertOrderAccess(req, order[0], queryDB);
        if (!allowed) return res.status(403).json({ error: 'Access denied' });
        res.json(await mapOrder(order[0]));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const createOrder = async (req, res) => {
    const { tableId, tableNumber, customerPhone, type, items, totalAmount, notes, waiterId, waiterName } = req.body;
    
    // Validation based on order type
    if (!type || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Type and at least one item are required' });
    }
    
    // For takeaway: phone number is required
    if (type === 'takeaway') {
        if (!customerPhone || customerPhone.trim() === '') {
            return res.status(400).json({ error: 'Customer phone is required for takeaway orders' });
        }
    }
    
    // For dine-in: table is required
    if (type === 'dine-in' && !tableId) {
        return res.status(400).json({ error: 'Table is required for dine-in orders' });
    }

    let assignedWaiterId = waiterId || null;
    let assignedWaiterName = waiterName || null;
    if (req.user?.role === 'waiter') {
        assignedWaiterId = req.user.userId;
        assignedWaiterName = req.user.name || req.user.email;
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [orderResult] = await connection.query(
            'INSERT INTO orders (tableId, tableNumber, customerPhone, waiterId, waiterName, type, status, orderDate, totalAmount, notes) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)',
            [tableId || null, tableNumber || null, customerPhone || null, assignedWaiterId, assignedWaiterName, type, 'pending', totalAmount, notes || null]
        );
        const orderId = orderResult.insertId;

        for (const item of items) {
            const quantity = Number(item.quantity) || 1;
            const unitPrice = Number(item.unitPrice ?? item.price) || 0;
            await connection.query(
                'INSERT INTO order_items (orderId, itemId, itemName, quantity, unitPrice, subTotal, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    orderId,
                    item.itemId,
                    item.itemName || item.name,import React, { useState } from 'react'
import Modal from '../ui/Modal'
import { useMenuItems } from '../../../features/menu/hooks/useMenu.js'
import { useTables } from '../../../features/tables/hooks/useTables.js'
import { useCreateOrder } from '../../../features/orders/hooks/useOrders.js'
import { useAuth } from '../../../providers/AuthProvider.jsx'
import { calculateOrderTotal } from '../../../features/orders/utils/orderUtils.js'
// Import for phone input with country code
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

export default function CustomerModal({ isOpen, onClose, initialItems = [] }) {
  const { data: menuItems = [] } = useMenuItems();
  const { data: tables = [] } = useTables();
  const createOrderMutation = useCreateOrder();
  const { user } = useAuth();

  const [newForm, setNewForm] = useState({ 
    customerPhone: '',
    tableId: '', 
    type: 'dine-in', 
    notes: '' 
  });
  const [orderItems, setOrderItems] = useState([]);

  React.useEffect(() => {
    if (isOpen && Array.isArray(initialItems) && initialItems.length > 0) {
      setOrderItems(initialItems.map(id => ({ itemId: id, qty: 1 })));
    }
    if (!isOpen) {
      setOrderItems([]);
      setNewForm({ 
        customerPhone: '', 
        tableId: '', 
        type: 'dine-in', 
        notes: '' 
      });
    }
  }, [isOpen, initialItems]);

  const addItemToOrder = (itemId) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.itemId === itemId);
      if (existing) return prev.map(i => i.itemId === itemId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { itemId, qty: 1 }];
    });
  };

  // Calculate total amount from order items
  const totalAmount = orderItems.reduce((total, oi) => {
    const menu = menuItems.find(m => m.itemId === oi.itemId);
    return total + (menu?.price || 0) * oi.qty;
  }, 0);

  const handleCreateOrder = () => {
    // For dine-in: no phone number required
    if (newForm.type === 'dine-in') {
      if (orderItems.length === 0) return;
      if (!newForm.tableId) return;
      
      const table = tables.find(t => t.tableId === Number(newForm.tableId));
      const items = orderItems.map(oi => {
        const menu = menuItems.find(m => m.itemId === oi.itemId);
        return { 
          itemId: oi.itemId, 
          itemName: menu?.name, 
          quantity: oi.qty, 
          unitPrice: menu?.price, 
          subTotal: (menu?.price || 0) * oi.qty 
        };
      });
      const totalAmountCalc = calculateOrderTotal(items.map(i => ({ unitPrice: i.unitPrice, quantity: i.quantity })));
      const waiterData = user?.role === 'waiter' ? { waiterId: user.userId, waiterName: user.name } : {};

      createOrderMutation.mutate({
        customerPhone: '',
        tableId: table?.tableId, 
        tableNumber: table?.number,
        type: newForm.type, 
        totalAmount: totalAmountCalc, 
        notes: newForm.notes, 
        items,
        ...waiterData,
      }, {
        onSuccess: () => {
          setNewForm({ 
            customerPhone: '', 
            tableId: '', 
            type: 'dine-in', 
            notes: '' 
          });
          setOrderItems([]);
          onClose();
        }
      });
      return;
    }

    // For takeaway: phone number required
    if (newForm.type === 'takeaway') {
      if (!newForm.customerPhone) return;
      if (orderItems.length === 0) return;
      
      const items = orderItems.map(oi => {
        const menu = menuItems.find(m => m.itemId === oi.itemId);
        return { 
          itemId: oi.itemId, 
          itemName: menu?.name, 
          quantity: oi.qty, 
          unitPrice: menu?.price, 
          subTotal: (menu?.price || 0) * oi.qty 
        };
      });
      const totalAmountCalc = calculateOrderTotal(items.map(i => ({ unitPrice: i.unitPrice, quantity: i.quantity })));
      const waiterData = user?.role === 'waiter' ? { waiterId: user.userId, waiterName: user.name } : {};

      createOrderMutation.mutate({
        customerPhone: newForm.customerPhone,
        tableId: null,
        tableNumber: null,
        type: newForm.type, 
        totalAmount: totalAmountCalc, 
        notes: newForm.notes, 
        items,
        ...waiterData,
      }, {
        onSuccess: () => {
          setNewForm({ 
            customerPhone: '', 
            tableId: '', 
            type: 'dine-in', 
            notes: '' 
          });
          setOrderItems([]);
          onClose();
        }
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Order" size="lg"
      footer={(
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-medium cursor-pointer"
            style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
          <button onClick={handleCreateOrder} disabled={createOrderMutation.isPending}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)' }}>
            {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      )}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold" style={{ color: '#2C1810' }}>Order Details</h4>
          
          {/* Order Type Selection */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Order Type</label>
            <select value={newForm.type} onChange={e => setNewForm(p => ({ ...p, type: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ border: '2px solid #E8D5C0', color: '#2C1810', background: 'white' }}>
              <option value="dine-in">Dine In</option>
              <option value="takeaway">Takeaway</option>
            </select>
          </div>

          {/* Customer Phone with Country Code - ONLY for takeaway */}
          {newForm.type === 'takeaway' && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>
                Customer Phone <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                international
                countryCallingCodeEditable
                defaultCountry="ET"
                value={newForm.customerPhone}
                onChange={(value) => setNewForm(p => ({ ...p, customerPhone: value || '' }))}
                placeholder="Enter phone number with country code"
                className="w-full"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: '2px solid #E8D5C0',
                  background: 'white',
                  fontSize: '0.875rem',
                }}
              />
            </div>
          )}

          {/* Table Selection - ONLY for dine-in */}
          {newForm.type === 'dine-in' && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Table</label>
              <select value={newForm.tableId} onChange={e => setNewForm(p => ({ ...p, tableId: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ border: '2px solid #E8D5C0', color: '#2C1810', background: 'white' }}>
                <option value="">Select table</option>
                {tables.filter(t => t.status === 'available').map(t => (
                  <option key={t.tableId} value={t.tableId}>Table {t.number} ({t.capacity} seats)</option>
                ))}
              </select>
            </div>
          )}

          {/* Selected Items Section with Total */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Selected Items</label>
            {orderItems.length === 0 ? (
              <p className="text-xs" style={{ color: '#8B6E52' }}>No items selected</p>
            ) : (
              <div className="space-y-2">
                {orderItems.map(oi => {
                  const menu = menuItems.find(m => m.itemId === oi.itemId);
                  return (
                    <div key={oi.itemId} className="flex items-center justify-between text-sm p-2 rounded-lg" style={{ background: '#FDF6EE' }}>
                      <span style={{ color: '#2C1810' }}>{menu?.name}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setOrderItems(p => p.map(i => i.itemId === oi.itemId ? { ...i, qty: Math.max(0, i.qty - 1) } : i).filter(i => i.qty > 0))}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
                          style={{ background: '#F0E8DE', color: '#8B6E52' }}>−</button>
                        <span className="font-bold" style={{ color: '#C8862A' }}>{oi.qty}</span>
                        <button onClick={() => addItemToOrder(oi.itemId)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
                          style={{ background: '#C8862A', color: 'white' }}>+</button>
                        <span className="text-xs" style={{ color: '#C8862A' }}>ETB {(menu?.price || 0) * oi.qty}</span>
                      </div>
                    </div>
                  );
                })}
                {/* Total Birr span with "Total:" text */}
                <div className="flex justify-end mt-3 pt-2 border-t border-amber-200">
                  <span className="font-bold text-lg" style={{ color: '#bd6023' }}>
                    Total: ETB {totalAmount}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Menu Items Selection */}
        <div>
          <h4 className="font-semibold mb-3" style={{ color: '#2C1810' }}>Select Items</h4>
          <div className="space-y-2 max-h-80 overflow-y-auto animate-fadeIn">
            {menuItems.filter(m => m.availability).map(item => (
              <button key={item.itemId} onClick={() => addItemToOrder(item.itemId)}
                className="w-full flex items-center justify-between p-3 rounded-xl text-left transition-all hover:scale-[1.01] cursor-pointer"
                style={{ background: '#FDF6EE', border: '1px solid #F0E8DE' }}>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#2C1810' }}>{item.name}</p>
                  <p className="text-xs" style={{ color: '#8B6E52' }}>ETB {item.price}</p>
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#C8862A', color: 'white' }}>+</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
                    quantity,
                    unitPrice,
                    Number(item.subTotal) || unitPrice * quantity,
                    item.notes || null,
                ]
            );
        }

        await connection.commit();
        res.json({ success: true, orderId });
    } catch (e) {
        await connection.rollback();
        res.status(500).json({ error: e.message });
    } finally {
        connection.release();
    }
};

export const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { tableId, tableNumber, type, totalAmount, notes } = req.body;
    try {
        const existing = await queryDB('SELECT * FROM orders WHERE orderId = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Order not found' });
        if (!(await assertOrderAccess(req, existing[0], queryDB))) {
            return res.status(403).json({ error: 'Access denied' });
        }
        await pool.query(
            'UPDATE orders SET tableId=?, tableNumber=?, type=?, totalAmount=?, notes=? WHERE orderId=?',
            [tableId, tableNumber, type, totalAmount, notes, id]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const existing = await queryDB('SELECT * FROM orders WHERE orderId = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Order not found' });
        const order = existing[0];
        if (!(await assertOrderAccess(req, order, queryDB))) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const check = assertStatusTransition(req.user?.role, order.status, req.body.status);
        if (!check.ok) return res.status(403).json({ error: check.error });
        await pool.query('UPDATE orders SET status=? WHERE orderId=?', [req.body.status, req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const assignOrder = async (req, res) => {
    const { status } = req.body;
    let { waiterId, waiterName } = req.body;

    if (req.user?.role === 'waiter') {
        waiterId = req.user.userId;
        waiterName = req.user.name || req.user.email;
    }

    try {
        const existing = await queryDB('SELECT * FROM orders WHERE orderId = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Order not found' });
        const order = existing[0];
        if (req.user?.role === 'waiter' && order.waiterId != null && Number(order.waiterId) !== Number(req.user.userId)) {
            return res.status(403).json({ error: 'Order already assigned to another waiter' });
        }
        await pool.query(
            'UPDATE orders SET waiterId=?, waiterName=?, status=COALESCE(?, status) WHERE orderId=?',
            [waiterId || null, waiterName || null, status || null, req.params.id]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteOrder = async (req, res) => {
    try {
        if (!['admin', 'manager'].includes(req.user?.role)) {
            return res.status(403).json({ error: 'Only managers can delete orders' });
        }
        await pool.query('DELETE FROM order_items WHERE orderId=?', [req.params.id]);
        await pool.query('DELETE FROM orders WHERE orderId=?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const addOrderItem = async (req, res) => {
    const { itemId, itemName, name, quantity = 1, unitPrice, price, notes } = req.body;
    const parsedQuantity = Number(quantity) || 1;
    const parsedPrice = Number(unitPrice ?? price) || 0;

    try {
        const existing = await queryDB('SELECT * FROM orders WHERE orderId = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Order not found' });
        if (!(await assertOrderAccess(req, existing[0], queryDB))) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const [result] = await pool.query(
            'INSERT INTO order_items (orderId, itemId, itemName, quantity, unitPrice, subTotal, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.params.id, itemId, itemName || name, parsedQuantity, parsedPrice, parsedPrice * parsedQuantity, notes || null]
        );
        res.json({ success: true, orderItemId: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const removeOrderItem = async (req, res) => {
    try {
        const existing = await queryDB('SELECT * FROM orders WHERE orderId = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Order not found' });
        if (!(await assertOrderAccess(req, existing[0], queryDB))) {
            return res.status(403).json({ error: 'Access denied' });
        }
        await pool.query('DELETE FROM order_items WHERE orderId=? AND orderItemId=?', [req.params.id, req.params.itemId]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getOrderStats = async (req, res) => {
    try {
        const conditions = ['(? IS NULL OR DATE(orderDate) >= ?)', '(? IS NULL OR DATE(orderDate) <= ?)'];
        const params = [
            req.query.startDate || null,
            req.query.startDate || null,
            req.query.endDate || null,
            req.query.endDate || null,
        ];

        if (req.user?.role === 'waiter') {
            conditions.push('waiterId = ?');
            params.push(Number(req.user.userId));
        } else if (req.user?.role === 'chef') {
            conditions.push(`status IN (${KITCHEN_STATUSES.map(() => '?').join(', ')})`);
            params.push(...KITCHEN_STATUSES);
        }

        const stats = await queryDB(`
            SELECT
                COUNT(*) AS totalOrders,
                SUM(CASE WHEN status NOT IN ('paid', 'cancelled') THEN 1 ELSE 0 END) AS activeOrders,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingOrders,
                SUM(CASE WHEN status = 'served' THEN 1 ELSE 0 END) AS servedOrders,
                COALESCE(SUM(totalAmount), 0) AS totalRevenue,
                COALESCE(AVG(totalAmount), 0) AS averageOrderValue
            FROM orders
            WHERE ${conditions.join(' AND ')}
        `, params);
        const row = stats[0] || {};
        res.json({
            ...row,
            totalOrders: Number(row.totalOrders) || 0,
            activeOrders: Number(row.activeOrders) || 0,
            pendingOrders: Number(row.pendingOrders) || 0,
            servedOrders: Number(row.servedOrders) || 0,
            totalRevenue: Number(row.totalRevenue) || 0,
            averageOrderValue: Number(row.averageOrderValue) || 0,
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
};