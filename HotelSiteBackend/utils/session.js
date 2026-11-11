const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User } = require('../models/models');
const AdminSession = require('../models/adminSession');

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const IDLE_TTL_MS = 30 * 60 * 1000;
const ISSUER = 'hotel-admin';
const AUDIENCE = 'hotel-admin-api';
const credentialHash = (passwordHash) => crypto.createHash('sha256').update(passwordHash).digest('hex');
const equalTokens = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string' || !a || !b) return false;
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};
const parseCookies = (header = '') => {
  const result = Object.create(null);
  for (const part of header.split(';')) {
    const [key, ...rawValue] = part.trim().split('=');
    if (!key || rawValue.length === 0) continue;
    try { result[key] = decodeURIComponent(rawValue.join('=')); } catch { /* Ignore malformed cookies. */ }
  }
  return result;
};
const authenticateRequest = async (req) => {
  if (req.adminSession && req.user) return req.user;
  const token = parseCookies(req.headers.cookie).hotel_session;
  if (!token) return null;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'], issuer: ISSUER, audience: AUDIENCE });
  } catch { return null; }
  if (typeof decoded !== 'object' || typeof decoded.jti !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decoded.jti) || !/^\d+$/.test(decoded.sub || '')) return null;
  const session = await AdminSession.findByPk(decoded.jti);
  const now = Date.now();
  if (!session || String(session.user_id) !== decoded.sub || new Date(session.expires_at).getTime() <= now || new Date(session.last_seen_at).getTime() <= now - IDLE_TTL_MS) return null;
  const user = await User.findByPk(session.user_id);
  if (!user || user.role !== 'ADMIN' || !equalTokens(session.credential_hash, credentialHash(user.password))) return null;
  if (new Date(session.last_seen_at).getTime() < now - 60 * 1000) await session.update({ last_seen_at: new Date(now) });
  req.adminSession = session;
  req.user = { id: user.id, email: user.email, role: user.role };
  return req.user;
};
const createSession = async (user) => {
  const now = new Date();
  await AdminSession.destroy({ where: { [Op.or]: [{ expires_at: { [Op.lt]: now } }, { last_seen_at: { [Op.lt]: new Date(now.getTime() - IDLE_TTL_MS) } }] } });
  return AdminSession.create({ id: crypto.randomUUID(), user_id: user.id, credential_hash: credentialHash(user.password), csrf_token: crypto.randomBytes(32).toString('base64url'), expires_at: new Date(now.getTime() + SESSION_TTL_MS), last_seen_at: now });
};
const signSession = (session) => jwt.sign({}, process.env.JWT_SECRET, {
  algorithm: 'HS256', issuer: ISSUER, audience: AUDIENCE, subject: String(session.user_id), jwtid: session.id,
  expiresIn: Math.max(1, Math.floor((new Date(session.expires_at).getTime() - Date.now()) / 1000))
});
module.exports = { authenticateRequest, parseCookies, createSession, signSession, equalTokens, credentialHash, SESSION_TTL_MS, IDLE_TTL_MS };
