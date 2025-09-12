const asyncHandler = require('express-async-handler');
const Joi = require('joi');
const { Page } = require('../models/models');

const pageSchema = Joi.object({
  name: Joi.string().max(255).required(),
  path: Joi.string().max(255).required(),
  is_active: Joi.boolean().default(true),
  content_json: Joi.object().default({})
});

exports.list = asyncHandler(async (req, res) => {
  const pages = await Page.findAll();
  res.json(pages);
});

exports.create = asyncHandler(async (req, res) => {
  const v = await pageSchema.validateAsync(req.body);
  const p = await Page.create(v);
  res.status(201).json(p);
});

exports.get = asyncHandler(async (req, res) => {
  const p = await Page.findByPk(req.params.id);
  if (!p) return res.sendStatus(404);
  res.json(p);
});

exports.update = asyncHandler(async (req, res) => {
  const v = await pageSchema.validateAsync(req.body);
  const p = await Page.findByPk(req.params.id);
  if (!p) return res.sendStatus(404);
  await p.update(v);
  res.json(p);
});

exports.remove = asyncHandler(async (req, res) => {
  const p = await Page.findByPk(req.params.id);
  if (!p) return res.sendStatus(404);
  await p.destroy();
  res.json({ ok: true });
});
