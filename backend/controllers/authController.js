import jwt from 'jsonwebtoken';
import { queryDB, pool } from '../db/index.js';

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const rows = await queryDB('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (rows.length > 0) {
            const user = rows[0];
            const accessToken = jwt.sign(
                { userId: user.userId, email: user.email, role: user.role, name: user.name },
                process.env.JWT_SECRET || 'secret123',
                { expiresIn: '1h' },
            );
            const refreshToken = jwt.sign(
                { userId: user.userId, email: user.email, role: user.role, name: user.name },
                process.env.JWT_REFRESH_SECRET || 'refreshSecret123',
                { expiresIn: '7d' },
            );
            const { password: _pw, ...safeUser } = user;
            return res.json({ success: true, user: safeUser, accessToken, refreshToken });
        }
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const refresh = (req, res) => {
    const token = req.body.token || req.body.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'Refresh token required' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refreshSecret123');
        const accessToken = jwt.sign(
            { userId: decoded.userId, email: decoded.email, role: decoded.role, name: decoded.name },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '1h' },
        );
        res.json({ success: true, accessToken });
    } catch (err) {
        res.status(403).json({ success: false, message: 'Invalid refresh token' });
    }
};

export const signup = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        const existing = await queryDB('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email already exists' });

        await pool.query('INSERT INTO users (name, email, password, phone, role, avatar) VALUES (?, ?, ?, ?, ?, ?)', [name, email, password, phone || '', 'customer', null]);
        res.json({ success: true, message: 'Signup successful' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });
        const rows = await queryDB('SELECT userId, name, email, phone, role, avatar FROM users WHERE userId = ?', [userId]);
        if (rows.length > 0) {
            return res.json({ success: true, user: rows[0] });
        }
        return res.status(404).json({ success: false, message: 'User not found' });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
