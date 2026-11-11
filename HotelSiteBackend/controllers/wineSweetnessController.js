// controllers/wineSweetnessController.js
const { WineSweetness } = require('../models/models');
const asyncHandler = require('express-async-handler');

exports.list = async (req, res) => {
    const rows = await WineSweetness.findAll({ order: [['id', 'ASC']] });
    res.json(rows);
};

exports.create = async (req, res) => {
    const { name } = req.body;
    if (typeof name !== 'string' || !name.trim() || name.length > 255) return res.status(400).json({ message: 'name is required' });
    const row = await WineSweetness.create({ name: name.trim() });
    res.status(201).json(row);
};

exports.remove = async (req, res) => {
    const { id } = req.params;
    const row = await WineSweetness.findByPk(id);
    if (!row) return res.sendStatus(404);
    await row.destroy();
    res.json({ ok: true });
};

for (const key of Object.keys(exports)) exports[key] = asyncHandler(exports[key]);
