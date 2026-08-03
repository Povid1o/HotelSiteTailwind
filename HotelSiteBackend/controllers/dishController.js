const asyncHandler = require('express-async-handler');
const Joi = require('joi');
const path = require('path');
const fs = require('fs');
const sequelize = require('../db');
const { DishCategory, Dish, DishImage } = require('../models/models');

const dishSchema = Joi.object({
  category_id: Joi.number().integer().required(),
  name: Joi.string().max(255).required(),
  header: Joi.string().max(255).allow(null, ''),
  description_short: Joi.string().allow(null, ''),
  description_full: Joi.string().allow(null, ''),
  weight: Joi.string().max(50).allow(null, ''),
  price: Joi.number().precision(2).required(),
  nutrients: Joi.alternatives(Joi.object(), Joi.string().allow('')).allow(null),
  is_active: Joi.boolean().default(true),
  images: Joi.array().items(Joi.object({ url: Joi.string().required(), alt_text: Joi.string().allow('', null), order: Joi.number().integer() })).default([])
});

// Updates must distinguish an omitted images field from an explicit empty list.
// The latter means "remove all images"; the former means "leave images intact".
const dishUpdateSchema = dishSchema.keys({
  images: Joi.array().items(Joi.object({ url: Joi.string().required(), alt_text: Joi.string().allow('', null), order: Joi.number().integer() })).optional()
});

const normalizeNutrients = (n) => {
  if (n === null || n === undefined || n === '') return null;
  if (typeof n === 'object') return n;
  if (typeof n === 'string') {
    const s = n.trim();
    try { return JSON.parse(s); } catch { return { text: s }; }
  }
  return null;
};

exports.list = asyncHandler(async (req, res) => {
  const categories = await DishCategory.findAll({
    include: [{ model: Dish, as: 'products', include: [{ model: DishImage, as: 'images' }] }],
    order: [
      [{ model: Dish, as: 'products' }, 'id', 'ASC'],
      [{ model: Dish, as: 'products' }, { model: DishImage, as: 'images' }, 'order', 'ASC']
    ]
  });
  res.json(categories);
});

exports.create = asyncHandler(async (req, res) => {
  const value = await dishSchema.validateAsync(req.body);
  const payload = { ...value, nutrients: normalizeNutrients(value.nutrients) };
  const dish = await Dish.create(payload, { include: [{ model: DishImage, as: 'images' }] });
  res.status(201).json(dish);
});

exports.get = asyncHandler(async (req, res) => {
  const dish = await Dish.findByPk(req.params.id, { include: [{ model: DishImage, as: 'images' }, { model: DishCategory, as: 'category' }] });
  if (!dish) return res.sendStatus(404);
  res.json(dish);
});

exports.update = asyncHandler(async (req, res) => {
  const value = await dishUpdateSchema.validateAsync(req.body);
  const dish = await Dish.findByPk(req.params.id);
  if (!dish) return res.sendStatus(404);
  const payload = { ...value, nutrients: normalizeNutrients(value.nutrients) };
  await dish.update(payload);
  if (value.images !== undefined) {
    await DishImage.destroy({ where: { dish_id: dish.id } });
    if (value.images.length) {
      await DishImage.bulkCreate(value.images.map(i => ({ ...i, dish_id: dish.id })));
    }
  }
  const withIncludes = await Dish.findByPk(dish.id, { include: [{ model: DishImage, as: 'images' }] });
  res.json(withIncludes);
});

exports.remove = asyncHandler(async (req, res) => {
  const dish = await Dish.findByPk(req.params.id);
  if (!dish) return res.sendStatus(404);
  
  await dish.destroy();
  res.json({ ok: true });
});
