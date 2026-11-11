const test = require('node:test');
const assert = require('node:assert/strict');
const nodemailer = require('nodemailer');
const { createWineInquiryController } = require('../controllers/wineInquiryController');
const { buildInquiryMessage, createMailTransport, smtpConfigured } = require('../services/wineInquiryMail');

function fixture(options = {}) {
  const sent = [];
  const saved = [];
  const queries = [];
  const wine = { id: 7, name: 'Каберне', year: 2023, price: '1800.00' };
  const controller = createWineInquiryController({
    Wine: { findOne: async query => { queries.push(query); return options.missingWine ? null : wine; } },
    Settings: {
      findByPk: async () => options.noRecipient ? null : { recipient_email: 'manager@example.com' },
      upsert: async value => saved.push(value)
    },
    mail: {
      smtpConfigured: () => !options.noSmtp,
      sendInquiryMail: async value => { if (options.mailError) throw new Error('private SMTP error'); sent.push(value); }
    },
    logger: { error() {} }
  });
  const response = () => ({
    statusCode: 200, status(code) { this.statusCode = code; return this; },
    set() { return this; }, json(data) { this.data = data; return this; }
  });
  const submit = async (body, json = true) => {
    const res = response();
    await controller.submit({ body, is: () => json }, res);
    return res;
  };
  return { controller, submit, sent, saved, queries, wine, response };
}

test('public inquiry sends authoritative product data to the stored recipient', async () => {
  const f = fixture();
  const res = await f.submit({ wineId: 7, email: ' visitor@example.com ', website: '' });
  assert.equal(res.statusCode, 201);
  assert.deepEqual(f.queries, [{ where: { id: 7, is_active: true } }]);
  assert.deepEqual(f.sent, [{ wine: f.wine, email: 'visitor@example.com', recipientEmail: 'manager@example.com' }]);
  assert.ok(!JSON.stringify(res.data).includes('manager@example.com'));
});

test('invalid email, injected recipient, header injection, invalid product, honeypot and non-JSON never send mail', async () => {
  const f = fixture();
  for (const body of [
    { wineId: 7, email: 'bad' },
    { wineId: 7, email: 'visitor@example.com', recipientEmail: 'attacker@example.com' },
    { wineId: 7, email: 'v@example.com\r\nBcc: attacker@example.com' },
    { wineId: -1, email: 'visitor@example.com' },
    { wineId: 7, email: 'visitor@example.com', website: 'https://bot.example' }
  ]) assert.equal((await f.submit(body)).statusCode, 400);
  assert.equal((await f.submit({ wineId: 7, email: 'visitor@example.com' }, false)).statusCode, 415);
  assert.equal(f.sent.length, 0);
  assert.equal(f.queries.length, 0);
});

test('unavailable wine, missing configuration and SMTP failure never claim success', async () => {
  for (const [options, status] of [
    [{ missingWine: true }, 404], [{ noRecipient: true }, 503], [{ noSmtp: true }, 503], [{ mailError: true }, 502]
  ]) {
    const f = fixture(options);
    const res = await f.submit({ wineId: 7, email: 'visitor@example.com' });
    assert.equal(res.statusCode, status);
    assert.equal(f.sent.length, 0);
    assert.ok(!JSON.stringify(res.data).includes('private SMTP'));
  }
});

test('email settings validate one recipient, persist it, and can disable inquiries', async () => {
  const f = fixture();
  for (const email of [' manager@example.com ', '']) {
    const res = f.response();
    await f.controller.saveSettings({ body: { recipientEmail: email } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.data.recipientEmail, email.trim());
  }
  for (const email of ['bad', 'one@example.com,two@example.com']) {
    const res = f.response();
    await f.controller.saveSettings({ body: { recipientEmail: email } }, res);
    assert.equal(res.statusCode, 400);
  }
  assert.deepEqual(f.saved, [{ id: 1, recipient_email: 'manager@example.com' }, { id: 1, recipient_email: '' }]);
});

test('notification renders a real email with product link and visitor Reply-To', async () => {
  const message = buildInquiryMessage({
    wine: { id: 7, name: 'Каберне\r\nX-Fake: injected', year: 2023, price: '1800.00' },
    email: 'visitor@example.com', recipientEmail: 'manager@example.com'
  }, { SMTP_FROM: 'sender@example.com', PUBLIC_SITE_URL: 'https://example.com' });
  const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
  const result = await transport.sendMail(message);
  const mime = result.message.toString();
  assert.match(mime, /To: manager@example.com/);
  assert.match(mime, /Reply-To: visitor@example.com/);
  assert.match(mime, /From: sender@example.com/);
  assert.ok(!mime.includes('\r\nX-Fake:'));
  assert.match(message.text, /https:\/\/example.com\/Shop\/7/);
  assert.match(message.text, /2023/);
  assert.match(message.text, /visitor@example.com/);
  assert.deepEqual(result.envelope.to, ['manager@example.com']);
});

test('SMTP supports implicit TLS and STARTTLS without exposing credentials to settings', () => {
  const env = { SMTP_HOST: 'smtp.example.com', SMTP_USER: 'sender', SMTP_PASSWORD: 'secret', SMTP_FROM: 'sender@example.com' };
  assert.equal(smtpConfigured(env), true);
  assert.equal(smtpConfigured({ ...env, SMTP_PASSWORD: '' }), false);
  const implicit = createMailTransport(env);
  assert.equal(implicit.options.secure, true);
  assert.equal(implicit.options.port, 465);
  const starttls = createMailTransport({ ...env, SMTP_PORT: '587', SMTP_SECURE: 'false' });
  assert.equal(starttls.options.secure, false);
  assert.equal(starttls.options.requireTLS, true);
  implicit.close();
  starttls.close();
});
