const asyncHandler = require('express-async-handler');
const Joi = require('joi');
const { Page } = require('../models/models');

const pageSchema = Joi.object({
  name: Joi.string().max(255).required(),
  path: Joi.string().max(255).required(),
  is_active: Joi.boolean().default(true),
  content_json: Joi.object().default({})
});

const pageSectionSchema = Joi.object({
  section: Joi.string().max(100).required(),
  data: Joi.object().required()
});

const toJsonObject = (x) => {
  if (x && typeof x === 'string') {
    try { return JSON.parse(x); } catch { return {}; }
  }
  return x || {};
};

exports.list = asyncHandler(async (req, res) => {
  const pages = await Page.findAll();
  res.json(pages);
});

exports.create = asyncHandler(async (req, res) => {
  const v = await pageSchema.validateAsync({
    ...req.body,
    content_json: toJsonObject(req.body.content_json)
  });
  const p = await Page.create(v);
  res.status(201).json(p);
});


exports.get = asyncHandler(async (req, res) => {
  const p = await Page.findByPk(req.params.id);
  if (!p) return res.sendStatus(404);
  res.json(p);
});

exports.update = asyncHandler(async (req, res) => {
  let p = null;
  // allow update by id or name
  if (!Number.isNaN(Number(req.params.id))) {
    p = await Page.findByPk(req.params.id);
  } else {
    p = await Page.findOne({ where: { name: req.params.id } });
  }
  if (!p) return res.sendStatus(404);
  // keep existing fields if missing
  const payload = {
    name: req.body.name ?? p.name,
    path: req.body.path ?? p.path,
    is_active: typeof req.body.is_active === 'boolean' ? req.body.is_active : p.is_active,
    content_json: toJsonObject(req.body.content_json || req.body.content || p.content_json)
  }
  const v = await pageSchema.validateAsync(payload);
  await p.update(v);
  res.json(p);
});

// Update a single content section.  Replacing the complete JSON document from
// each editor caused concurrent saves to overwrite one another.
exports.updateSection = asyncHandler(async (req, res) => {
  const p = await Page.findByPk(req.params.id);
  if (!p) return res.sendStatus(404);

  const { section, data } = await pageSectionSchema.validateAsync(req.body);
  const content = toJsonObject(p.content_json);
  await p.update({ content_json: { ...content, [section]: data } });
  res.json(p);
});

exports.toggleActive = asyncHandler(async (req, res) => {
  let p = null;
  if (!Number.isNaN(Number(req.params.id))) {
    p = await Page.findByPk(req.params.id);
  } else {
    p = await Page.findOne({ where: { name: req.params.id } });
  }
  if (!p) return res.sendStatus(404);
  p.is_active = !p.is_active;
  await p.save();
  res.json(p);
});


exports.remove = asyncHandler(async (req, res) => {
  const p = await Page.findByPk(req.params.id);
  if (!p) return res.sendStatus(404);
  await p.destroy();
  res.json({ ok: true });
});
