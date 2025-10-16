const asyncHandler = require('express-async-handler');
const Joi = require('joi');
const { Room, RoomImage, RoomProperty, RoomConvenience, RoomPrice, RoomNote } = require('../models/models');

const roomCreateSchema = Joi.object({
  name: Joi.string().max(255).required(),
  description: Joi.string().allow('', null),
  check_in_time: Joi.string().max(10).allow('', null),
  check_out_time: Joi.string().max(10).allow('', null),
  is_active: Joi.boolean().default(true),
  images: Joi.array().items(Joi.object({ url: Joi.string().required(), alt_text: Joi.string().allow('', null), order: Joi.number().integer() })).default([]),
  properties: Joi.array().items(Joi.string().max(255)).default([]),
  conveniences: Joi.array().items(Joi.string().max(255)).default([]),
  prices: Joi.array().items(Joi.object({ title: Joi.string().max(255).required(), price: Joi.number().precision(2).required() })).default([]),
  notes: Joi.array().items(Joi.string()).default([]),
});

const roomUpdateSchema = Joi.object({
  name: Joi.string().max(255).optional(),
  description: Joi.string().allow('', null).optional(),
  check_in_time: Joi.string().max(10).allow('', null).optional(),
  check_out_time: Joi.string().max(10).allow('', null).optional(),
  is_active: Joi.boolean().optional(),
  images: Joi.array().items(Joi.object({ url: Joi.string().required(), alt_text: Joi.string().allow('', null), order: Joi.number().integer() })).optional(),
  properties: Joi.array().items(Joi.string().max(255)).optional(),
  conveniences: Joi.array().items(Joi.string().max(255)).optional(),
  prices: Joi.array().items(Joi.object({ title: Joi.string().max(255).required(), price: Joi.number().precision(2).required() })).optional(),
  notes: Joi.array().items(Joi.string()).optional(),
}).min(1);

exports.list = asyncHandler(async (req, res) => {
  const rooms = await Room.findAll({
    include: [
      { model: RoomImage, as: 'images' },
      { model: RoomProperty, as: 'properties' },
      { model: RoomConvenience, as: 'conveniences' },
      { model: RoomPrice, as: 'prices' },
      { model: RoomNote, as: 'notes' },
    ],
    order: [[{ model: RoomImage, as: 'images' }, 'order', 'ASC']]
  });
  res.json(rooms);
});

exports.create = asyncHandler(async (req, res) => {
  const v = await roomCreateSchema.validateAsync(req.body);
  const room = await Room.create({ name: v.name, description: v.description, check_in_time: v.check_in_time, check_out_time: v.check_out_time, is_active: v.is_active });
  if (v.images?.length) await RoomImage.bulkCreate(v.images.map(i => ({ ...i, room_id: room.id })));
  if (v.properties?.length) await RoomProperty.bulkCreate(v.properties.map(p => ({ property_text: p, room_id: room.id })));
  if (v.conveniences?.length) await RoomConvenience.bulkCreate(v.conveniences.map(c => ({ convenience_text: c, room_id: room.id })));
  if (v.prices?.length) await RoomPrice.bulkCreate(v.prices.map(p => ({ ...p, room_id: room.id })));
  if (v.notes?.length) await RoomNote.bulkCreate(v.notes.map(n => ({ note_text: n, room_id: room.id })));

  const withIncludes = await Room.findByPk(room.id, { include: ['images','properties','conveniences','prices','notes'] });
  res.status(201).json(withIncludes);
});

exports.get = asyncHandler(async (req, res) => {
  const room = await Room.findByPk(req.params.id, { include: ['images','properties','conveniences','prices','notes'] });
  if (!room) return res.sendStatus(404);
  res.json(room);
});

exports.update = asyncHandler(async (req, res) => {
  const v = await roomUpdateSchema.validateAsync(req.body);
  const room = await Room.findByPk(req.params.id);
  if (!room) return res.sendStatus(404);
  
  // Update only provided fields
  const updateData = {};
  if (v.name !== undefined) updateData.name = v.name;
  if (v.description !== undefined) updateData.description = v.description;
  if (v.check_in_time !== undefined) updateData.check_in_time = v.check_in_time;
  if (v.check_out_time !== undefined) updateData.check_out_time = v.check_out_time;
  if (v.is_active !== undefined) updateData.is_active = v.is_active;
  
  if (Object.keys(updateData).length > 0) {
    await room.update(updateData);
  }
  
  // Update related data only if provided
  if (v.images !== undefined) {
    await RoomImage.destroy({ where: { room_id: room.id } });
    if (v.images.length) await RoomImage.bulkCreate(v.images.map(i => ({ ...i, room_id: room.id })));
  }
  
  if (v.properties !== undefined) {
    await RoomProperty.destroy({ where: { room_id: room.id } });
    if (v.properties.length) await RoomProperty.bulkCreate(v.properties.map(p => ({ property_text: p, room_id: room.id })));
  }
  
  if (v.conveniences !== undefined) {
    await RoomConvenience.destroy({ where: { room_id: room.id } });
    if (v.conveniences.length) await RoomConvenience.bulkCreate(v.conveniences.map(c => ({ convenience_text: c, room_id: room.id })));
  }
  
  if (v.prices !== undefined) {
    await RoomPrice.destroy({ where: { room_id: room.id } });
    if (v.prices.length) await RoomPrice.bulkCreate(v.prices.map(p => ({ ...p, room_id: room.id })));
  }
  
  if (v.notes !== undefined) {
    await RoomNote.destroy({ where: { room_id: room.id } });
    if (v.notes.length) await RoomNote.bulkCreate(v.notes.map(n => ({ note_text: n, room_id: room.id })));
  }

  const withIncludes = await Room.findByPk(room.id, { include: ['images','properties','conveniences','prices','notes'] });
  res.json(withIncludes);
});

exports.remove = asyncHandler(async (req, res) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) return res.sendStatus(404);
  await room.destroy();
  res.json({ ok: true });
});

exports.toggleActive = asyncHandler(async (req, res) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) return res.sendStatus(404);
  await room.update({ is_active: !room.is_active });
  const withIncludes = await Room.findByPk(room.id, { 
    include: ['images','properties','conveniences','prices','notes'] 
  });
  res.json(withIncludes);
});
