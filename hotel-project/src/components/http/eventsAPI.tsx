import { $authHost, $host } from './index';

export interface EventImageDto {
  url: string;
  alt_text?: string;
  order?: number;
}

export interface CreateUpdateEventDto {
  title?: string;
  description?: string;
  categoryId?: number;
  images?: Array<string | File | { url?: string; alt_text?: string; order?: number } | { src?: string | File; alt?: string }>;
}

const uploadIfFile = async (val: any, type: string = 'pages'): Promise<string> => {
  const isFile = val instanceof File || (val && val.constructor && val.constructor.name === 'File');
  if (!isFile) return String(val || '');
  const form = new FormData();
  form.append('file', val);
  form.append('type', type);
  const { data } = await $authHost.post('api/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.url as string;
};

// Normalize incoming mixed images into EventImageDto[]
const normalizeImages = async (images: CreateUpdateEventDto['images']): Promise<EventImageDto[]> => {
  const arr = Array.isArray(images) ? images : [];
  const out: EventImageDto[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i] as any;
    let url = '';
    let alt_text: string | undefined;
    if (item instanceof File) {
      url = await uploadIfFile(item);
      alt_text = item.name;
    } else if (typeof item === 'string') {
      // ✅ ФИЛЬТРУЕМ blob URLs! Они не работают на других устройствах
      if (item.startsWith('blob:')) {
        console.warn('⚠️ Skipping blob URL (not valid for other devices):', item);
        continue; // Пропускаем blob URLs
      }
      url = item;
    } else if (item && typeof item === 'object') {
      if (item.url) {
        // ✅ ФИЛЬТРУЕМ blob URLs!
        if (typeof item.url === 'string' && item.url.startsWith('blob:')) {
          console.warn('⚠️ Skipping blob URL from object (not valid for other devices):', item.url);
          continue;
        }
        url = item.url;
      }
      if (!url && item.src instanceof File) url = await uploadIfFile(item.src);
      if (!url && typeof item.src === 'string') {
        // ✅ ФИЛЬТРУЕМ blob URLs!
        if (item.src.startsWith('blob:')) {
          console.warn('⚠️ Skipping blob URL from object.src (not valid for other devices):', item.src);
          continue;
        }
        url = item.src;
      }
      alt_text = item.alt_text || item.alt;
    }
    if (url) out.push({ url, alt_text, order: typeof item?.order === 'number' ? item.order : i });
  }
  console.log('📸 Events images to save:', out);
  return out;
};

export const getCategories = async () => {
  const { data } = await $host.get('api/events/categories');
  return data;
};

export const updateCategory = async (id: number, payload: { header?: string; description?: string }) => {
  const { data } = await $authHost.put(`api/events/categories/${id}`, payload);
  return data;
};

export const getEvents = async (categoryId?: number) => {
  const qp = categoryId ? `?categoryId=${categoryId}` : '';
  const { data } = await $host.get(`api/events${qp}`);
  return data;
};

export const getEventById = async (id: number) => {
  const { data } = await $host.get(`api/events/${id}`);
  return data;
};

export const createEvent = async (payload: CreateUpdateEventDto & { title: string; categoryId: number }) => {
  const images = await normalizeImages(payload.images);
  const { data } = await $authHost.post('api/events', {
    title: payload.title,
    description: payload.description || '',
    categoryId: payload.categoryId,
    images
  });
  return data;
};

export const updateEvent = async (id: number, payload: CreateUpdateEventDto) => {
  const body: any = {
    title: payload.title,
    description: payload.description,
    categoryId: payload.categoryId
  };
  // ⚠️ КРИТИЧНО: Отправляем images ТОЛЬКО если есть валидные изображения после фильтрации
  if (payload.images) {
    const normalized = await normalizeImages(payload.images);
    if (normalized.length > 0) {
      body.images = normalized;
    } else {
      console.warn('⚠️ All event images were blob URLs and filtered out. NOT sending images field to preserve existing photos in DB.');
    }
  }
  const { data } = await $authHost.put(`api/events/${id}`, body);
  return data;
};

export const deleteEvent = async (id: number) => {
  const { data } = await $authHost.delete(`api/events/${id}`);
  return data;
};


