// controllers/dishCategoryController.js
const { DishCategory } = require('../models/models');

exports.list = async (req, res) => {
    const rows = await DishCategory.findAll({ order: [['id', 'ASC']] });
    res.json(rows);
};

exports.create = async (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'name is required' });
    const row = await DishCategory.create({ name: name.trim() });
    res.status(201).json(row);
};

exports.update = async (req, res) => {
    const { id } = req.params; // может быть id или имя
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'name is required' });

    // пробуем найти по числовому id, иначе по имени
    const where = Number.isFinite(Number(id)) ? { id: Number(id) } : { name: id };
    const row = await DishCategory.findOne({ where });
    if (!row) return res.sendStatus(404);
    await row.update({ name: name.trim() });
    res.json(row);
};

exports.remove = async (req, res) => {
    const { id } = req.params; // может быть id или имя
    const where = Number.isFinite(Number(id)) ? { id: Number(id) } : { name: id };
    const row = await DishCategory.findOne({ where });
    if (!row) return res.sendStatus(404);
    await row.destroy();
    res.json({ ok: true });
};
