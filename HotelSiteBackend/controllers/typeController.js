const { Type } = require('../models/models');

class TypeController {
  async create(req, res) {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'name is required' });
    const type = await Type.create({ name: name.trim() });
    return res.json(type);
  }
  async getAll(req, res) {
    const types = await Type.findAll();
    return res.json(types);
  }
}
module.exports = new TypeController();
