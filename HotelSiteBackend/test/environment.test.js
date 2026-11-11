const test = require('node:test');
const assert = require('node:assert/strict');
const { validateEnvironment } = require('../utils/environment');
const base = { NODE_ENV: 'production', JWT_SECRET: 'a'.repeat(64), DB_PASSWORD: 'synthetic-db-password-with-enough-entropy', PUBLIC_SITE_URL: 'https://hotel.example.test' };
test('production rejects unsafe cookie, transport and secret configuration', () => {
  for (const values of [{ JWT_SECRET: '' }, { JWT_SECRET: 'change-me-to-a-very-long-key-for-example' }, { DB_PASSWORD: 'root' }, { PUBLIC_SITE_URL: 'http://hotel.example.test' }, { COOKIE_SECURE: 'false' }, { PUBLIC_SITE_URL: '' }]) assert.throws(() => validateEnvironment({ ...base, ...values }));
  assert.doesNotThrow(() => validateEnvironment(base));
  assert.doesNotThrow(() => validateEnvironment({ ...base, PUBLIC_SITE_URL: 'http://localhost:8081', COOKIE_SECURE: 'false' }));
});
