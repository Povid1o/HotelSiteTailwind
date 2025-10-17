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
      url = item;
    } else if (item && typeof item === 'object') {
      if (item.url) url = item.url;
      if (!url && item.src instanceof File) url = await uploadIfFile(item.src);
      if (!url && typeof item.src === 'string') url = item.src;
      alt_text = item.alt_text || item.alt;
    }
    if (url) out.push({ url, alt_text, order: typeof item?.order === 'number' ? item.order : i });
  }
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
  if (payload.images) body.images = await normalizeImages(payload.images);
  const { data } = await $authHost.put(`api/events/${id}`, body);
  return data;
};

export const deleteEvent = async (id: number) => {
  const { data } = await $authHost.delete(`api/events/${id}`);
  return data;
};


