/**
 * Сводка Яндекс Метрики для раздела «Аналитика» в админке.
 *
 * Сервер ходит в Reporting API сам: OAuth-токен никогда не попадает в браузер.
 * Метрика разрешает не больше трёх параллельных запросов, поэтому они идут
 * через небольшой пул, а готовая сводка кешируется на несколько минут.
 */

const API_BASE = (process.env.YM_API_BASE || 'https://api-metrika.yandex.net').replace(/\/+$/, '');
const CACHE_TTL_MS = 10 * 60 * 1000;
// Кнопка «Обновить» не должна позволять выжечь дневную квоту API.
const MIN_REFRESH_MS = 60 * 1000;
const PARALLEL_REQUESTS = 3;
const BOOKING_GOAL = 'booking_open';

// Цели, которые отправляет сайт (hotel-project/src/utils/metrika.ts).
const SITE_GOALS = {
  booking_open: 'Открыли бронирование',
  phone_click: 'Клик по телефону',
  email_click: 'Клик по почте',
  whatsapp_click: 'Переход в WhatsApp',
  telegram_click: 'Переход в Telegram',
};

class MetrikaError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const getConfig = () => ({
  counterId: String(process.env.YM_ID || '').trim(),
  token: String(process.env.YM_TOKEN || '').trim(),
});

const isConfigured = () => {
  const { counterId, token } = getConfig();
  return /^\d+$/.test(counterId) && token.length > 0;
};

// Даты считаем по Москве: в этом часовом поясе живёт счётчик отеля.
const moscowDate = (date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

const periodDates = (days, now = new Date()) => {
  const dayMs = 24 * 60 * 60 * 1000;
  return {
    from: moscowDate(new Date(now.getTime() - (days - 1) * dayMs)),
    to: moscowDate(now),
    previousFrom: moscowDate(new Date(now.getTime() - (2 * days - 1) * dayMs)),
    previousTo: moscowDate(new Date(now.getTime() - days * dayMs)),
  };
};

const createPool = (size) => {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active >= size || !queue.length) return;
    active += 1;
    const { task, resolve, reject } = queue.shift();
    task().then(resolve, reject).finally(() => { active -= 1; next(); });
  };
  return (task) => new Promise((resolve, reject) => { queue.push({ task, resolve, reject }); next(); });
};

