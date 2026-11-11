const assert = require('node:assert/strict');
const test = require('node:test');

const { buildInsights, createClient, fetchDashboard, periodDates, pickGoals } = require('../utils/metrika');
const { fakeMetrikaResponse } = require('./fixtures/fakeMetrika');
const fakeFetch = async input => {
  const { status, body } = fakeMetrikaResponse(input, NOW);
  return { ok: status < 400, status, json: async () => body };
};

const NOW = new Date('2026-10-29T09:00:00Z');

test('periodDates covers N days ending today and the same span before it', () => {
  assert.deepEqual(periodDates(7, NOW), {
    from: '2026-10-23', to: '2026-10-29', previousFrom: '2026-10-16', previousTo: '2026-10-22',
  });
});

test('pickGoals puts site goals first and names them by their event', () => {
  const goals = pickGoals({ goals: [
    { id: 9, name: 'Ручная цель', conditions: [{ type: 'contain', url: '/Contacts' }] },
    { id: 2, name: 'x', conditions: [{ type: 'exact', url: 'phone_click' }] },
    { id: 1, name: 'y', conditions: [{ type: 'exact', url: 'booking_open' }] },
  ] });
  assert.deepEqual(goals.map((g) => [g.id, g.identifier, g.name]), [
    [1, 'booking_open', 'Открыли бронирование'],
    [2, 'phone_click', 'Клик по телефону'],
    [9, null, 'Ручная цель'],
  ]);
});

test('fetchDashboard assembles every report from the API', async () => {
  const client = createClient({ counterId: '1', token: 't', fetchImpl: fakeFetch });
  const d = await fetchDashboard(client, 30, NOW);

  assert.equal(d.totals.visits, 2740);
  assert.ok(d.previous.visits < d.totals.visits);
  assert.equal(d.daily.length, 30);
  assert.equal(d.hours.length, 24);
  assert.equal(d.hours[20].visits, 270);
  assert.equal(d.sources[0].name, 'Переходы из поисковых систем');
  assert.equal(d.sources[0].bookingRate, 6.1);
  assert.equal(d.devices[0].bookingRate, 3.9);
  assert.equal(d.goals[0].identifier, 'booking_open');
  assert.equal(d.goals[0].reaches, 138);
  assert.equal(d.ecommerce, null);
  assert.ok(d.insights.length > 0);
});

test('API errors become readable messages', async () => {
  const client = createClient({
    counterId: '1', token: 'bad',
    fetchImpl: async () => ({ ok: false, status: 403, json: async () => ({ errors: [{ message: 'Access denied' }] }) }),
  });
  await assert.rejects(client.stat({ metrics: 'ym:s:visits' }), (e) => e.status === 502 && /токен/.test(e.message));
});

test('insights flag weak devices, weak sources and leaky entry pages', async () => {
  const client = createClient({ counterId: '1', token: 't', fetchImpl: fakeFetch });
  const titles = (await fetchDashboard(client, 30, NOW)).insights.map((i) => i.title).join('\n');
  assert.match(titles, /Визитов больше/);
  assert.match(titles, /Смартфоны: отказов/);
  assert.match(titles, /«Переходы по ссылкам на сайтах» конвертирует лучше всего/);
  assert.match(titles, /\/Restaurant/);
  assert.match(titles, /Пик посещаемости — 20:00–21:00/);
});

test('insights stay quiet on tiny samples', () => {
  const empty = { visits: 12 };
  const out = buildInsights({ totals: empty, previous: empty, goals: [], devices: [], sources: [], entryPages: [], hours: [] });
  assert.equal(out.length, 1);
  assert.equal(out[0].title, 'Пока мало данных');
});
