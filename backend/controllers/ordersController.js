import { pool, queryDB } from '../db/index.js';

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
        if (req.query.waiterId !== undefined && req.query.waiterId !== null && req.query.waiterId !== '') {
            conditions.push('waiterId = ?');
            params.push(Number(req.query.waiterId));
        }
        if (req.query.unassigned === 'true') {
            conditions.push('waiterId IS NULL');
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

        const sql = `SELECT * FROM orders${conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''} ORDER BY orderDate DESC`;
        const orders = await queryDB(sql, params);
        res.json(await Promise.all(orders.map(mapOrder)));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getOrderQueue = async (req, res) => {
    req.query.status = req.query.status || 'preparing';
    return getOrders(req, res);
};

export const getOrderById = async (req, res) => {
    try {
        const order = await queryDB('SELECT * FROM orders WHERE orderId = ?', [req.params.id]);
        if (order.length === 0) return res.status(404).json({ error: 'Order not found' });
        res.json(await mapOrder(order[0]));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const createOrder = async (req, res) => {
    const { tableId, tableNumber, customerName, type, items, totalAmount, notes, waiterId, waiterName } = req.body;
    if (!customerName || !type || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'customerName, type, and at least one item are required' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [orderResult] = await connection.query(
            'INSERT INTO orders (tableId, tableNumber, customerName, waiterId, waiterName, type, status, orderDate, totalAmount, notes) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)',
            [tableId || null, tableNumber || null, customerName, waiterId || null, waiterName || null, type, 'pending', totalAmount, notes || null]
        );
        const orderId = orderResult.insertId;

        for (let item of items) {
            const quantity = Number(item.quantity) || 1;
            const unitPrice = Number(item.unitPrice ?? item.price) || 0;
            await connection.query(
                'INSERT INTO order_items (orderId, itemId, itemName, quantity, unitPrice, subTotal, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    orderId,
                    item.itemId,
                    item.itemName || item.name,
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
    const { tableId, tableNumber, customerName, type, totalAmount, notes } = req.body;
    try {
        await pool.query(
            'UPDATE orders SET tableId=?, tableNumber=?, customerName=?, type=?, totalAmount=?, notes=? WHERE orderId=?',
            [tableId, tableNumber, customerName, type, totalAmount, notes, id]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateOrderStatus = async (req, res) => {
    try {
        await pool.query('UPDATE orders SET status=? WHERE orderId=?', [req.body.status, req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const assignOrder = async (req, res) => {
    const { waiterId, waiterName, status } = req.body;
    try {
        await pool.query(
            'UPDATE orders SET waiterId=?, waiterName=?, status=COALESCE(?, status) WHERE orderId=?',
            [waiterId || null, waiterName || null, status || null, req.params.id]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteOrder = async (req, res) => {
    try {
        await pool.query('DELETE FROM orders WHERE orderId=?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const addOrderItem = async (req, res) => {
    const { itemId, itemName, name, quantity = 1, unitPrice, price, notes } = req.body;
    const parsedQuantity = Number(quantity) || 1;
    const parsedPrice = Number(unitPrice ?? price) || 0;

    try {
        const [result] = await pool.query(
            'INSERT INTO order_items (orderId, itemId, itemName, quantity, unitPrice, subTotal, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.params.id, itemId, itemName || name, parsedQuantity, parsedPrice, parsedPrice * parsedQuantity, notes || null]
        );
        res.json({ success: true, orderItemId: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const removeOrderItem = async (req, res) => {
    try {
        await pool.query('DELETE FROM order_items WHERE orderId=? AND orderItemId=?', [req.params.id, req.params.itemId]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getOrderStats = async (req, res) => {
    try {
        const stats = await queryDB(`
            SELECT
                COUNT(*) AS totalOrders,
                SUM(CASE WHEN status NOT IN ('paid', 'cancelled') THEN 1 ELSE 0 END) AS activeOrders,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingOrders,
                SUM(CASE WHEN status = 'served' THEN 1 ELSE 0 END) AS servedOrders,
                COALESCE(SUM(totalAmount), 0) AS totalRevenue,
                COALESCE(AVG(totalAmount), 0) AS averageOrderValue
            FROM orders
            WHERE (? IS NULL OR DATE(orderDate) >= ?)
              AND (? IS NULL OR DATE(orderDate) <= ?)
        `, [
            req.query.startDate || null,
            req.query.startDate || null,
            req.query.endDate || null,
            req.query.endDate || null,
        ]);
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
