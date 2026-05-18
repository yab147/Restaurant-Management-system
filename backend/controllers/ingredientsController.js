import { pool, queryDB } from '../db/index.js';

const mapIngredient = (ingredient) => ({
    ...ingredient,
    reorderLevel: ingredient.threshold,
    costPerUnit: ingredient.costPerUnit ?? 0,
});

export const getIngredients = async (req, res) => {
    try {
        const ingredients = await queryDB('SELECT * FROM ingredients ORDER BY name ASC');
        res.json(ingredients.map(mapIngredient));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getIngredientById = async (req, res) => {
    try {
        const ingredient = await queryDB('SELECT * FROM ingredients WHERE ingredientId = ?', [req.params.id]);
        if (ingredient.length === 0) return res.status(404).json({ error: 'Ingredient not found' });
        res.json(mapIngredient(ingredient[0]));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const createIngredient = async (req, res) => {
    const { name, quantity, unit } = req.body;
    const threshold = req.body.threshold ?? req.body.reorderLevel;
    try {
        const [result] = await pool.query(
            'INSERT INTO ingredients (name, quantity, unit, threshold) VALUES (?, ?, ?, ?)',
            [name, Number(quantity) || 0, unit, Number(threshold) || 0]
        );
        res.json({ success: true, ingredientId: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateIngredient = async (req, res) => {
    const { id } = req.params;
    const { name, quantity, unit } = req.body;
    const threshold = req.body.threshold ?? req.body.reorderLevel;
    try {
        await pool.query(
            'UPDATE ingredients SET name=?, quantity=?, unit=?, threshold=? WHERE ingredientId=?',
            [name, Number(quantity) || 0, unit, Number(threshold) || 0, id]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deleteIngredient = async (req, res) => {
    try {
        await pool.query('DELETE FROM ingredients WHERE ingredientId=?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getLowStockIngredients = async (req, res) => {
    try {
        const lowStock = await queryDB('SELECT * FROM ingredients WHERE quantity <= threshold');
        res.json(lowStock.map(mapIngredient));
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const restockIngredient = async (req, res) => {
    const amount = Number(req.body.amount) || 0;
    if (amount <= 0) return res.status(400).json({ error: 'Restock amount must be greater than zero' });

    try {
        await pool.query('UPDATE ingredients SET quantity = quantity + ? WHERE ingredientId = ?', [amount, req.params.id]);
        const updated = await queryDB('SELECT * FROM ingredients WHERE ingredientId = ?', [req.params.id]);
        if (updated.length === 0) return res.status(404).json({ error: 'Ingredient not found' });
        res.json({ success: true, ingredient: mapIngredient(updated[0]) });
    } catch (e) { res.status(500).json({ error: e.message }); }
};
