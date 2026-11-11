const assert = require('node:assert/strict');
const test = require('node:test');
const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');
const { User } = require('../models/models');
const AdminSession = require('../models/adminSession');
const { credentialHash, signSession } = require('../utils/session');
process.env.JWT_SECRET = 'synthetic-unit-test-key-at-least-thirty-two-characters';
const responseRecorder = () => ({ statusCode: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });

test('auth rejects missing session and legacy self-contained JWT', async () => {
  for (const cookie of ['', `hotel_session=${jwt.sign({ id: 42, role: 'ADMIN' }, process.env.JWT_SECRET)}`]) {
    const res = responseRecorder(); let next = false;
    await auth({ method: 'POST', headers: { cookie } }, res, () => { next = true; });
    assert.equal(next, false); assert.equal(res.statusCode, 401);
  }
});
test('auth accepts a current stored session and obtains the role from the database', async () => {
  const user = { id: 42, email: 'admin@example.test', role: 'ADMIN', password: 'a-stored-password-hash' };
  const session = { id: crypto.randomUUID(), user_id: 42, credential_hash: credentialHash(user.password), expires_at: new Date(Date.now() + 3600000), last_seen_at: new Date() };
  AdminSession.findByPk = async () => session;
  User.findByPk = async () => user;
  const req = { method: 'POST', headers: { cookie: `hotel_session=${signSession(session)}` } };
  const res = responseRecorder(); let called = false;
  await auth(req, res, () => { called = true; });
  assert.equal(called, true); assert.equal(req.user.role, 'ADMIN');
});
test('role middleware rejects an authenticated non-admin', () => {
  const res = responseRecorder(); let called = false;
  checkRole('ADMIN')({ method: 'DELETE', user: { id: 7, role: 'USER' } }, res, () => { called = true; });
  assert.equal(called, false); assert.equal(res.statusCode, 403);
});
