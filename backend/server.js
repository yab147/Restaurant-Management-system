import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ensureSchema, pool } from './db/index.js';
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import menuCategoriesRoutes from './routes/menuCategories.js';
import ordersRoutes from './routes/orders.js';
import reservationsRoutes from './routes/reservations.js';
import tablesRoutes from './routes/tables.js';
import ingredientsRoutes from './routes/ingredients.js';
import usersRoutes from './routes/users.js';
import paymentsRoutes from './routes/payments.js';
import reportsRoutes from './routes/reports.js';
import notificationsRoutes from './routes/notifications.js';
import publicRoutes from './routes/public.js';
import { authenticate } from './middleware/authMiddleware.js';
import { requirePaymentAccess } from './middleware/roleMiddleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to Railway MySQL');
    connection.release();
    await ensureSchema();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
})();

// Public auth + catalog (landing page)
app.use('/api', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);

// Protected API (JWT required)
app.use('/api/menu', authenticate, menuRoutes);
app.use('/api/menu-categories', authenticate, menuCategoriesRoutes);
app.use('/api/orders', authenticate, ordersRoutes);
app.use('/api/reservations', authenticate, reservationsRoutes);
app.use('/api/tables', authenticate, tablesRoutes);
app.use('/api/ingredients', authenticate, ingredientsRoutes);
app.use('/api/users', authenticate, usersRoutes);
app.use('/api/payments', authenticate, requirePaymentAccess, paymentsRoutes);
app.use('/api/reports', authenticate, reportsRoutes);
app.use('/api/notifications', authenticate, notificationsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
