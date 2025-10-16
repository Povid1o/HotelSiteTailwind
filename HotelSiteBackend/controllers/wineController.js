const asyncHandler = require('express-async-handler');
const Joi = require('joi');
const path = require('path');
const fs = require('fs');
const sequelize = require('../db');
const { WineType, WineSweetness, Wine, WineDescription, WineImage } = require('../models/models');

const wineSchema = Joi.object({
  type_id: Joi.number().integer().required(),
  sweetness_id: Joi.number().integer().required(),
  name: Joi.string().max(255).required(),
  year: Joi.number().integer().allow(null),
  alcohol: Joi.string().max(50).allow('', null),
  sugar: Joi.string().max(50).allow('', null),
  temperature: Joi.string().max(50).allow('', null),
  price: Joi.number().precision(2).required(),
  is_active: Joi.boolean().default(true),
  description: Joi.array().items(Joi.string().required()).default([]),
  images: Joi.array().items(Joi.object({ url: Joi.string().required(), alt_text: Joi.string().allow('', null), order: Joi.number().integer() })).default([])
});

exports.tree = asyncHandler(async (req, res) => {
  const [types, sweetnesses, wines] = await Promise.all([
    WineType.findAll(),
    WineSweetness.findAll(),
    Wine.findAll({ include: [{ model: WineDescription, as: 'description' }, { model: WineImage, as: 'images' }] })
  ]);

  const byType = types.map(t => ({ id: t.id, name: t.name, assortment: [] }));
  byType.forEach(bt => {
    sweetnesses.forEach(sw => {
      const grouped = wines.filter(w => w.type_id === bt.id && w.sweetness_id === sw.id);
      bt.assortment.push({ id: sw.id, name: sw.name, wines: grouped });
    });
  });

  res.json(byType);
});

exports.create = asyncHandler(async (req, res) => {
  const v = await wineSchema.validateAsync({
    ...req.body,
    type_id: Number(req.body.type_id),
    sweetness_id: Number(req.body.sweetness_id)
  });

  const [type, sweet] = await Promise.all([
    WineType.findByPk(v.type_id),
    WineSweetness.findByPk(v.sweetness_id)
  ]);
  if (!type || !sweet) return res.status(400).json({ message: 'Invalid type_id or sweetness_id' });

  const wine = await Wine.create({ ...v });
  if (v.description?.length)
    await WineDescription.bulkCreate(v.description.map((text, idx) => ({ wine_id: wine.id, description_text: text, order: idx + 1 })));
  if (v.images?.length)
    await WineImage.bulkCreate(v.images.map(i => ({ ...i, wine_id: wine.id })));

  const withIncludes = await Wine.findByPk(wine.id, { include: ['description','images','type','sweetness'] });
  res.status(201).json(withIncludes);
});

exports.update = asyncHandler(async (req, res) => {
  const v = await wineSchema.validateAsync({
    ...req.body,
    type_id: Number(req.body.type_id),
    sweetness_id: Number(req.body.sweetness_id)
  });

  const wine = await Wine.findByPk(req.params.id);
  if (!wine) return res.sendStatus(404);

  const [type, sweet] = await Promise.all([
    WineType.findByPk(v.type_id),
    WineSweetness.findByPk(v.sweetness_id)
  ]);
  if (!type || !sweet) return res.status(400).json({ message: 'Invalid type_id or sweetness_id' });

  await wine.update(v);
  await Promise.all([
    WineDescription.destroy({ where: { wine_id: wine.id } }),
    WineImage.destroy({ where: { wine_id: wine.id } }),
  ]);
  if (v.description?.length)
    await WineDescription.bulkCreate(v.description.map((text, idx) => ({ wine_id: wine.id, description_text: text, order: idx + 1 })));
  if (v.images?.length)
    await WineImage.bulkCreate(v.images.map(i => ({ ...i, wine_id: wine.id })));

  const withIncludes = await Wine.findByPk(wine.id, { include: ['description','images','type','sweetness'] });
  res.json(withIncludes);
});


exports.remove = asyncHandler(async (req, res) => {
  // Use a transaction and explicit child deletion to avoid intermittent FK errors
  await sequelize.transaction(async (t) => {
    const wine = await Wine.findByPk(req.params.id, { include: ['images', 'description'], transaction: t, lock: t.LOCK.UPDATE });
    if (!wine) return res.sendStatus(404);

    // Try unlinking files that live under our static directory; ignore errors
    const staticRoot = path.resolve(__dirname, '..', 'static');
    const images = Array.isArray(wine.images) ? wine.images : [];
    for (const img of images) {
      const url = img?.url || '';
      if (typeof url === 'string' && url.startsWith('/static/')) {
        const rel = url.replace(/^\/static\//, '');
        const filePath = path.resolve(staticRoot, rel);
        if (filePath.startsWith(staticRoot) && fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (_) { /* noop */ }
        }
      }
    }

    await Promise.all([
      WineDescription.destroy({ where: { wine_id: wine.id }, transaction: t }),
      WineImage.destroy({ where: { wine_id: wine.id }, transaction: t }),
    ]);

    await wine.destroy({ transaction: t });
  });
  res.json({ ok: true });
});
