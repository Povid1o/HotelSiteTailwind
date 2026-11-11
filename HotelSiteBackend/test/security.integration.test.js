const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

process.env.NODE_ENV = 'production';
process.env.JWT_SECRET = 'synthetic-security-test-secret-not-a-real-credential';
process.env.PUBLIC_SITE_URL = 'https://hotel.example.test';
process.env.COOKIE_SECURE = 'true';
const { User, Page, Room, DishCategory, Wine, WineType, WineSweetness } = require('../models/models');
const AdminSession = require('../models/adminSession');
const { createSession, signSession, IDLE_TTL_MS } = require('../utils/session');
const app = require('../index');
const users = new Map();
const sessions = new Map();
User.findByPk = async id => users.get(Number(id)) || null;
User.findOne = async ({ where }) => [...users.values()].find(u => u.email === where.email) || null;
AdminSession.findByPk = async id => sessions.get(id) || null;
AdminSession.create = async data => {
  const session = { ...data, update: async values => Object.assign(session, values), destroy: async () => sessions.delete(session.id) };
  sessions.set(session.id, session);
  return session;
};
AdminSession.destroy = async () => {
  for (const [id, s] of sessions) if (s.expires_at <= new Date() || s.last_seen_at < new Date(Date.now() - IDLE_TTL_MS)) sessions.delete(id);
};

function request(server, method, route, body, headers = {}) {
  const payload = body === undefined ? undefined : typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: server.address().port, method, path: route,
      headers: { ...(body && !Buffer.isBuffer(body) ? { 'Content-Type': 'application/json' } : {}), ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}), ...headers }
    }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }));
    });
    req.on('error', reject);
    req.setTimeout(3000, () => req.destroy(new Error('test request timed out')));
    req.end(payload);
  });
}
const authHeaders = session => ({ Cookie: `hotel_session=${signSession(session)}; csrf_token=${session.csrf_token}`, 'X-CSRF-Token': session.csrf_token });

