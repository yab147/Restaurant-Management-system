import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const queryDB = async (sql, params = []) => {
    const [rows] = await pool.query(sql, params);
    return rows;
};

const ensureSchema = async () => {
    const [columns] = await pool.query('SHOW COLUMNS FROM menu_items LIKE ?', ['imageUrl']);
    if (columns[0]?.Type?.toLowerCase() !== 'mediumtext') {
        await pool.query('ALTER TABLE menu_items MODIFY imageUrl MEDIUMTEXT DEFAULT NULL');
    }
};

export { pool, queryDB, ensureSchema };
