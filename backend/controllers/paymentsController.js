import { pool, queryDB } from '../db/index.js';

const mapPayment = (payment) => ({
    ...payment,
    amount: Number(payment.amount) || 0,
});

export const getPayments = async (req, res) => {
    try {
        const payments = await queryDB('SELECT * FROM payments ORDER BY paymentDate DESC');
        res.json(payments.map(mapPayment));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getPaymentById = async (req, res) => {
    try {
        const payment = await queryDB('SELECT * FROM payments WHERE paymentId = ?', [req.params.id]);
        if (payment.length === 0) return res.status(404).json({ error: 'Payment not found' });
        res.json(mapPayment(payment[0]));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const processPayment = async (req, res) => {
    const { orderId, amount, method } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO payments (orderId, amount, method, status, paymentDate, transactionId) VALUES (?, ?, ?, ?, NOW(), ?)',
            [orderId, amount, method, 'completed', `TXN-${Date.now()}`]
        );
        res.json({ success: true, paymentId: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const refundPayment = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(
            'UPDATE payments SET status=? WHERE paymentId=?',
            ['refunded', id]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getPaymentStats = async (req, res) => {
    try {
        const stats = await queryDB(`
      SELECT 
        COUNT(*) as totalPayments,
        COALESCE(SUM(amount), 0) as totalAmount,
        COALESCE(AVG(amount), 0) as avgAmount
      FROM payments
      WHERE status = 'completed'
    `);
        const row = stats[0] || {};
        res.json({
            ...row,
            totalAmount: Number(row.totalAmount) || 0,
            avgAmount: Number(row.avgAmount) || 0,
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
};
