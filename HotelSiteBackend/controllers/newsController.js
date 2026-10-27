const asyncHandler = require('express-async-handler');
const Joi = require('joi');
const { Op } = require('sequelize');
const { News } = require('../models/models');
const { slugify, uniqueSlug } = require('../utils/slug');
const { sanitizeNewsHtml, textStats } = require('../utils/newsHtml');

const STATUSES = ['draft', 'published'];

// Адрес картинки — только файл из нашего хранилища или внешняя https-ссылка.
const imageUrl = Joi.string().max(500).pattern(/^(\/static\/|https?:\/\/)/);

const newsSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255).required(),
  category: Joi.string().trim().max(50).allow('').default(''),
  excerpt: Joi.string().max(600).allow('').default(''),
  cover_url: imageUrl.allow('', null).default(''),
  cover_alt: Joi.string().max(255).allow('').default(''),
  tags: Joi.array().items(Joi.string().trim().min(1).max(30)).max(10).default([]),
  status: Joi.string().valid(...STATUSES).default('draft'),
  published_at: Joi.date().iso().allow(null),
  seo_title: Joi.string().max(255).allow('').default(''),
  seo_description: Joi.string().max(320).allow('').default(''),
  content_json: Joi.object().unknown(true).default({}),
  content_html: Joi.string().max(600000).allow('').default('')
});

const toNumber = (value, fallback, min, max) => {
  const n = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
};

const isScheduled = (item) =>
  item.status === 'published' && item.published_at && new Date(item.published_at) > new Date();

const listItem = (item) => ({
  id: item.id,
  slug: item.slug,
  title: item.title,
  category: item.category,
  excerpt: item.excerpt,
  coverUrl: item.cover_url,
  coverAlt: item.cover_alt,
  tags: item.tags || [],
  publishedAt: item.published_at,
  readingMinutes: item.reading_minutes
});

const publicItem = (item) => ({
  ...listItem(item),
  contentHtml: item.content_html,
  seoTitle: item.seo_title,
  seoDescription: item.seo_description
});

const adminItem = (item, withContent = false) => ({
  ...listItem(item),
  status: item.status,
  scheduled: Boolean(isScheduled(item)),
  seoTitle: item.seo_title,
  seoDescription: item.seo_description,
  updatedAt: item.updated_at,
  createdAt: item.created_at,
  wordCount: item.word_count,
  ...(withContent ? { contentJson: item.content_json, contentHtml: item.content_html } : {})
});

const publicWhere = (extra = {}) => ({
  status: 'published',
  published_at: { [Op.lte]: new Date() },
  ...extra
});

const LIST_ATTRIBUTES = { exclude: ['content_json', 'content_html'] };

// ---------- публичные ----------

exports.list = asyncHandler(async (req, res) => {
  const limit = toNumber(req.query.limit, 12, 1, 50);
  const offset = toNumber(req.query.offset, 0, 0, 100000);
  const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
  const where = publicWhere(category ? { category } : {});
  const { rows, count } = await News.findAndCountAll({
    where,
    attributes: LIST_ATTRIBUTES,
    order: [['published_at', 'DESC'], ['id', 'DESC']],
    limit,
    offset
  });
  res.json({ items: rows.map(listItem), total: count });
});

exports.getBySlug = asyncHandler(async (req, res) => {
  const item = await News.findOne({ where: publicWhere({ slug: String(req.params.slug) }) });
  if (!item) return res.sendStatus(404);

  // «Читайте также»: сначала из той же рубрики, затем свежие остальные.
  const base = publicWhere({ id: { [Op.ne]: item.id } });
  const sameCategory = item.category
    ? await News.findAll({ where: { ...base, category: item.category }, attributes: LIST_ATTRIBUTES, order: [['published_at', 'DESC']], limit: 3 })
    : [];
  let related = sameCategory;
  if (related.length < 3) {
    const rest = await News.findAll({
      where: { ...base, id: { [Op.notIn]: [item.id, ...related.map((r) => r.id)] } },
      attributes: LIST_ATTRIBUTES,
      order: [['published_at', 'DESC']],
      limit: 3 - related.length
    });
    related = [...related, ...rest];
  }
  res.json({ ...publicItem(item), related: related.map(listItem) });
});

// ---------- админка ----------

exports.adminList = asyncHandler(async (_req, res) => {
  const rows = await News.findAll({
    attributes: LIST_ATTRIBUTES,
    order: [['updated_at', 'DESC'], ['id', 'DESC']]
  });
  res.json(rows.map((item) => adminItem(item)));
});

exports.adminGet = asyncHandler(async (req, res) => {
  const item = await News.findByPk(req.params.id);
  if (!item) return res.sendStatus(404);
  res.json(adminItem(item, true));
});

const buildFields = async (body, current) => {
  const v = await newsSchema.validateAsync(body, { stripUnknown: true });
  const html = sanitizeNewsHtml(v.content_html);
  const stats = textStats(html);
  const fields = {
    title: v.title,
    category: v.category,
    excerpt: v.excerpt,
    cover_url: v.cover_url || '',
    cover_alt: v.cover_alt,
    tags: v.tags,
    status: v.status,
    seo_title: v.seo_title,
    seo_description: v.seo_description,
    content_json: v.content_json,
    content_html: html,
    word_count: stats.wordCount,
    reading_minutes: stats.readingMinutes
  };

  // Дата публикации: задана вручную — берём её; иначе при публикации ставим сейчас.
  if (v.published_at) fields.published_at = v.published_at;
  else if (v.status === 'published') fields.published_at = current?.published_at || new Date();
  else fields.published_at = current?.published_at || null;

  // Адрес страницы: пока новость не публиковалась, он следует за заголовком;
  // после первой публикации замораживается, чтобы не ломать ссылки.
  const locked = Boolean(current?.slug_locked);
  if (!locked) {
    const base = slugify(v.title);
    if (!current || current.slug !== base && !current.slug.startsWith(`${base}-`)) {
      fields.slug = await uniqueSlug(base, async (candidate) => {
        const where = { slug: candidate };
        if (current) where.id = { [Op.ne]: current.id };
        return Boolean(await News.count({ where }));
      });
    }
  }
  if (v.status === 'published') fields.slug_locked = true;
  return fields;
};

exports.create = asyncHandler(async (req, res) => {
  const fields = await buildFields(req.body, null);
  const item = await News.create(fields);
  res.status(201).json(adminItem(item, true));
});

exports.update = asyncHandler(async (req, res) => {
  const item = await News.findByPk(req.params.id);
  if (!item) return res.sendStatus(404);
  const fields = await buildFields(req.body, item);
  await item.update(fields);
  res.json(adminItem(item, true));
});

exports.remove = asyncHandler(async (req, res) => {
  const item = await News.findByPk(req.params.id);
  if (!item) return res.sendStatus(404);
  await item.destroy();
  res.json({ ok: true });
});

exports._test = { newsSchema, isScheduled };
