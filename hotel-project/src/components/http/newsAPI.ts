import { $authHost, $host } from './index';

export interface NewsListItem {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  coverUrl: string;
  coverAlt: string;
  tags: string[];
  publishedAt: string | null;
  readingMinutes: number;
}

export interface NewsArticleData extends NewsListItem {
  contentHtml: string;
  seoTitle: string;
  seoDescription: string;
  related: NewsListItem[];
}

export type NewsStatus = 'draft' | 'published';

export interface AdminNewsItem extends NewsListItem {
  status: NewsStatus;
  /** Опубликована, но дата публикации ещё не наступила. */
  scheduled: boolean;
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
  createdAt: string;
  wordCount: number;
  contentJson?: Record<string, unknown>;
  contentHtml?: string;
}

export interface NewsPayload {
  title: string;
  category: string;
  excerpt: string;
  cover_url: string;
  cover_alt: string;
  tags: string[];
  status: NewsStatus;
  published_at: string | null;
  seo_title: string;
  seo_description: string;
  content_json: Record<string, unknown>;
  content_html: string;
}

// ---------- публичные ----------

export const getNews = async (params: { category?: string; limit?: number; offset?: number } = {}) => {
  const { data } = await $host.get<{ items: NewsListItem[]; total: number }>('api/news', { params });
  return data;
};

export const getNewsBySlug = async (slug: string) => {
  const { data } = await $host.get<NewsArticleData>(`api/news/${encodeURIComponent(slug)}`);
  return data;
};

// ---------- админка ----------

export const adminGetNewsList = async () => {
  const { data } = await $authHost.get<AdminNewsItem[]>('api/news/admin');
  return data;
};

export const adminGetNews = async (id: number) => {
  const { data } = await $authHost.get<AdminNewsItem>(`api/news/admin/${id}`);
  return data;
};

export const adminCreateNews = async (payload: NewsPayload) => {
  const { data } = await $authHost.post<AdminNewsItem>('api/news/admin', payload);
  return data;
};

export const adminUpdateNews = async (id: number, payload: NewsPayload) => {
  const { data } = await $authHost.put<AdminNewsItem>(`api/news/admin/${id}`, payload);
  return data;
};

export const adminDeleteNews = async (id: number) => {
  const { data } = await $authHost.delete(`api/news/admin/${id}`);
  return data;
};

/** Загружает изображение в папку новостей и возвращает путь вида /static/news/xxx.jpg. */
export const uploadNewsImage = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append('file', file);
  form.append('type', 'news');
  const { data } = await $authHost.post('api/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.url as string;
};
