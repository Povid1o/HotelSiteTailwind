/**
 * Поддельный Reporting API Метрики: отвечает в формате настоящего API
 * правдоподобными цифрами. Нужен тестам и локальной проверке раздела
 * «Аналитика» без настоящего счётчика (YM_API_BASE=http://localhost:…).
 */

const GOALS = [
  { id: 101, name: 'Бронь', type: 'action', conditions: [{ type: 'exact', url: 'booking_open' }] },
  { id: 102, name: 'Телефон', type: 'action', conditions: [{ type: 'exact', url: 'phone_click' }] },
  { id: 103, name: 'WhatsApp', type: 'action', conditions: [{ type: 'exact', url: 'whatsapp_click' }] },
  { id: 104, name: 'Telegram', type: 'action', conditions: [{ type: 'exact', url: 'telegram_click' }] },
  { id: 105, name: 'Почта', type: 'action', conditions: [{ type: 'exact', url: 'email_click' }] },
];

const row = (names, metrics) => ({ dimensions: names.map((name) => ({ name })), metrics });

const TABLES = {
  'ym:s:lastTrafficSource': [
    row(['Переходы из поисковых систем'], [1240, 28.4, 162, 6.1]),
    row(['Прямые заходы'], [610, 22.1, 205, 7.4]),
    row(['Переходы по рекламе'], [520, 51.3, 74, 1.9]),
    row(['Переходы из социальных сетей'], [230, 39.8, 98, 2.6]),
    row(['Переходы по ссылкам на сайтах'], [140, 31.2, 131, 9.8]),
  ],
  'ym:s:startURLPath': [
    row(['/'], [1380, 24.9, 171, 5.8]),
    row(['/Hotel'], [520, 21.4, 196, 9.6]),
    row(['/Restaurant'], [310, 56.7, 61, 0.9]),
    row(['/Events'], [220, 38.1, 112, 2.1]),
    row(['/Shop'], [180, 33.3, 140, 0.6]),
    row(['/News/sbor-urozhaya-2026'], [130, 61.5, 48, 0.8]),
  ],
  'ym:pv:URLPath': [
    row(['/'], [2310, 1690]), row(['/Hotel'], [1480, 980]), row(['/Restaurant'], [760, 590]),
    row(['/Events'], [540, 410]), row(['/Shop'], [470, 330]), row(['/Vinery'], [380, 300]),
    row(['/Contacts'], [260, 230]), row(['/LocalProducts'], [150, 120]),
  ],
  'ym:s:deviceCategory': [
    row(['Смартфоны'], [1810, 37.9, 3.9]), row(['ПК'], [820, 21.6, 7.8]), row(['Планшеты'], [110, 30.0, 4.5]),
  ],
  'ym:s:regionCity': [
    row(['Краснодар'], [640]), row(['Москва'], [590]), row(['Новороссийск'], [330]), row(['Анапа'], [270]),
    row(['Санкт-Петербург'], [180]), row(['Ростов-на-Дону'], [150]), row(['Сочи'], [90]),
  ],
};

const HOURS = [12, 6, 3, 2, 2, 4, 15, 40, 85, 120, 150, 160, 170, 165, 150, 140, 150, 170, 210, 250, 270, 230, 140, 60];

const daily = (date1, date2) => {
  const out = [];
  for (let d = new Date(`${date1}T12:00:00Z`); d <= new Date(`${date2}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) {
    const weekend = [0, 5, 6].includes(d.getUTCDay());
    const visits = Math.round(80 + 25 * Math.sin(d.getUTCDate() / 3) + (weekend ? 30 : 0));
    out.push(row([d.toISOString().slice(0, 10)], [visits, Math.round(visits * 0.82)]));
  }
  return out;
};

/** Ответ на запрос к API: { status, body }. */
const fakeMetrikaResponse = (input) => {
  const url = new URL(String(input));
  if (url.pathname.endsWith('/goals')) return { status: 200, body: { goals: GOALS } };
  if (!url.pathname.endsWith('/stat/v1/data')) return { status: 404, body: { message: 'Not found' } };

  const q = url.searchParams;
  const metrics = (q.get('metrics') || '').split(',');
  const dimension = q.get('dimensions');
  // Предыдущий период делаем немного меньше, чтобы было видно сравнение.
  const scale = q.get('date2') < new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10) ? 0.78 : 1;

  if (metrics[0] === 'ym:s:ecommercePurchases') return { status: 200, body: { data: [], totals: [0, 0] } };
  if (dimension === 'ym:s:date') return { status: 200, body: { data: daily(q.get('date1'), q.get('date2')) } };
  if (dimension === 'ym:s:hour') return { status: 200, body: { data: HOURS.map((v, h) => row([`${String(h).padStart(2, '0')}:00`], [v])) } };
  if (dimension) return { status: 200, body: { data: (TABLES[dimension] || []).map((r) => ({ ...r, metrics: r.metrics.slice(0, metrics.length) })) } };

  if (metrics[0] === 'ym:s:visits') {
    return { status: 200, body: { data: [], totals: [2740 * scale, 2150 * scale, 7840 * scale, 32.6, 151, 2.86, 71.4] } };
  }
  // Цели: пары reaches / conversionRate.
  const reaches = { 101: 138, 102: 96, 103: 61, 104: 22, 105: 9 };
  const totals = metrics.map((m) => {
    const id = Number(m.match(/goal(\d+)/)?.[1]);
    return m.endsWith('reaches') ? Math.round((reaches[id] || 0) * scale) : ((reaches[id] || 0) / 2740) * 100;
  });
  return { status: 200, body: { data: [], totals } };
};

/** fetch-совместимая обёртка для createClient({ fetchImpl }). */
const fakeFetch = async (input) => {
  const { status, body } = fakeMetrikaResponse(input);
  return { ok: status < 400, status, json: async () => body };
};

module.exports = { fakeFetch, fakeMetrikaResponse };
