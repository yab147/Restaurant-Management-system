import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Create database connection pool
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to Railway MySQL");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();

// Helper for queries
const queryDB = async (sql, params = []) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const rows = await queryDB('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows.length > 0) {
      const user = rows[0];
      const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });
      const refreshToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_REFRESH_SECRET || 'refreshSecret123', { expiresIn: '7d' });
      res.json({ success: true, user, accessToken, refreshToken });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/refresh', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ success: false, message: 'Refresh token required' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refreshSecret123');
    const accessToken = jwt.sign({ id: decoded.id, email: decoded.email, role: decoded.role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });
    res.json({ success: true, accessToken });
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid refresh token' });
  }
});

app.post('/api/signup', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    // Check if user already exists
    const existing = await queryDB('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, phone || '', 'customer']
    );

    res.json({ success: true, message: 'Signup successful' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get all tables
app.get('/api/tables', async (req, res) => {
  try { res.json(await queryDB('SELECT * FROM restaurant_tables')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Get menu items
app.get('/api/menu', async (req, res) => {
  try { res.json(await queryDB('SELECT * FROM menu_items')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Add new menu item
app.post('/api/menu', async (req, res) => {
  const { categoryId, name, description, price, availability, prepTime, isSpicy, image } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO menu_items (categoryId, name, description, price, availability, prepTime, isSpicy, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [categoryId, name, description, price, availability, prepTime, isSpicy, image]
    );
    res.json({ success: true, itemId: result.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Update menu item
app.put('/api/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { categoryId, name, description, price, availability, prepTime, isSpicy, image } = req.body;
  try {
    await pool.query(
      'UPDATE menu_items SET categoryId=?, name=?, description=?, price=?, availability=?, prepTime=?, isSpicy=?, image=? WHERE itemId=?',
      [categoryId, name, description, price, availability, prepTime, isSpicy, image, id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Delete menu item
app.delete('/api/menu/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM menu_items WHERE itemId=?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/menu-categories', async (req, res) => {
  try { res.json(await queryDB('SELECT * FROM menu_categories')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/menu-categories', async (req, res) => {
  const { name, description, icon } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO menu_categories (name, description, icon) VALUES (?, ?, ?)',
      [name, description, icon]
    );
    res.json({ success: true, categoryId: result.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get orders and items
app.get('/api/orders', async (req, res) => {
  try {
    const conditions = [];
    const params = [];

    if (req.query.status && req.query.status !== 'all') {
      conditions.push('status = ?');
      params.push(req.query.status);
    }
    if (req.query.waiterId !== undefined && req.query.waiterId !== null && req.query.waiterId !== '') {
      conditions.push('waiterId = ?');
      params.push(Number(req.query.waiterId));
    }
    if (req.query.unassigned === 'true') {
      conditions.push('waiterId IS NULL');
    }

    const sql = `SELECT * FROM orders${conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''} ORDER BY orderDate DESC`;
    const orders = await queryDB(sql, params);

    for (let order of orders) {
      order.items = await queryDB('SELECT * FROM order_items WHERE orderId = ?', [order.orderId]);
    }
    res.json(orders);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Add new order
app.post('/api/orders', async (req, res) => {
  const { tableId, tableNumber, customerName, type, items, totalAmount, notes, waiterId, waiterName } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      'INSERT INTO orders (tableId, tableNumber, customerName, waiterId, waiterName, type, status, orderDate, totalAmount, notes) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)',
      [tableId || null, tableNumber || null, customerName, waiterId || null, waiterName || null, type, 'pending', totalAmount, notes || null]
    );
    const orderId = orderResult.insertId;

    for (let item of items) {
      await connection.query(
        'INSERT INTO order_items (orderId, itemId, itemName, quantity, unitPrice, subTotal) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.itemId, item.itemName, item.quantity, item.unitPrice, item.subTotal]
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
});

// Update order status
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    await pool.query('UPDATE orders SET status=? WHERE orderId=?', [req.body.status, req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Assign order to waiter
app.put('/api/orders/:id/assign', async (req, res) => {
  const { waiterId, waiterName, status } = req.body;
  try {
    await pool.query(
      'UPDATE orders SET waiterId=?, waiterName=?, status=COALESCE(?, status) WHERE orderId=?',
      [waiterId || null, waiterName || null, status || null, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get reservations
app.get('/api/reservations', async (req, res) => {
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
      // filter by date portion of dateTime
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
});

// Create reservation
app.post('/api/reservations', async (req, res) => {
  const { customerName, phone, partySize, tableId, reservationDate, notes } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO reservations (customerName, phone, dateTime, guests, tableId, status) VALUES (?, ?, ?, ?, ?, ?)',
      [customerName, phone, reservationDate, Number(partySize) || 1, tableId || null, 'pending']
    );
    // return created reservation in frontend-friendly shape
    const [[created]] = await pool.query('SELECT * FROM reservations WHERE reservationId = ?', [result.insertId]);
    res.json({ success: true, reservation: {
      reservationId: created.reservationId,
      customerName: created.customerName,
      phone: created.phone,
      reservationDate: created.dateTime,
      partySize: created.guests,
      tableId: created.tableId,
      status: created.status,
    } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Update reservation
app.put('/api/reservations/:id', async (req, res) => {
  const id = req.params.id;
  const { customerName, phone, partySize, tableId, reservationDate, status } = req.body;
  try {
    await pool.query(
      'UPDATE reservations SET customerName=?, phone=?, dateTime=?, guests=?, tableId=?, status=? WHERE reservationId=?',
      [customerName, phone, reservationDate, Number(partySize) || 1, tableId || null, status || 'pending', id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Cancel reservation
app.patch('/api/reservations/:id/cancel', async (req, res) => {
  try {
    await pool.query('UPDATE reservations SET status = ? WHERE reservationId = ?', ['cancelled', req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Confirm reservation
app.patch('/api/reservations/:id/confirm', async (req, res) => {
  try {
    await pool.query('UPDATE reservations SET status = ? WHERE reservationId = ?', ['confirmed', req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get ingredients
app.get('/api/ingredients', async (req, res) => {
  try { res.json(await queryDB('SELECT * FROM ingredients')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Get payments
app.get('/api/payments', async (req, res) => {
  try { res.json(await queryDB('SELECT * FROM payments')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Get users
app.get('/api/users', async (req, res) => {
  try { res.json(await queryDB('SELECT * FROM users')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
