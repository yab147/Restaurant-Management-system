import { queryDB, pool } from '../db/index.js';

export const getReservations = async (req, res) => {
    try {
        const conditions = [];
        const params = [];

        if (req.query.status && req.query.status !== 'all') {
            conditions.push('status = ?');
            params.push(req.query.status);
        }
        if (req.query.search) {
            conditions.push('customerName LIKE ?');
            params.push(`%${req.query.search}%`);
        }
        if (req.query.date) {
            conditions.push('DATE(dateTime) = ?');
            params.push(req.query.date);
        }

        const sql = `SELECT * FROM reservations${conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''} ORDER BY dateTime DESC`;
        const rows = await queryDB(sql, params);
const mapped = rows.map(r => ({
            reservationId: r.reservationId,
            customerName: r.customerName,
            phone: r.phone,
            reservationDate: r.dateTime,
            partySize: r.guests,
            tableId: r.tableId,
            status: r.status,
        }));
        res.json(mapped);
    }
    catch (e) { res.status(500).json({ error: e.message }); }
};

export const getReservationById = async (req, res) => {
    try {
        const rows = await queryDB('SELECT * FROM reservations WHERE reservationId = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Reservation not found' });
        const r = rows[0];
        res.json({
            reservationId: r.reservationId,
            customerName: r.customerName,
            phone: r.phone,
            reservationDate: r.dateTime,
            partySize: r.guests,
            tableId: r.tableId,
            status: r.status,
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const createReservation = async (req, res) => {
    const { customerName, phone, partySize, tableId, reservationDate, notes } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO reservations (customerName, phone, dateTime, guests, tableId, status) VALUES (?, ?, ?, ?, ?, ?)',
            [customerName, phone, reservationDate, Number(partySize) || 1, tableId || null, 'pending']
        );
        const [[created]] = await pool.query('SELECT * FROM reservations WHERE reservationId = ?', [result.insertId]);
        res.json({
            success: true, reservation: {
                reservationId: created.reservationId,
                customerName: created.customerName,
                phone: created.phone,
                reservationDate: created.dateTime,
                partySize: created.guests,
                tableId: created.tableId,
                status: created.status,
            }
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateReservation = async (req, res) => {
    const id = req.params.id;
    const { customerName, phone, partySize, tableId, reservationDate, status } = req.body;
    try {
        await pool.query(
            'UPDATE reservations SET customerName=?, phone=?, dateTime=?, guests=?, tableId=?, status=? WHERE reservationId=?',
            [customerName, phone, reservationDate, Number(partySize) || 1, tableId || null, status || 'pending', id]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const cancelReservation = async (req, res) => {
    try {
        await pool.query('UPDATE reservations SET status = ? WHERE reservationId = ?', ['cancelled', req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const confirmReservation = async (req, res) => {
    try {
        await pool.query('UPDATE reservations SET status = ? WHERE reservationId = ?', ['confirmed', req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};