const createClient = ({ counterId, token, fetchImpl = fetch }) => {
  const run = createPool(PARALLEL_REQUESTS);

  const request = (path, params = {}) => run(async () => {
    const url = new URL(`${API_BASE}${path}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
    });
    const response = await fetchImpl(url, { headers: { Authorization: `OAuth ${token}` } });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = body?.errors?.[0]?.message || body?.message || `HTTP ${response.status}`;
      if (response.status === 401 || response.status === 403) {
        throw new MetrikaError(502, `Метрика отклонила токен: ${detail}`);
      }
      if (response.status === 429) {
        throw new MetrikaError(503, 'Метрика временно ограничила число запросов. Попробуйте через минуту.');
      }
      throw new MetrikaError(502, `Ошибка Метрики: ${detail}`);
    }
    return body;
  });

  const stat = (params) => request('/stat/v1/data', { ids: counterId, lang: 'ru', accuracy: 'full', ...params });
  const goals = () => request(`/management/v1/counter/${counterId}/goals`);
  return { stat, goals };
};

// ---------- разбор ответов ----------

const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
const round = (value, digits = 1) => Math.round(num(value) * 10 ** digits) / 10 ** digits;
const rows = (report) => (Array.isArray(report?.data) ? report.data : []);
const label = (row, index = 0) => row?.dimensions?.[index]?.name ?? 'Не определено';

const TOTAL_METRICS = [
  'ym:s:visits', 'ym:s:users', 'ym:s:pageviews', 'ym:s:bounceRate',
  'ym:s:avgVisitDurationSeconds', 'ym:s:pageDepth', 'ym:s:percentNewVisitors',
];
const parseTotals = (report) => {
  const t = report?.totals || [];
  return {
    visits: num(t[0]),
    users: num(t[1]),
    pageviews: num(t[2]),
    bounceRate: round(t[3]),
    avgDuration: Math.round(num(t[4])),
    pageDepth: round(t[5], 2),
    newVisitorsShare: round(t[6]),
  };
};

/**
 * Цели сайта находим по идентификатору JS-события; остальные цели счётчика
 * (если их создали вручную) тоже показываем, но после наших.
 */
const pickGoals = (list) => {
  const goals = (Array.isArray(list?.goals) ? list.goals : []).map((goal) => {
    const identifier = (goal.conditions || []).map((c) => c.url).find((url) => SITE_GOALS[url]) || null;
    return { id: goal.id, name: identifier ? SITE_GOALS[identifier] : goal.name, identifier };
  });
  const order = Object.keys(SITE_GOALS);
  return goals
    .sort((a, b) => {
      const ai = a.identifier ? order.indexOf(a.identifier) : order.length;
      const bi = b.identifier ? order.indexOf(b.identifier) : order.length;
      return ai - bi;
    })
    .slice(0, 10); // в одном запросе Метрики не больше 20 метрик: по две на цель
};

// ---------- выводы для гипотез ----------

const fmtPct = (value) => `${String(round(value)).replace('.', ',')}%`;
const share = (part, total) => (total > 0 ? (part / total) * 100 : 0);

/**
 * Простые правила поверх цифр. Это не готовые ответы, а подсказки, куда
 * посмотреть и что проверить: каждая формулирует наблюдение и гипотезу.
 */
const buildInsights = (d) => {
  const out = [];
  const total = d.totals.visits;
  const minVisits = Math.max(20, total * 0.03);

  if (total < 50) {
    out.push({
      tone: 'info',
      title: 'Пока мало данных',
      text: `За период ${total} визитов. Выводы станут надёжными примерно от 300–500 визитов — попробуйте период подлиннее.`,
    });
    return out;
  }

  const prev = d.previous.visits;
  if (prev >= 30) {
    const change = share(total - prev, prev);
    if (Math.abs(change) >= 15) {
      out.push({
        tone: change > 0 ? 'positive' : 'warning',
        title: change > 0 ? `Визитов больше на ${fmtPct(change)}` : `Визитов меньше на ${fmtPct(-change)}`,
        text: 'По сравнению с предыдущим таким же периодом.',
        hypothesis: change > 0
          ? 'Посмотрите в «Источниках», какой канал дал прирост, — его стоит усилить.'
          : 'Проверьте, не просел ли один конкретный источник (реклама, поиск) и не связано ли это с сезоном.',
      });
    }
  }

  const booking = d.goals.find((g) => g.identifier === BOOKING_GOAL);

  const devices = d.devices.filter((x) => x.visits >= minVisits);
  if (devices.length >= 2) {
    const sorted = [...devices].sort((a, b) => b.bounceRate - a.bounceRate);
    const worst = sorted[0];
    const best = sorted[sorted.length - 1];
    if (worst.bounceRate - best.bounceRate >= 10) {
      out.push({
        tone: 'warning',
        title: `${worst.name}: отказов ${fmtPct(worst.bounceRate)} против ${fmtPct(best.bounceRate)}`,
        text: `На устройствах «${worst.name}» посетители уходят сразу заметно чаще, чем на «${best.name}».`,
        hypothesis: 'Проверьте первый экран и скорость загрузки на этом типе устройств — возможно, что-то не помещается или долго грузится.',
      });
    }
  }
  const mobile = d.devices.find((x) => /смартфон/i.test(x.name));
  if (mobile && share(mobile.visits, total) >= 60) {
    out.push({
      tone: 'info',
      title: `${fmtPct(share(mobile.visits, total))} визитов — со смартфонов`,
      text: 'Большинство гостей смотрят сайт с телефона.',
      hypothesis: 'Любые изменения дизайна в первую очередь проверяйте на телефоне; кнопка бронирования должна быть видна без прокрутки.',
    });
  }

  if (booking && booking.conversionRate > 0) {
    const sources = d.sources.filter((s) => s.visits >= minVisits && s.bookingRate !== null);
    if (sources.length >= 2) {
      const best = [...sources].sort((a, b) => b.bookingRate - a.bookingRate)[0];
      if (best.bookingRate >= booking.conversionRate * 1.5) {
        out.push({
          tone: 'positive',
          title: `«${best.name}» конвертирует лучше всего`,
          text: `${fmtPct(best.bookingRate)} визитов из этого источника открывают бронирование при среднем ${fmtPct(booking.conversionRate)}.`,
          hypothesis: 'Этот канал приводит самых заинтересованных гостей — проверьте, можно ли получать из него больше трафика.',
        });
      }
      const weak = sources.find((s) => share(s.visits, total) >= 20 && s.bookingRate <= booking.conversionRate * 0.5);
      if (weak) {
        out.push({
          tone: 'warning',
          title: `«${weak.name}»: много визитов, мало бронирований`,
          text: `${fmtPct(share(weak.visits, total))} трафика, но бронирование открывают только ${fmtPct(weak.bookingRate)}.`,
          hypothesis: 'Возможно, эти посетители приходят не за проживанием (ресторан, вино, мероприятия) или попадают на страницу без понятного следующего шага.',
        });
      }
    }
  }

  const leaky = d.entryPages
    .filter((p) => p.visits >= minVisits && share(p.visits, total) >= 5 && p.bounceRate >= 45)
    .sort((a, b) => b.visits * b.bounceRate - a.visits * a.bounceRate)[0];
  if (leaky) {
    out.push({
      tone: 'warning',
      title: `Страница входа ${leaky.path}: отказов ${fmtPct(leaky.bounceRate)}`,
      text: `С неё начинается ${fmtPct(share(leaky.visits, total))} визитов, и многие уходят, ничего не сделав.`,
      hypothesis: 'Проверьте, совпадает ли первый экран с тем, что человек искал, и есть ли на нём явный следующий шаг.',
    });
  }

  const contactReaches = d.goals
    .filter((g) => ['phone_click', 'whatsapp_click', 'telegram_click'].includes(g.identifier))
    .reduce((sum, g) => sum + g.reaches, 0);
  if (booking && contactReaches >= 10 && contactReaches > booking.reaches) {
    out.push({
      tone: 'info',
      title: 'Звонят и пишут чаще, чем открывают бронирование',
      text: `Контакты: ${contactReaches}, открытий бронирования: ${booking.reaches}.`,
      hypothesis: 'Гостям может не хватать информации или уверенности для онлайн-брони. Стоит спросить у администраторов, какие вопросы задают чаще всего, и ответить на них на сайте.',
    });
  }

  const peak = [...d.hours].sort((a, b) => b.visits - a.visits)[0];
  if (peak && peak.visits > 0) {
    out.push({
      tone: 'info',
      title: `Пик посещаемости — ${String(peak.hour).padStart(2, '0')}:00–${String((peak.hour + 1) % 24).padStart(2, '0')}:00`,
      text: 'В этот час на сайт заходят чаще всего.',
      hypothesis: 'Публикации, рассылки и показ рекламы лучше приурочить к этому времени.',
    });
  }

  return out;
};

// ---------- сборка сводки ----------

const fetchDashboard = async (client, days, now = new Date()) => {
  const p = periodDates(days, now);
  const period = { date1: p.from, date2: p.to };

  const goalList = pickGoals(await client.goals());
  const bookingGoal = goalList.find((g) => g.identifier === BOOKING_GOAL);
  const withBooking = (metrics) => (bookingGoal ? `${metrics},ym:s:goal${bookingGoal.id}conversionRate` : metrics);
  const bookingRate = (row, index) => (bookingGoal ? round(row.metrics[index]) : null);
  const goalMetrics = goalList.flatMap((g) => [`ym:s:goal${g.id}reaches`, `ym:s:goal${g.id}conversionRate`]).join(',');

  const [
    totals, previous, daily, sources, entryPages, pages, devices, cities, hours, goalsNow, goalsBefore, ecommerce,
  ] = await Promise.all([
    client.stat({ ...period, metrics: TOTAL_METRICS.join(',') }),
    client.stat({ date1: p.previousFrom, date2: p.previousTo, metrics: TOTAL_METRICS.join(',') }),
    client.stat({ ...period, dimensions: 'ym:s:date', metrics: 'ym:s:visits,ym:s:users', sort: 'ym:s:date', limit: 400 }),
    client.stat({ ...period, dimensions: 'ym:s:lastTrafficSource', metrics: withBooking('ym:s:visits,ym:s:bounceRate,ym:s:avgVisitDurationSeconds'), sort: '-ym:s:visits', limit: 10 }),
    client.stat({ ...period, dimensions: 'ym:s:startURLPath', metrics: withBooking('ym:s:visits,ym:s:bounceRate,ym:s:avgVisitDurationSeconds'), sort: '-ym:s:visits', limit: 10 }),
    client.stat({ ...period, dimensions: 'ym:pv:URLPath', metrics: 'ym:pv:pageviews,ym:pv:users', sort: '-ym:pv:pageviews', limit: 10 }),
    client.stat({ ...period, dimensions: 'ym:s:deviceCategory', metrics: withBooking('ym:s:visits,ym:s:bounceRate'), sort: '-ym:s:visits', limit: 5 }),
    client.stat({ ...period, dimensions: 'ym:s:regionCity', metrics: 'ym:s:visits', sort: '-ym:s:visits', limit: 10 }),
    client.stat({ ...period, dimensions: 'ym:s:hour', metrics: 'ym:s:visits', sort: 'ym:s:hour', limit: 24 }),
    goalMetrics ? client.stat({ ...period, metrics: goalMetrics }) : null,
    goalMetrics ? client.stat({ date1: p.previousFrom, date2: p.previousTo, metrics: goalMetrics }) : null,
    // Бронирования TravelLine приходят электронной коммерцией, только если она
    // включена в счётчике и в TravelLine. Без неё сводка работает и так.
    client.stat({ ...period, metrics: 'ym:s:ecommercePurchases,ym:s:ecommerceRevenue' }).catch(() => null),
  ]);

  const hourVisits = new Array(24).fill(0);
  rows(hours).forEach((row) => {
    const hour = Number.parseInt(label(row), 10);
    if (hour >= 0 && hour < 24) hourVisits[hour] = num(row.metrics[0]);
  });

  const dashboard = {
    configured: true,
    period: { days, from: p.from, to: p.to, previousFrom: p.previousFrom, previousTo: p.previousTo },
    generatedAt: now.toISOString(),
    totals: parseTotals(totals),
    previous: parseTotals(previous),
    daily: rows(daily).map((row) => ({ date: label(row), visits: num(row.metrics[0]), users: num(row.metrics[1]) })),
    sources: rows(sources).map((row) => ({
      name: label(row), visits: num(row.metrics[0]), bounceRate: round(row.metrics[1]),
      avgDuration: Math.round(num(row.metrics[2])), bookingRate: bookingRate(row, 3),
    })),
    entryPages: rows(entryPages).map((row) => ({
      path: label(row), visits: num(row.metrics[0]), bounceRate: round(row.metrics[1]),
      avgDuration: Math.round(num(row.metrics[2])), bookingRate: bookingRate(row, 3),
    })),
    pages: rows(pages).map((row) => ({ path: label(row), pageviews: num(row.metrics[0]), users: num(row.metrics[1]) })),
    devices: rows(devices).map((row) => ({
      name: label(row), visits: num(row.metrics[0]), bounceRate: round(row.metrics[1]), bookingRate: bookingRate(row, 2),
    })),
    cities: rows(cities).map((row) => ({ name: label(row), visits: num(row.metrics[0]) })),
    hours: hourVisits.map((visits, hour) => ({ hour, visits })),
    goals: goalList.map((goal, i) => ({
      ...goal,
      reaches: num(goalsNow?.totals?.[i * 2]),
      conversionRate: round(goalsNow?.totals?.[i * 2 + 1], 2),
      previousReaches: num(goalsBefore?.totals?.[i * 2]),
    })),
    ecommerce: ecommerce && num(ecommerce.totals?.[0]) > 0
      ? { purchases: num(ecommerce.totals[0]), revenue: Math.round(num(ecommerce.totals[1])) }
      : null,
  };
  dashboard.insights = buildInsights(dashboard);
  return dashboard;
};

const cache = new Map();

const getDashboard = async (days, { refresh = false } = {}) => {
  if (!isConfigured()) return { configured: false };
  const { counterId, token } = getConfig();
  const key = `${counterId}:${days}`;
  const cached = cache.get(key);
  const age = cached ? Date.now() - cached.at : Infinity;
  if (cached && (age < (refresh ? MIN_REFRESH_MS : CACHE_TTL_MS))) return cached.data;

  const data = { ...(await fetchDashboard(createClient({ counterId, token }), days)), counterId };
  cache.set(key, { at: Date.now(), data });
  return data;
};

module.exports = {
  MetrikaError,
  SITE_GOALS,
  buildInsights,
  createClient,
  fetchDashboard,
  getDashboard,
  periodDates,
  pickGoals,
};
