// Получаем базовый URL API из переменной окружения
const API_BASE = (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : 'http://localhost:5001').replace(/\/+$/, '');

// Base URL for static files (images, videos, etc.)
// В Docker: используем ОТНОСИТЕЛЬНЫЕ пути (nginx проксирует /static/ на backend)
// Локально: статические файлы обслуживаются через backend на порту 5001
const STATIC_BASE = process.env.REACT_APP_API_URL !== undefined ? '' : 'http://localhost:5001';

/** CMS links must never execute a script or use a protocol-relative address. */
export const safeLinkUrl = (value: unknown, fallback = '#'): string => {
  if (typeof value !== 'string') return fallback;
  const url = value.trim();
  if (!url || /[\\\u0000-\u0020\u007f]/.test(url)) return fallback;
  if (/^\/(?!\/)/.test(url) || url.startsWith('#')) return url;
  if (/^(mailto:|tel:)/i.test(url)) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' && !parsed.username && !parsed.password) return parsed.href;
  } catch { /* Invalid URLs are not links. */ }
  return fallback;
};

// Debug logs
console.log('📦 contentHelpers: API_BASE =', API_BASE);
console.log('📦 contentHelpers: STATIC_BASE =', STATIC_BASE);

/**
 * Преобразует относительный путь к медиа-файлу в полный URL
 * Если путь уже является полным URL (начинается с http:// или https://), возвращает как есть
 * Если путь начинается с /static/, добавляет базовый URL API
 */
export const getMediaUrl = (path: string | File | null | undefined): string => {
  if (!path) return '';
  
  // Если это File объект, возвращаем пустую строку (обрабатывается отдельно)
  if (path instanceof File) return '';
  if (typeof path !== 'string') return '';
  if (path.startsWith('blob:')) return path;
  if (!/^https?:\/\//.test(path) && !/^\/(?!\/)/.test(path)) return '';
  if (/[\\\u0000-\u001f\u007f]/.test(path)) return '';
  
  // Если это уже полный URL, возвращаем как есть
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // ✅ Для относительных путей к static
  // В Docker (STATIC_BASE пустая): возвращаем относительный путь (nginx проксирует)
  // В разработке: добавляем полный URL backend
  if (path.startsWith('/static/')) {
    if (STATIC_BASE === '') {
      // Docker mode - nginx проксирует
      return path;
    }
    // Dev mode - прямой доступ к backend
    return `${STATIC_BASE}${path}`;
  }
  
  // Для всех остальных случаев возвращаем как есть
  return path;
};

export const getContentOrEmergency = <T>(apiContent: T | null | undefined, emergencyContent: T): T => {
  return apiContent ?? emergencyContent;
};

export const getImageOrEmergency = (apiImage: string | null | undefined, emergencyImage: string): string => {
  return apiImage && apiImage.trim() !== '' ? apiImage : emergencyImage;
};

export const getArrayOrEmergency = <T>(apiArray: T[] | null | undefined, emergencyArray: T[]): T[] => {
  return apiArray && apiArray.length > 0 ? apiArray : emergencyArray;
};

export interface ImageItem {
  src: string;
  alt: string;
}
