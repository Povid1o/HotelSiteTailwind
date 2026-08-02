const assert = require('node:assert/strict');
const test = require('node:test');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

process.env.JWT_SECRET = 'test-only-secret';

function responseRecorder() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
}

test('auth middleware rejects a request without a bearer token', () => {
  const res = responseRecorder();
  let calledNext = false;

  auth({ method: 'POST', headers: {} }, res, () => { calledNext = true; });

  assert.equal(calledNext, false);
  assert.equal(res.statusCode, 401);
});

test('auth middleware accepts a valid bearer token', () => {
  const res = responseRecorder();
  const token = jwt.sign({ id: 42, email: 'admin@example.test', role: 'ADMIN' }, process.env.JWT_SECRET);
  const req = { method: 'POST', headers: { authorization: `Bearer ${token}` } };
  let calledNext = false;

  auth(req, res, () => { calledNext = true; });

  assert.equal(calledNext, true);
  assert.equal(req.user.role, 'ADMIN');
  assert.equal(res.statusCode, null);
});

test('role middleware rejects an authenticated non-admin user', () => {
  const res = responseRecorder();
  const token = jwt.sign({ id: 7, email: 'user@example.test', role: 'USER' }, process.env.JWT_SECRET);
  let calledNext = false;

  checkRole('ADMIN')(
    { method: 'DELETE', headers: { authorization: `Bearer ${token}` } },
    res,
    () => { calledNext = true; }
  );

  assert.equal(calledNext, false);
  assert.equal(res.statusCode, 403);
});
