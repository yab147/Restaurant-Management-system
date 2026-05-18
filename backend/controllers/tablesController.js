import { pool, queryDB } from '../db/index.js';

export const getTables = async (req, res) => {
    try {
        const tables = await queryDB('SELECT * FROM restaurant_tables ORDER BY number ASC');
        res.json(tables);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getTableById = async (req, res) => {
    try {
        const table = await queryDB('SELECT * FROM restaurant_tables WHERE tableId = ?', [req.params.id]);
        if (table.length === 0) return res.status(404).json({ error: 'Table not found' });
        res.json(table[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const createTable = async (req, res) => {
    const { number, capacity, status } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO restaurant_tables (number, capacity, status) VALUES (?, ?, ?)',
            [number, capacity, status || 'available']
        );
        res.json({ success: true, tableId: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateTable = async (req, res) => {
    const { id } = req.params;
    const { number, capacity, status } = req.body;
    try {
        await pool.query(
            'UPDATE restaurant_tables SET number=?, capacity=?, status=? WHERE tableId=?',
            [number, capacity, status, id]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteTable = async (req, res) => {
    try {
        await pool.query('DELETE FROM restaurant_tables WHERE tableId=?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateTableStatus = async (req, res) => {
    try {
        await pool.query('UPDATE restaurant_tables SET status=? WHERE tableId=?', [req.body.status, req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};
