// src/utils/metrika.ts
/**
 * Яндекс Метрика. Номер счётчика задаётся при сборке (REACT_APP_YM_ID);
 * без него весь модуль молча выключен — удобно для локальной разработки.
 *
 * Счётчик загружается только после согласия посетителя на cookie (152-ФЗ).
 * Сайт — SPA, поэтому автоматический хит отключён (defer) и просмотры
 * отправляются вручную при каждой смене маршрута (см. MetrikaTracker).
 */

const COUNTER_ID = Number(process.env.REACT_APP_YM_ID) || 0;
const CONSENT_KEY = 'cookieConsent';
const TAG_URL = 'https://mc.yandex.ru/metrika/tag.js';

// Админку и вход не считаем: это не посетители сайта.
export const isPrivatePath = (pathname: string) => /^\/(admin|login)(\/|$)/i.test(pathname);

type ConsentState = 'accepted' | 'declined' | null;

export const isMetrikaConfigured = () => COUNTER_ID > 0;

export const getConsent = (): ConsentState => {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === 'accepted' || value === 'declined' ? value : null;
  } catch {
    return null;
  }
};

export const setConsent = (value: 'accepted' | 'declined') => {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // приватный режим: просто не запоминаем выбор
  }
  if (value === 'accepted') initMetrika();
};

const ym = (...args: unknown[]) => {
  const w = window as any;
  if (typeof w.ym === 'function') w.ym(COUNTER_ID, ...args);
};

let initialized = false;
let lastUrl = '';

export const initMetrika = () => {
  if (initialized || !isMetrikaConfigured() || getConsent() !== 'accepted') return;
  initialized = true;

  // Официальный загрузчик Метрики: очередь команд до загрузки tag.js.
  const w = window as any;
  w.ym = w.ym || function (...args: unknown[]) {
    (w.ym.a = w.ym.a || []).push(args);
  };
  w.ym.l = Date.now();

  const script = document.createElement('script');
  script.async = true;
  script.src = TAG_URL;
  document.head.appendChild(script);

  w.ym(COUNTER_ID, 'init', {
    defer: true,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });

  document.addEventListener('click', trackContactClick, true);
  hit(window.location.href, document.referrer);
};

export const hit = (url: string, referer?: string) => {
  if (!initialized || url === lastUrl) return;
  if (isPrivatePath(new URL(url, window.location.origin).pathname)) return;
  lastUrl = url;
  ym('hit', url, { title: document.title, referer });
};

/**
 * Цели. Их нужно один раз создать в интерфейсе Метрики с типом
 * «JavaScript-событие» и такими же идентификаторами.
 */
export const GOALS = {
  bookingOpen: 'booking_open',
  phoneClick: 'phone_click',
  emailClick: 'email_click',
  whatsappClick: 'whatsapp_click',
  telegramClick: 'telegram_click',
} as const;

export const reachGoal = (goal: (typeof GOALS)[keyof typeof GOALS], params?: Record<string, unknown>) => {
  if (!initialized || isPrivatePath(window.location.pathname)) return;
  ym('reachGoal', goal, params);
};

// Телефоны и ссылки на мессенджеры приходят из CMS, поэтому ловим клики
// делегированием, а не правкой каждого компонента.
const trackContactClick = (event: MouseEvent) => {
  const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
  if (!link) return;
  const href = link.getAttribute('href') || '';

  if (/^tel:/i.test(href)) reachGoal(GOALS.phoneClick);
  else if (/^mailto:/i.test(href)) reachGoal(GOALS.emailClick);
  else if (/(wa\.me|whatsapp\.com)/i.test(href)) reachGoal(GOALS.whatsappClick);
  else if (/(t\.me|telegram\.me)\//i.test(href)) reachGoal(GOALS.telegramClick);
};
