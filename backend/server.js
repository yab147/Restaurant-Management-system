import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db/index.js';
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

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to Railway MySQL');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
})();

// Mount modular routes
app.use('/api', authRoutes);  // /login, /signup, /refresh, /me
app.use('/api/auth', authRoutes);  // /auth/login, /auth/signup, /auth/refresh, /auth/me
app.use('/api/menu', menuRoutes);
app.use('/api/menu-categories', menuCategoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/tables', tablesRoutes);
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/reports', reportsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