// Real middleware and routes, synthetic credentials, no PostgreSQL/SMTP access.
test('HTTP security regressions', async t => {
  const admin = { id: 1, email: 'admin@example.test', role: 'ADMIN', password: await bcrypt.hash('valid-test-password', 4) };
  users.set(1, admin);
  const server = await new Promise((resolve, reject) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); s.on('error', reject); });
  try {
    const session = await createSession(admin);
    const headers = authHeaders(session);
    await t.test('all administrative writes reject an unauthenticated request', async () => {
      const routes = [
        ['POST','/api/upload'], ['POST','/api/user/registration'], ['POST','/api/pages'], ['PUT','/api/pages/1'], ['PATCH','/api/pages/1/content'], ['PATCH','/api/pages/1/toggle-active'], ['DELETE','/api/pages/1'],
        ['POST','/api/rooms'], ['PUT','/api/rooms/1'], ['PATCH','/api/rooms/1/toggle-active'], ['DELETE','/api/rooms/1'], ['POST','/api/dishes'], ['PUT','/api/dishes/1'], ['DELETE','/api/dishes/1'],
        ['POST','/api/wines'], ['POST','/api/wines/tree'], ['PUT','/api/wines/1'], ['DELETE','/api/wines/1'], ['PUT','/api/events/categories/1'], ['POST','/api/events'], ['PUT','/api/events/1'], ['DELETE','/api/events/1'],
        ['POST','/api/news/admin'], ['PUT','/api/news/admin/1'], ['DELETE','/api/news/admin/1'], ['POST','/api/dish-categories'], ['PUT','/api/dish-categories/1'], ['DELETE','/api/dish-categories/1'],
        ['POST','/api/wine-types'], ['DELETE','/api/wine-types/1'], ['POST','/api/wine-sweetness'], ['DELETE','/api/wine-sweetness/1'], ['PUT','/api/wine-inquiries/settings']
      ];
      for (const [method, route] of routes) assert.equal((await request(server, method, route, undefined, { Cookie: 'csrf_token=guessed', 'X-CSRF-Token': 'guessed' })).status, 401, `${method} ${route}`);
    });
    await t.test('admin-only reads and Swagger reject a guest', async () => {
      for (const route of ['/api/news/admin', '/api/news/admin/1', '/api/analytics/dashboard', '/api/wine-inquiries/settings', '/api/docs/', '/api/swagger.yaml']) assert.equal((await request(server, 'GET', route)).status, 401, route);
    });
    await t.test('CSRF requires the value bound to the server-side session', async () => {
      assert.equal((await request(server, 'POST', '/api/user/registration', {}, { Cookie: headers.Cookie })).status, 403);
      assert.equal((await request(server, 'POST', '/api/user/registration', {}, { Cookie: `hotel_session=${signSession(session)}; csrf_token=guessed`, 'X-CSRF-Token': 'guessed' })).status, 403);
      assert.equal((await request(server, 'POST', '/api/user/registration', {}, headers)).status, 400);
    });
    await t.test('one-character passwords are rejected', async () => {
      assert.equal((await request(server, 'POST', '/api/user/registration', { email: 'short@example.test', password: 'x' }, headers)).status, 400);
    });
    await t.test('malformed login data returns an error and keeps the process alive', async () => {
      for (const password of [{}, [], 12, null]) assert.equal((await request(server, 'POST', '/api/user/login', { email: admin.email, password })).status, 400);
      assert.equal((await request(server, 'POST', '/api/user/login', '{')).status, 400);
      assert.equal((await request(server, 'GET', '/api')).status, 200);
    });
    await t.test('login rejects cross-site and HTML-form submissions', async () => {
      assert.equal((await request(server, 'POST', '/api/user/login', { email: admin.email, password: 'valid-test-password' }, { Origin: 'https://attacker.example' })).status, 403);
      assert.equal((await request(server, 'POST', '/api/user/login', 'email=a&password=b', { 'Content-Type': 'application/x-www-form-urlencoded' })).status, 415);
    });
    await t.test('successful login sets secure HttpOnly cookies and no-store', async () => {
      const res = await request(server, 'POST', '/api/user/login', { email: admin.email, password: 'valid-test-password' });
      assert.equal(res.status, 200);
      const cookie = res.headers['set-cookie'].find(v => v.startsWith('hotel_session='));
      assert.match(cookie, /HttpOnly/); assert.match(cookie, /Secure/); assert.match(cookie, /SameSite=Strict/);
      assert.equal(res.headers['cache-control'], 'no-store');
      assert.ok(!res.body.includes('token'));
    });
    await t.test('a signed JWT without a real stored session cannot authenticate', async () => {
      const token = jwt.sign({ id: 1, role: 'ADMIN' }, process.env.JWT_SECRET);
      assert.equal((await request(server, 'GET', '/api/user/auth', undefined, { Cookie: `hotel_session=${token}` })).status, 401);
    });
    await t.test('password change, role removal and user deletion revoke existing sessions', async () => {
      const original = admin.password;
      admin.password = await bcrypt.hash('new-test-password', 4);
      assert.equal((await request(server, 'GET', '/api/user/auth', undefined, headers)).status, 401);
      admin.password = original; admin.role = 'USER';
      assert.equal((await request(server, 'GET', '/api/user/auth', undefined, headers)).status, 401);
      admin.role = 'ADMIN'; users.delete(1);
      assert.equal((await request(server, 'GET', '/api/user/auth', undefined, headers)).status, 401);
      users.set(1, admin);
    });
    await t.test('absolute and idle expirations are enforced', async () => {
      const old = session.last_seen_at; session.last_seen_at = new Date(Date.now() - IDLE_TTL_MS - 1000);
      assert.equal((await request(server, 'GET', '/api/user/auth', undefined, headers)).status, 401);
      session.last_seen_at = old;
      const expiry = session.expires_at; session.expires_at = new Date(Date.now() - 1000);
      assert.equal((await request(server, 'GET', '/api/user/auth', undefined, headers)).status, 401);
      session.expires_at = expiry;
    });
    await t.test('public queries filter inactive content; administrators retain access', async () => {
      for (const [route, model, method] of [['/api/pages',Page,'findAll'], ['/api/pages/1',Page,'findOne'], ['/api/rooms',Room,'findAll'], ['/api/rooms/1',Room,'findOne']]) {
        let query; model[method] = async options => { query = options; return method === 'findAll' ? [] : null; };
        await request(server, 'GET', route);
        assert.equal(query.where.is_active, true, route);
        await request(server, 'GET', route, undefined, headers);
        assert.equal(query.where.is_active, undefined, route);
      }
      let query;
      DishCategory.findAll = async options => { query = options; return []; };
      await request(server, 'GET', '/api/dishes'); assert.equal(query.include[0].where.is_active, true);
      WineType.findAll = WineSweetness.findAll = async () => [];
      Wine.findAll = async options => { query = options; return []; };
      await request(server, 'GET', '/api/wines/tree'); assert.equal(query.where.is_active, true);
    });
    await t.test('unauthenticated multipart never creates upload temp directories', async () => {
      const before = fs.readdirSync(os.tmpdir()).filter(v => v.startsWith('hotel-upload-'));
      const boundary = 'auditBoundary';
      const body = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="audit.txt"\r\nContent-Type: text/plain\r\n\r\nharmless\r\n--${boundary}--\r\n`);
      for (const route of ['/api/upload', '/unknown-audit-route']) {
        const res = await request(server, 'POST', route, body, { 'Content-Type': `multipart/form-data; boundary=${boundary}`, Cookie: 'csrf_token=guessed', 'X-CSRF-Token': 'guessed' });
        assert.equal(res.status, route === '/api/upload' ? 401 : 404);
      }
      assert.deepEqual(fs.readdirSync(os.tmpdir()).filter(v => v.startsWith('hotel-upload-')), before);
    });
    await t.test('authorized rejected upload is cleaned after response', async () => {
      const before = fs.readdirSync(os.tmpdir()).filter(v => v.startsWith('hotel-upload-'));
      const boundary = 'auditBoundary';
      const body = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="type"\r\n\r\nnews\r\n--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="audit.jpg"\r\nContent-Type: image/jpeg\r\n\r\nnot-a-jpeg\r\n--${boundary}--\r\n`);
      const res = await request(server, 'POST', '/api/upload', body, { ...headers, 'Content-Type': `multipart/form-data; boundary=${boundary}` });
      assert.equal(res.status, 415);
      // Cleanup uses asynchronous filesystem operations after res.finish.
      for (let attempt = 0; attempt < 20; attempt++) {
        if (JSON.stringify(fs.readdirSync(os.tmpdir()).filter(v => v.startsWith('hotel-upload-'))) === JSON.stringify(before)) break;
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      assert.deepEqual(fs.readdirSync(os.tmpdir()).filter(v => v.startsWith('hotel-upload-')), before);
    });
    await t.test('logout revokes token replay on the server', async () => {
      assert.equal((await request(server, 'POST', '/api/user/logout', undefined, headers)).status, 204);
      assert.equal((await request(server, 'GET', '/api/user/auth', undefined, headers)).status, 401);
    });
    await t.test('login attempts are rate limited', async () => {
      let status;
      for (let i = 0; i < 12; i++) status = (await request(server, 'POST', '/api/user/login', { email: admin.email, password: {} })).status;
      assert.equal(status, 429);
    });
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});
