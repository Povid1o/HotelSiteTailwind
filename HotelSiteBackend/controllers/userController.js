const asyncHandler = require('express-async-handler');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const sequelize = require('../db');
const { User, Basket } = require('../models/models');
const { createSession, signSession, SESSION_TTL_MS } = require('../utils/session');

const email = Joi.string().trim().lowercase().max(254).email({ tlds: { allow: false } }).required();
const loginSchema = Joi.object({ email, password: Joi.string().max(256).required() });
const registrationSchema = Joi.object({ email, password: Joi.string().min(12).max(72).custom((v, helpers) => Buffer.byteLength(v) <= 72 ? v : helpers.error('any.invalid')).required() });
const dummyHash = bcrypt.hashSync('not-an-account-password', 12);
const cookieOptions = (req, path = '/api') => ({
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production' ? process.env.COOKIE_SECURE !== 'false' : Boolean(req.secure),
  path
});
const setSessionCookies = (req, res, session) => {
  const maxAge = Math.min(SESSION_TTL_MS, new Date(session.expires_at).getTime() - Date.now());
  res.cookie('hotel_session', signSession(session), { ...cookieOptions(req), maxAge, httpOnly: true });
  res.cookie('csrf_token', session.csrf_token, { ...cookieOptions(req, '/'), maxAge, httpOnly: false });
  res.set('Cache-Control', 'no-store');
};
exports.registration = asyncHandler(async (req, res) => {
  const { value, error } = registrationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: 'Укажите корректный email и пароль: от 12 символов, не более 72 байт.' });
  const password = await bcrypt.hash(value.password, 12);
  const user = await sequelize.transaction(async (transaction) => {
    const result = await User.create({ email: value.email, password, role: 'ADMIN' }, { transaction });
    await Basket.create({ userId: result.id }, { transaction });
    return result;
  });
  res.status(201).json({ id: user.id, email: user.email, role: user.role });
});
exports.login = asyncHandler(async (req, res) => {
  if (!req.is('application/json')) return res.status(415).json({ message: 'Ожидается JSON.' });
  const { value, error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: 'Проверьте email и пароль.' });
  const user = await User.findOne({ where: { email: value.email } });
  const matches = await bcrypt.compare(value.password, user?.password || dummyHash);
  if (!user || !matches || user.role !== 'ADMIN') return res.status(401).json({ message: 'Неверный email или пароль' });
  const session = await createSession(user);
  setSessionCookies(req, res, session);
  res.json({ id: user.id, email: user.email, role: user.role });
});
exports.check = asyncHandler(async (req, res) => {
  setSessionCookies(req, res, req.adminSession);
  res.json(req.user);
});
exports.logout = asyncHandler(async (req, res) => {
  if (req.adminSession) await req.adminSession.destroy();
  res.clearCookie('hotel_session', cookieOptions(req));
  res.clearCookie('csrf_token', cookieOptions(req, '/'));
  res.clearCookie('csrf_token', cookieOptions(req));
  res.set('Cache-Control', 'no-store').sendStatus(204);
});
exports._test = { loginSchema, registrationSchema, cookieOptions };
