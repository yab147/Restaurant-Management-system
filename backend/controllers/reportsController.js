import { queryDB } from '../db/index.js';

const dateRangeParams = (query) => [
    query.startDate || null,
    query.startDate || null,
    query.endDate || null,
    query.endDate || null,
];

const mapSalesRow = (row) => ({
    ...row,
    orders: Number(row.orders) || 0,
    revenue: Number(row.revenue) || 0,
});

const mapTopItemRow = (row) => ({
    ...row,
    totalSold: Number(row.totalSold) || 0,
    revenue: Number(row.revenue) || 0,
});

const mapDashboardTotals = (row = {}) => Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, typeof value === 'number' ? value : Number(value) || 0])
);

export const getSalesSummary = async (req, res) => {
    try {
        const rows = await queryDB(`
            SELECT
                DATE(orderDate) AS date,
                COUNT(*) AS orders,
                COALESCE(SUM(totalAmount), 0) AS revenue
            FROM orders
            WHERE status <> 'cancelled'
              AND (? IS NULL OR DATE(orderDate) >= ?)
              AND (? IS NULL OR DATE(orderDate) <= ?)
            GROUP BY DATE(orderDate)
            ORDER BY DATE(orderDate) ASC
        `, dateRangeParams(req.query));
        res.json(rows.map(mapSalesRow));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getTopItems = async (req, res) => {
    try {
        const rows = await queryDB(`
            SELECT
                oi.itemId,
                oi.itemName AS name,
                SUM(oi.quantity) AS totalSold,
                COALESCE(SUM(oi.subTotal), 0) AS revenue
            FROM order_items oi
            JOIN orders o ON o.orderId = oi.orderId
            WHERE o.status <> 'cancelled'
              AND (? IS NULL OR DATE(o.orderDate) >= ?)
              AND (? IS NULL OR DATE(o.orderDate) <= ?)
            GROUP BY oi.itemId, oi.itemName
            ORDER BY totalSold DESC, revenue DESC
            LIMIT 10
        `, dateRangeParams(req.query));
        res.json(rows.map(mapTopItemRow));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getDashboardReport = async (req, res) => {
    try {
        const [sales, topItems, orderTotals, paymentTotals, tableTotals, inventoryTotals] = await Promise.all([
            queryDB(`
                SELECT DATE(orderDate) AS date, COUNT(*) AS orders, COALESCE(SUM(totalAmount), 0) AS revenue
                FROM orders
                WHERE status <> 'cancelled'
                  AND (? IS NULL OR DATE(orderDate) >= ?)
                  AND (? IS NULL OR DATE(orderDate) <= ?)
                GROUP BY DATE(orderDate)
                ORDER BY DATE(orderDate) ASC
            `, dateRangeParams(req.query)),
            queryDB(`
                SELECT oi.itemName AS name, SUM(oi.quantity) AS totalSold, COALESCE(SUM(oi.subTotal), 0) AS revenue
                FROM order_items oi
                JOIN orders o ON o.orderId = oi.orderId
                WHERE o.status <> 'cancelled'
                  AND (? IS NULL OR DATE(o.orderDate) >= ?)
                  AND (? IS NULL OR DATE(o.orderDate) <= ?)
                GROUP BY oi.itemName
                ORDER BY totalSold DESC
                LIMIT 5
            `, dateRangeParams(req.query)),
            queryDB(`
                SELECT
                    COUNT(*) AS totalOrders,
                    COALESCE(SUM(totalAmount), 0) AS totalRevenue,
                    COALESCE(AVG(totalAmount), 0) AS averageOrderValue
                FROM orders
                WHERE status <> 'cancelled'
                  AND (? IS NULL OR DATE(orderDate) >= ?)
                  AND (? IS NULL OR DATE(orderDate) <= ?)
            `, dateRangeParams(req.query)),
            queryDB("SELECT COUNT(*) AS totalPayments, COALESCE(SUM(amount), 0) AS paidAmount FROM payments WHERE status = 'completed'"),
            queryDB("SELECT COUNT(*) AS totalTables, SUM(status = 'available') AS availableTables FROM restaurant_tables"),
            queryDB('SELECT COUNT(*) AS totalIngredients, SUM(quantity <= threshold) AS lowStockIngredients FROM ingredients'),
        ]);

        res.json({
            sales: sales.map(mapSalesRow),
            topItems: topItems.map(mapTopItemRow),
            orders: mapDashboardTotals(orderTotals[0]),
            payments: mapDashboardTotals(paymentTotals[0]),
            tables: mapDashboardTotals(tableTotals[0]),
            inventory: mapDashboardTotals(inventoryTotals[0]),
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const exportReportsCsv = async (req, res) => {
    try {
        const rows = await queryDB(`
            SELECT orderId, customerName, type, status, orderDate, totalAmount
            FROM orders
            WHERE status <> 'cancelled'
              AND (? IS NULL OR DATE(orderDate) >= ?)
              AND (? IS NULL OR DATE(orderDate) <= ?)
            ORDER BY orderDate DESC
        `, dateRangeParams(req.query));

        const header = 'orderId,customerName,type,status,orderDate,totalAmount';
        const csvRows = rows.map((row) => [
            row.orderId,
            `"${String(row.customerName || '').replaceAll('"', '""')}"`,
            row.type,
            row.status,
            row.orderDate instanceof Date ? row.orderDate.toISOString() : row.orderDate,
            row.totalAmount,
        ].join(','));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="restaurant-orders.csv"');
        res.send([header, ...csvRows].join('\n'));
    } catch (e) { res.status(500).json({ error: e.message }); }
};
