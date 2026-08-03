const asyncHandler = require('express-async-handler');
const Joi = require('joi');
const s = require('../storage/eventsStorage');

const eventSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().allow('').optional(),
  categoryId: Joi.number().integer().required(),
  images: Joi.array().items(Joi.object({
    // ✅ Разрешаем как полные URI, так и относительные пути (начинающиеся с /)
    url: Joi.string().required(),
    alt_text: Joi.string().allow(''),
    order: Joi.number().integer().min(0)
  })).optional()
});

const categorySchema = Joi.object({
  header: Joi.string().max(255).optional(),
  description: Joi.string().allow('').optional()
});

exports.getAllCategories = asyncHandler(async (_req, res) => {
  const cats = await s.getAllCategories();
  res.json(cats);
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const v = await categorySchema.validateAsync(req.body);
  const cat = await s.updateCategory(req.params.id, v);
  if (!cat) return res.sendStatus(404);
  res.json(cat);
});

exports.getAllEvents = asyncHandler(async (req, res) => {
  const events = await s.getAllEvents({ categoryId: req.query.categoryId });
  res.json(events);
});

exports.getEventById = asyncHandler(async (req, res) => {
  const ev = await s.getEventById(req.params.id);
  if (!ev) return res.sendStatus(404);
  res.json(ev);
});

exports.createEvent = asyncHandler(async (req, res) => {
  const v = await eventSchema.validateAsync(req.body);
  const ev = await s.createEvent(v);
  res.status(201).json(await s.getEventById(ev.id));
});

exports.updateEvent = asyncHandler(async (req, res) => {
  const v = await eventSchema.fork(['title','categoryId'], (schema) => schema.optional()).validateAsync(req.body);
  const ev = await s.updateEvent(req.params.id, v);
  if (!ev) return res.sendStatus(404);
  res.json(await s.getEventById(ev.id));
});

exports.deleteEvent = asyncHandler(async (req, res) => {
  const count = await s.deleteEvent(req.params.id);
  if (!count) return res.sendStatus(404);
  res.json({ ok: true });
});

