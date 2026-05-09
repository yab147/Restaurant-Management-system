import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

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
      res.json({ success: true, user: rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
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
    const orders = await queryDB('SELECT * FROM orders ORDER BY orderDate DESC');
    for (let order of orders) {
      order.items = await queryDB('SELECT * FROM order_items WHERE orderId = ?', [order.orderId]);
    }
    res.json(orders);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Add new order
app.post('/api/orders', async (req, res) => {
  const { tableId, tableNumber, customerName, type, items, totalAmount, notes } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      'INSERT INTO orders (tableId, tableNumber, customerName, type, status, orderDate, totalAmount, notes) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)',
      [tableId || null, tableNumber || null, customerName, type, 'pending', totalAmount, notes || null]
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

// Get reservations
app.get('/api/reservations', async (req, res) => {
  try { res.json(await queryDB('SELECT * FROM reservations')); }
  catch (e) { res.status(500).json({ error: e.message }); }
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
