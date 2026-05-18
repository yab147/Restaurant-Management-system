import { pool, queryDB } from '../db/index.js';

export const getUsers = async (req, res) => {
    try {
        const users = await queryDB('SELECT userId, name, email, phone, role, avatar FROM users');
        res.json(users);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getUserById = async (req, res) => {
    try {
        const user = await queryDB('SELECT userId, name, email, phone, role, avatar FROM users WHERE userId = ?', [req.params.id]);
        if (user.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(user[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const createUser = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, phone, role, avatar) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, password, phone || '', role || 'customer', null]
        );
        res.json({ success: true, userId: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, role, avatar } = req.body;
    try {
        await pool.query(
            'UPDATE users SET name=?, email=?, phone=?, role=?, avatar=? WHERE userId=?',
            [name, email, phone, role, avatar, id]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteUser = async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE userId=?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const changeUserRole = async (req, res) => {
    try {
        await pool.query('UPDATE users SET role=? WHERE userId=?', [req.body.role, req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};
