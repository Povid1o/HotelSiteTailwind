// controllers/wineTypeController.js
const { WineType } = require('../models/models');

exports.list = async (req, res) => {
    const rows = await WineType.findAll({ order: [['id', 'ASC']] });
    res.json(rows);
};

exports.create = async (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'name is required' });
    const row = await WineType.create({ name: name.trim() });
    res.status(201).json(row);
};

exports.remove = async (req, res) => {
    const { id } = req.params;
    const row = await WineType.findByPk(id);
    if (!row) return res.sendStatus(404);
    await row.destroy();
    res.json({ ok: true });
};
