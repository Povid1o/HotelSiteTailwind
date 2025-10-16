// Получаем базовый URL API из переменной окружения
const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5001').replace(/\/+$/, '');

/**
 * Преобразует относительный путь к медиа-файлу в полный URL
 * Если путь уже является полным URL (начинается с http:// или https://), возвращает как есть
 * Если путь начинается с /static/, добавляет базовый URL API
 */
export const getMediaUrl = (path: string | File | null | undefined): string => {
  if (!path) return '';
  
  // Если это File объект, возвращаем пустую строку (обрабатывается отдельно)
  if (path instanceof File) return '';
  
  // Если это уже полный URL, возвращаем как есть
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Если это относительный путь к static, добавляем базовый URL
  if (path.startsWith('/static/')) {
    return `${API_BASE}${path}`;
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
