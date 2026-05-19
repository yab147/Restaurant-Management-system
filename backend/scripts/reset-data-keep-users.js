/**
 * Clears operational data; keeps users table intact.
 * Run: node backend/scripts/reset-data-keep-users.js
 */
import { pool } from '../db/index.js';

const TABLES = [
  'order_items',
  'payments',
  'orders',
  'reservations',
  'menu_items',
  'menu_categories',
  'ingredients',
  'restaurant_tables',
];

async function main() {
  const connection = await pool.getConnection();
  try {
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const table of TABLES) {
      await connection.query(`TRUNCATE TABLE \`${table}\``);
      console.log(`Truncated ${table}`);
    }
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    await connection.query(
      `INSERT INTO menu_categories (name, description) VALUES ('Main', 'Main dishes')`,
    );
    await connection.query(
      `INSERT INTO restaurant_tables (\`number\`, capacity, status) VALUES
        (1, 4, 'available'), (2, 4, 'available'), (3, 6, 'available'), (4, 2, 'available')`,
    );

    console.log('Done. Users preserved; demo tables and category seeded.');
  } finally {
    connection.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
