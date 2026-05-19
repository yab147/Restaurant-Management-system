import { pool, queryDB } from '../db/index.js';

const mapMenuItem = (item) => ({
    ...item,
    price: Number(item.price) || 0,
    availability: Boolean(item.availability),
    isPopular: Boolean(item.isPopular),
    isSpicy: Boolean(item.isSpicy),
    imageUrl: item.imageUrl || item.image || null,
});

const MAX_IMAGE_PAYLOAD = 600_000; // ~600k chars for data URLs / long URLs

export const getMenu = async (req, res) => {
    try {
        const rows = await queryDB('SELECT * FROM menu_items ORDER BY name ASC');
        res.json(rows.map(mapMenuItem));
    }
    catch (e) { res.status(500).json({ error: e.message }); }
};

export const getMenuItemById = async (req, res) => {
    try {
        const rows = await queryDB('SELECT * FROM menu_items WHERE itemId = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Menu item not found' });
        res.json(mapMenuItem(rows[0]));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const addMenuItem = async (req, res) => {
    const { categoryId, name, description, price, availability, prepTime, isSpicy, isPopular } = req.body;
    const image = req.body.image ?? req.body.imageUrl ?? null;
    const imageUrl = req.body.imageUrl ?? req.body.image ?? null;
    const imgStr = String(imageUrl || '');
    if (imgStr.length > MAX_IMAGE_PAYLOAD) {
        return res.status(400).json({ error: 'Image is too large. Use a smaller file or a hosted image URL.' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO menu_items (categoryId, name, description, price, availability, image, prepTime, isPopular, isSpicy, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                Number(categoryId),
                name,
                description || null,
                Number(price) || 0,
                availability === undefined ? 1 : Number(Boolean(availability)),
                image,
                prepTime || null,
                Number(Boolean(isPopular)),
                Number(Boolean(isSpicy)),
                imageUrl,
            ]
        );
        res.json({ success: true, itemId: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateMenuItem = async (req, res) => {
    const { id } = req.params;
    const { categoryId, name, description, price, availability, prepTime, isSpicy, isPopular } = req.body;
    const image = req.body.image ?? req.body.imageUrl ?? null;
    const imageUrl = req.body.imageUrl ?? req.body.image ?? null;
    const imgStr = String(imageUrl || '');
    if (imgStr.length > MAX_IMAGE_PAYLOAD) {
        return res.status(400).json({ error: 'Image is too large. Use a smaller file or a hosted image URL.' });
    }
    try {
        await pool.query(
            'UPDATE menu_items SET categoryId=?, name=?, description=?, price=?, availability=?, image=?, prepTime=?, isPopular=?, isSpicy=?, imageUrl=? WHERE itemId=?',
            [
                Number(categoryId),
                name,
                description || null,
                Number(price) || 0,
                availability === undefined ? 1 : Number(Boolean(availability)),
                image,
                prepTime || null,
                Number(Boolean(isPopular)),
                Number(Boolean(isSpicy)),
                imageUrl,
                id,
            ]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateMenuAvailability = async (req, res) => {
    try {
        await pool.query(
            'UPDATE menu_items SET availability=? WHERE itemId=?',
            [Number(Boolean(req.body.availability)), req.params.id]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteMenuItem = async (req, res) => {
    try {
        await pool.query('DELETE FROM menu_items WHERE itemId=?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getMenuCategories = async (req, res) => {
    try { res.json(await queryDB('SELECT * FROM menu_categories ORDER BY name ASC')); }
    catch (e) { res.status(500).json({ error: e.message }); }
};

export const addMenuCategory = async (req, res) => {
    const { name, description, icon } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO menu_categories (name, description, icon) VALUES (?, ?, ?)',
            [name, description, icon]
        );
        res.json({ success: true, categoryId: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
};
