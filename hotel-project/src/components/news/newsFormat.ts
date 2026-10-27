import { STATIC_BASE } from '../http';

export interface NewsCategory { key: string; label: string }

export interface NewsPageSettings {
  title: string;
  lead: string;
  categories: NewsCategory[];
  showFeatured: boolean;
  perPage: number;
  cta: { enabled: boolean; title: string; text: string; buttonLabel: string; href: string };
  seoTitle: string;
  seoDescription: string;
}

export const NEWS_PAGE_PATH = '/News';

export const defaultNewsSettings: NewsPageSettings = {
  title: 'Что нового на Террасах',
  lead: 'Новости отеля, винодельни и ресторана: сезоны, события и открытия.',
  categories: [
    { key: 'hotel', label: 'Отель' },
    { key: 'winery', label: 'Винодельня' },
    { key: 'restaurant', label: 'Ресторан' },
    { key: 'events', label: 'События' },
  ],
  showFeatured: true,
  perPage: 6,
  cta: { enabled: true, title: 'Приезжайте на Террасы', text: 'Выберите номер и забронируйте отдых среди виноградников.', buttonLabel: 'Выбрать номер', href: '/Hotel' },
  seoTitle: '',
  seoDescription: '',
};

/** Склеивает настройки из базы с запасными значениями — страница работает и без сохранённых настроек. */
export const mergeNewsSettings = (raw: unknown): NewsPageSettings => {
  const src = (typeof raw === 'object' && raw !== null ? raw : {}) as Partial<NewsPageSettings>;
  const categories = Array.isArray(src.categories) && src.categories.length
    ? src.categories.filter((c) => c && typeof c.key === 'string' && typeof c.label === 'string')
    : defaultNewsSettings.categories;
  const perPage = Number(src.perPage);
  return {
    ...defaultNewsSettings,
    ...src,
    categories,
    perPage: Number.isFinite(perPage) && perPage >= 3 && perPage <= 24 ? Math.round(perPage) : defaultNewsSettings.perPage,
    cta: { ...defaultNewsSettings.cta, ...(src.cta || {}) },
  };
};

export const categoryLabel = (categories: NewsCategory[], key: string) =>
  categories.find((c) => c.key === key)?.label || key;

export const formatNewsDate = (iso: string | null | undefined) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const formatReadingTime = (minutes: number) => {
  const n = Math.max(1, Math.round(minutes || 1));
  const mod10 = n % 10;
  const mod100 = n % 100;
  const word = mod10 === 1 && mod100 !== 11 ? 'минута' : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'минуты' : 'минут';
  return `${n} ${word}`;
};

/** Картинки лежат на backend: в режиме разработки им нужен полный адрес. */
export const mediaSrc = (url: string | null | undefined) =>
  url && url.startsWith('/static/') ? `${STATIC_BASE}${url}` : url || '';

/** То же самое для картинок внутри HTML статьи. */
export const withStaticBase = (html: string) =>
  STATIC_BASE ? html.replace(/(<img[^>]*\ssrc=")(\/static\/)/g, `$1${STATIC_BASE}$2`) : html;
