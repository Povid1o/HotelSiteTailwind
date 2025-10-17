const { sequelize } = require('../db');
const { EventCategory, Event, EventImage } = require('../models/models');

async function getAllCategories() {
  return EventCategory.findAll({ include: [{ model: Event, as: 'events', include: [{ model: EventImage, as: 'images' }] }] });
}

async function updateCategory(id, data) {
  const cat = await EventCategory.findByPk(id);
  if (!cat) return null;
  await cat.update({ header: data.header ?? cat.header, description: data.description ?? cat.description });
  return cat;
}

async function getAllEvents(filter = {}) {
  const where = {};
  if (filter.categoryId) where.category_id = filter.categoryId;
  return Event.findAll({ where, include: [
    { model: EventCategory, as: 'category' },
    { model: EventImage, as: 'images' }
  ]});
}

async function getEventById(id) {
  return Event.findByPk(id, { include: [
    { model: EventCategory, as: 'category' },
    { model: EventImage, as: 'images' }
  ]});
}

async function createEvent(payload) {
  return await Event.sequelize.transaction(async (t) => {
    const ev = await Event.create({
      title: payload.title,
      description: payload.description,
      category_id: payload.categoryId
    }, { transaction: t });
    if (Array.isArray(payload.images)) {
      for (const [idx, img] of payload.images.entries()) {
        await EventImage.create({ event_id: ev.id, url: img.url, alt_text: img.alt_text || '', order: typeof img.order === 'number' ? img.order : idx }, { transaction: t });
      }
    }
    return ev;
  });
}

async function updateEvent(id, payload) {
  return await Event.sequelize.transaction(async (t) => {
    const ev = await Event.findByPk(id, { transaction: t });
    if (!ev) return null;
    await ev.update({
      title: payload.title ?? ev.title,
      description: payload.description ?? ev.description,
      category_id: payload.categoryId ?? ev.category_id
    }, { transaction: t });
    if (payload.images) {
      await EventImage.destroy({ where: { event_id: ev.id }, transaction: t });
      for (const [idx, img] of payload.images.entries()) {
        await EventImage.create({ event_id: ev.id, url: img.url, alt_text: img.alt_text || '', order: typeof img.order === 'number' ? img.order : idx }, { transaction: t });
      }
    }
    return ev;
  });
}

async function deleteEvent(id) {
  return await Event.sequelize.transaction(async (t) => {
    await EventImage.destroy({ where: { event_id: id }, transaction: t });
    const count = await Event.destroy({ where: { id }, transaction: t });
    return count;
  });
}

module.exports = {
  getAllCategories,
  updateCategory,
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};


