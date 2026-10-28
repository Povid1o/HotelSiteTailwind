import { getMediaUrl } from '../../utils/contentHelpers';

/** Помощники для чтения содержимого страниц: в базе может лежать что угодно, страница не должна падать. */
export type Rec = Record<string, any>;

export const rec = (value: unknown): Rec =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Rec) : {};

export const list = (value: unknown): Rec[] =>
  Array.isArray(value) ? value.filter((item) => typeof item === 'object' && item !== null) : [];

/** Строка из базы; пустая или из пробелов считается незаполненной и заменяется запасным значением. */
export const txt = (value: unknown, fallback = ''): string => (typeof value === 'string' && value.trim() ? value.trim() : fallback);

/** Текст «по одному пункту в строке» → массив непустых строк. */
export const lines = (value: unknown): string[] =>
  typeof value === 'string' ? value.split('\n').map((line) => line.trim()).filter(Boolean) : [];

export const media = (value: unknown, fallback = ''): string =>
  value && !(value instanceof File) ? getMediaUrl(value as string) || fallback : fallback;

export const pad = (n: number) => (n < 10 ? `0${n}` : String(n));

/** Находит страницу по пути или названию. */
export const findPage = (pages: any[], path: string, name: string): Rec => {
  const page = pages.find((item) => item.path === path || item.name === name);
  return rec(page?.content);
};

/** Цвет «ягоды» на карточке сорта — по типу вина. */
export const GRAPE_COLORS: Record<string, string> = {
  Белое: '#C9C98A',
  Красное: '#5A2E4E',
  Розовое: '#D98F8F',
  Игристое: '#E3D7A4',
};

/** Адрес для карты разрешаем только с известных сервисов — иначе в iframe можно подставить что угодно. */
export const safeMapUrl = (value: unknown): string => {
  const url = txt(value);
  return /^https:\/\/(yandex\.(ru|com)\/map-widget\/|www\.google\.com\/maps\/embed|www\.openstreetmap\.org\/export\/embed)/.test(url) ? url : '';
};
