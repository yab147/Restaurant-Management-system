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

export const getOrderStats = async (req, res) => {
    try {
        const stats = await queryDB(
            `SELECT 
                COUNT(*) as totalOrders,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingOrders,
                SUM(CASE WHEN status = 'preparing' THEN 1 ELSE 0 END) as preparingOrders,
                SUM(CASE WHEN status = 'ready' THEN 1 ELSE 0 END) as readyOrders,
                SUM(CASE WHEN status = 'served' THEN 1 ELSE 0 END) as servedOrders,
                SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paidOrders,
                SUM(totalAmount) as totalRevenue,
                AVG(totalAmount) as avgOrderValue
            FROM orders 
            WHERE DATE(orderDate) = CURDATE()`
        );
        res.json(stats[0] || {});
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const createOrder = async (req, res) => {
    try {
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

            // Insert order items
            for (const item of items) {
                const quantity = Number(item.quantity) || 1;
                const unitPrice = Number(item.unitPrice ?? item.price) || 0;
                const subTotal = quantity * unitPrice;
                
                await connection.query(
                    'INSERT INTO order_items (orderId, itemId, itemName, quantity, unitPrice, subTotal, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [
                        orderId,
                        item.itemId,
                        item.itemName || item.name,
                        quantity,
                        unitPrice,
                        subTotal,
                        item.notes || null
                    ]
                );
            }

            await connection.commit();

            // Fetch and return the created order
            const createdOrder = await queryDB('SELECT * FROM orders WHERE orderId = ?', [orderId]);
            res.status(201).json(await mapOrder(createdOrder[0]));

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            await connection.release();
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const addOrderItem = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { itemId, itemName, quantity, unitPrice, notes } = req.body;

        // Validate order exists and user has access
        const order = await queryDB('SELECT * FROM orders WHERE orderId = ?', [orderId]);
        if (order.length === 0) return res.status(404).json({ error: 'Order not found' });
        
        const allowed = await assertOrderAccess(req, order[0], queryDB);
        if (!allowed) return res.status(403).json({ error: 'Access denied' });

        const qty = Number(quantity) || 1;
        const price = Number(unitPrice) || 0;
        const subTotal = qty * price;

        const [result] = await pool.query(
            'INSERT INTO order_items (orderId, itemId, itemName, quantity, unitPrice, subTotal, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [orderId, itemId, itemName, qty, price, subTotal, notes || null]
        );

        // Update order total amount
        const items = await queryDB('SELECT subTotal FROM order_items WHERE orderId = ?', [orderId]);
        const newTotal = items.reduce((sum, item) => sum + Number(item.subTotal), 0);
        
        await pool.query('UPDATE orders SET totalAmount = ? WHERE orderId = ?', [newTotal, orderId]);

        res.json({ success: true, orderItemId: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const removeOrderItem = async (req, res) => {
    try {
        const { orderId, itemId } = req.params;

        // Validate order exists and user has access
        const order = await queryDB('SELECT * FROM orders WHERE orderId = ?', [orderId]);
        if (order.length === 0) return res.status(404).json({ error: 'Order not found' });
        
        const allowed = await assertOrderAccess(req, order[0], queryDB);
        if (!allowed) return res.status(403).json({ error: 'Access denied' });

        await pool.query('DELETE FROM order_items WHERE orderItemId = ? AND orderId = ?', [itemId, orderId]);

        // Update order total amount
        const items = await queryDB('SELECT subTotal FROM order_items WHERE orderId = ?', [orderId]);
        const newTotal = items.reduce((sum, item) => sum + Number(item.subTotal), 0);
        
        await pool.query('UPDATE orders SET totalAmount = ? WHERE orderId = ?', [newTotal, orderId]);

        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes, tableId, customerPhone } = req.body;

        // Validate order exists and user has access
        const order = await queryDB('SELECT * FROM orders WHERE orderId = ?', [id]);
        if (order.length === 0) return res.status(404).json({ error: 'Order not found' });
        
        const allowed = await assertOrderAccess(req, order[0], queryDB);
        if (!allowed) return res.status(403).json({ error: 'Access denied' });

        const updateFields = [];
        const updateValues = [];

        if (notes !== undefined) {
            updateFields.push('notes = ?');
            updateValues.push(notes);
        }
        if (tableId !== undefined) {
            updateFields.push('tableId = ?');
            updateValues.push(tableId || null);
        }
        if (customerPhone !== undefined) {
            updateFields.push('customerPhone = ?');
            updateValues.push(customerPhone);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        updateValues.push(id);
        await pool.query(
            `UPDATE orders SET ${updateFields.join(', ')} WHERE orderId = ?`,
            updateValues
        );

        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate order exists and user has access
        const order = await queryDB('SELECT * FROM orders WHERE orderId = ?', [id]);
        if (order.length === 0) return res.status(404).json({ error: 'Order not found' });
        
        const allowed = await assertOrderAccess(req, order[0], queryDB);
        if (!allowed) return res.status(403).json({ error: 'Access denied' });

        // Check valid status transition
        const result = assertStatusTransition(req.user?.role, order[0].status, status);
        if (!result.ok) {
            return res.status(400).json({ error: result.error || 'Invalid status transition' });
        }

        await pool.query('UPDATE orders SET status = ? WHERE orderId = ?', [status, id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const assignOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { waiterId, waiterName } = req.body;

        // Validate order exists
        const order = await queryDB('SELECT * FROM orders WHERE orderId = ?', [id]);
        if (order.length === 0) return res.status(404).json({ error: 'Order not found' });

        // Only managers can reassign orders
        if (req.user?.role !== 'manager' && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Only managers can assign orders' });
        }

        await pool.query(
            'UPDATE orders SET waiterId = ?, waiterName = ? WHERE orderId = ?',
            [waiterId || null, waiterName || null, id]
        );

        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate order exists and user has access
        const order = await queryDB('SELECT * FROM orders WHERE orderId = ?', [id]);
        if (order.length === 0) return res.status(404).json({ error: 'Order not found' });
        
        const allowed = await assertOrderAccess(req, order[0], queryDB);
        if (!allowed) return res.status(403).json({ error: 'Access denied' });

        // Only allow deletion of pending or cancelled orders
        if (!['pending', 'cancelled'].includes(order[0].status)) {
            return res.status(400).json({ error: 'Can only delete pending or cancelled orders' });
        }

        await pool.query('DELETE FROM order_items WHERE orderId = ?', [id]);
        await pool.query('DELETE FROM orders WHERE orderId = ?', [id]);

        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};
