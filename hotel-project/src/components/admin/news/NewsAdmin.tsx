import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import type { JSONContent } from '@tiptap/react';
import { Context } from '../../../index';
import {
  AdminNewsItem, NewsPayload, NewsStatus,
  adminCreateNews, adminDeleteNews, adminGetNews, adminGetNewsList, adminUpdateNews, uploadNewsImage,
} from '../../http/newsAPI';
import {
  NEWS_PAGE_PATH, NewsPageSettings, categoryLabel, formatNewsDate, mediaSrc, mergeNewsSettings,
} from '../../news/newsFormat';
import NewsEditor, { EditorChange } from './NewsEditor';
import NewsPageSettingsForm from './NewsPageSettingsForm';
import { checkNewsImage, uploadErrorText } from './newsExtensions';

interface Form {
  title: string;
  category: string;
  publishedAt: string; // значение для input[type=datetime-local]
  status: NewsStatus;
  coverUrl: string;
  coverAlt: string;
  excerpt: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  contentJson: JSONContent | null;
  contentHtml: string;
}

type Filter = 'all' | 'published' | 'draft' | 'scheduled';
type Notice = { kind: 'ok' | 'error'; text: string } | null;

const pad = (n: number) => String(n).padStart(2, '0');
const toLocalInput = (iso: string | null | undefined) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const fromLocalInput = (value: string) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

const emptyForm = (category: string): Form => ({
  title: '', category, publishedAt: '', status: 'draft', coverUrl: '', coverAlt: '', excerpt: '',
  tags: [], seoTitle: '', seoDescription: '', contentJson: null, contentHtml: '',
});

const formFromItem = (item: AdminNewsItem): Form => ({
  title: item.title,
  category: item.category,
  publishedAt: toLocalInput(item.publishedAt),
  status: item.status,
  coverUrl: item.coverUrl || '',
  coverAlt: item.coverAlt || '',
  excerpt: item.excerpt || '',
  tags: item.tags || [],
  seoTitle: item.seoTitle || '',
  seoDescription: item.seoDescription || '',
  contentJson: (item.contentJson as JSONContent) || null,
  contentHtml: item.contentHtml || '',
});

const statusOf = (item: Pick<AdminNewsItem, 'status' | 'scheduled'>) =>
  item.status === 'draft' ? { key: 'draft', label: 'Черновик' }
    : item.scheduled ? { key: 'scheduled', label: 'Запланировано' }
      : { key: 'published', label: 'Опубликовано' };

const errorMessage = (e: any, fallback: string) => {
  const data = e?.response?.data;
  return data?.message || (typeof data === 'string' ? data : '') || fallback;
};

const NewsAdmin = observer(() => {
  const context = useContext(Context);
  if (!context) throw new Error('NewsAdmin must be used within Context Provider');
  const { pageContent } = context;

  const [tab, setTab] = useState<'news' | 'page'>('news');
  const [items, setItems] = useState<AdminNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const [selected, setSelected] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [opening, setOpening] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [tagDraft, setTagDraft] = useState('');
  const [coverBusy, setCoverBusy] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const editorSectionRef = useRef<HTMLElement>(null);

  const newsPage = pageContent.pages.find((p) => p.path === NEWS_PAGE_PATH);
  const rawSettings = newsPage && typeof newsPage.content === 'object' && newsPage.content
    ? (newsPage.content as Record<string, unknown>).newsPage
    : undefined;
  const settings = useMemo(() => mergeNewsSettings(rawSettings), [rawSettings]);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      setItems(await adminGetNewsList());
    } catch (e: any) {
      setLoadError(errorMessage(e, 'Не удалось загрузить новости.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  // Предупреждаем, если пытаются закрыть вкладку с несохранённым текстом.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const confirmDiscard = () => !dirty || window.confirm('Есть несохранённые изменения. Закрыть без сохранения?');

  const scrollToEditor = () => {
    window.setTimeout(() => editorSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const startNew = () => {
    if (!confirmDiscard()) return;
    setTab('news');
    setForm(emptyForm(settings.categories[0]?.key || ''));
    setSelected('new');
    setDirty(false);
    setNotice(null);
    setEditorKey((k) => k + 1);
    scrollToEditor();
  };

  const openItem = async (id: number) => {
    if (id === selected) { scrollToEditor(); return; }
    if (!confirmDiscard()) return;
    setOpening(true);
    setNotice(null);
    try {
      const item = await adminGetNews(id);
      setForm(formFromItem(item));
      setSelected(id);
      setDirty(false);
      setEditorKey((k) => k + 1);
      scrollToEditor();
    } catch (e: any) {
      setNotice({ kind: 'error', text: errorMessage(e, 'Не удалось открыть новость.') });
    } finally {
      setOpening(false);
    }
  };

  const closeEditor = () => {
    if (!confirmDiscard()) return;
    setSelected(null);
    setForm(null);
    setDirty(false);
    setNotice(null);
  };

  const patch = (changes: Partial<Form>) => {
    setForm((f) => (f ? { ...f, ...changes } : f));
    setDirty(true);
  };

  const onEditorChange = useCallback((change: EditorChange) => {
    setForm((f) => (f ? { ...f, contentJson: change.json, contentHtml: change.html } : f));
    setDirty(true);
  }, []);

  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/^#/, '').slice(0, 30);
    if (!form || !tag || form.tags.includes(tag) || form.tags.length >= 10) { setTagDraft(''); return; }
    patch({ tags: [...form.tags, tag] });
    setTagDraft('');
  };

  const uploadCover = async (file?: File) => {
    if (!file) return;
    const problem = checkNewsImage(file);
    if (problem) { setNotice({ kind: 'error', text: problem }); return; }
    setCoverBusy(true);
    try {
      patch({ coverUrl: await uploadNewsImage(file) });
    } catch (e: any) {
      setNotice({ kind: 'error', text: uploadErrorText(e) });
    } finally {
      setCoverBusy(false);
      if (coverRef.current) coverRef.current.value = '';
    }
  };

  const save = async (status: NewsStatus) => {
    if (!form) return;
    if (!form.title.trim()) {
      setNotice({ kind: 'error', text: 'Введите заголовок новости.' });
      titleRef.current?.focus();
      return;
    }
    const payload: NewsPayload = {
      title: form.title.trim(),
      category: form.category,
      excerpt: form.excerpt.trim(),
      cover_url: form.coverUrl,
      cover_alt: form.coverAlt.trim(),
      tags: form.tags,
      status,
      published_at: fromLocalInput(form.publishedAt),
      seo_title: form.seoTitle.trim(),
      seo_description: form.seoDescription.trim(),
      content_json: (form.contentJson || {}) as Record<string, unknown>,
      content_html: form.contentHtml,
    };
    setSaving(true);
    setNotice(null);
    try {
      const saved = selected === 'new' || selected === null
        ? await adminCreateNews(payload)
        : await adminUpdateNews(selected, payload);
      setItems((list) => {
        const rest = list.filter((i) => i.id !== saved.id);
        return [saved, ...rest];
      });
      setSelected(saved.id);
      setForm((f) => (f ? { ...f, status: saved.status, publishedAt: toLocalInput(saved.publishedAt) } : f));
      setDirty(false);
      const st = statusOf(saved);
      setNotice({
        kind: 'ok',
        text: st.key === 'draft' ? 'Черновик сохранён.' : st.key === 'scheduled' ? `Запланировано на ${formatNewsDate(saved.publishedAt)}.` : 'Опубликовано на сайте.',
      });
    } catch (e: any) {
      setNotice({ kind: 'error', text: errorMessage(e, 'Не удалось сохранить. Проверьте соединение и попробуйте ещё раз.') });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (typeof selected !== 'number' || !form) return;
    if (!window.confirm(`Удалить новость «${form.title || 'без названия'}»? Это действие нельзя отменить.`)) return;
    try {
      await adminDeleteNews(selected);
      setItems((list) => list.filter((i) => i.id !== selected));
      setSelected(null);
      setForm(null);
      setDirty(false);
      setNotice(null);
    } catch (e: any) {
      setNotice({ kind: 'error', text: errorMessage(e, 'Не удалось удалить новость.') });
    }
  };

  const visible = items.filter((i) => {
    if (query && !i.title.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return filter === 'all' || statusOf(i).key === filter;
  });

  const current = typeof selected === 'number' ? items.find((i) => i.id === selected) : undefined;
  const isFuture = form?.publishedAt ? new Date(form.publishedAt).getTime() > Date.now() : false;
  const liveUrl = current && current.status === 'published' && !current.scheduled ? `/News/${current.slug}` : '';

  const saveSettings = (next: NewsPageSettings) => {
    if (newsPage) pageContent.updatePageContentLocal(newsPage.name, 'newsPage', next);
  };

  return (
    <div className="adm-news">
      <div className="adm-phead">
        <div>
          <h1 className="adm-h1">Новости</h1>
          <p className="adm-muted">Публикуйте новости и настраивайте страницу раздела — без участия разработчика.</p>
        </div>
        <div className="adm-actions">
          <a className="adm-btn adm-btn-ghost" href={NEWS_PAGE_PATH} target="_blank" rel="noopener noreferrer">Открыть раздел на сайте</a>
          <button type="button" className="adm-btn adm-btn-primary" onClick={startNew}>Новая новость</button>
        </div>
      </div>

      <div role="tablist" aria-label="Разделы управления новостями" className="adm-tabs">
        <button type="button" role="tab" aria-selected={tab === 'news'} className={tab === 'news' ? 'is-active' : ''} onClick={() => setTab('news')}>Новости</button>
        <button type="button" role="tab" aria-selected={tab === 'page'} className={tab === 'page' ? 'is-active' : ''} onClick={() => setTab('page')}>Страница раздела</button>
      </div>

      {tab === 'page' && (
        newsPage ? (
          <NewsPageSettingsForm
            value={settings}
            saving={pageContent.isSavingPage(newsPage.id)}
            error={pageContent.getPageSaveError(newsPage.id)}
            onChange={saveSettings}
          />
        ) : (
          <div className="adm-card adm-empty">
            Страница «Новости» ещё не создана в базе. Перезапустите сервер (или выполните <code>node scripts/bootstrapDatabase.js</code>) — она появится автоматически.
          </div>
        )
      )}

      {tab === 'news' && (
        <div className={`adm-split${selected !== null ? ' is-editing' : ''}`}>
          <section className="adm-split-list" aria-label="Список новостей">
            <div className="adm-filters">
              <input type="search" className="adm-input" placeholder="Поиск по заголовку" aria-label="Поиск по заголовку" value={query} onChange={(e) => setQuery(e.target.value)} />
              <select className="adm-input" aria-label="Фильтр по статусу" value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
                <option value="all">Все статусы</option>
                <option value="published">Опубликовано</option>
                <option value="draft">Черновик</option>
                <option value="scheduled">Запланировано</option>
              </select>
            </div>

            {loading && <p className="adm-muted adm-pad">Загружаем новости…</p>}
            {loadError && (
              <div className="adm-notice is-error" role="alert">
                {loadError} <button type="button" className="adm-link" onClick={() => void reload()}>Повторить</button>
              </div>
            )}
            {!loading && !loadError && items.length === 0 && (
              <div className="adm-empty">
                <p>Пока нет ни одной новости.</p>
                <button type="button" className="adm-btn adm-btn-primary" onClick={startNew}>Написать первую</button>
              </div>
            )}
            {!loading && items.length > 0 && visible.length === 0 && <p className="adm-muted adm-pad">Ничего не найдено.</p>}

            <ul className="adm-news-list">
              {visible.map((item) => {
                const st = statusOf(item);
                return (
                  <li key={item.id}>
                    <button type="button" className={`adm-news-row${item.id === selected ? ' is-active' : ''}`} onClick={() => void openItem(item.id)} aria-current={item.id === selected ? 'true' : undefined}>
                      <span className="adm-news-title">{item.title}</span>
                      <span className="adm-news-meta">
                        <span>{categoryLabel(settings.categories, item.category) || 'Без категории'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatNewsDate(item.publishedAt) || 'без даты'}</span>
                        <span className={`adm-chip is-${st.key}`}>{st.label}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="adm-split-edit" aria-label="Редактор новости" ref={editorSectionRef}>
            {!form && (
              <div className="adm-card adm-empty">
                {opening ? 'Открываем…' : 'Выберите новость в списке или создайте новую.'}
              </div>
            )}

            {form && (
              <div className="adm-card adm-form">
                <button type="button" className="adm-back" onClick={closeEditor}>← Все новости</button>
                <div className="adm-card-head">
                  <h2 className="adm-h2">{selected === 'new' ? 'Новая новость' : 'Редактирование новости'}</h2>
                  <span className="adm-muted" role="status">
                    {dirty ? 'Есть несохранённые изменения' : selected === 'new' ? 'Ещё не сохранена' : 'Все изменения сохранены'}
                  </span>
                </div>

                <div className="adm-grid-2">
                  <div className="adm-field adm-span-2">
                    <label htmlFor="f-title">Заголовок</label>
                    <input id="f-title" ref={titleRef} type="text" className="adm-input adm-input-lg" value={form.title} maxLength={255} onChange={(e) => patch({ title: e.target.value })} />
                  </div>
                  <div className="adm-field">
                    <label htmlFor="f-cat">Категория</label>
                    <select id="f-cat" className="adm-input" value={form.category} onChange={(e) => patch({ category: e.target.value })}>
                      <option value="">Без категории</option>
                      {settings.categories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                      {form.category && !settings.categories.some((c) => c.key === form.category) && <option value={form.category}>{form.category}</option>}
                    </select>
                  </div>
                  <div className="adm-field">
                    <label htmlFor="f-date">Дата публикации</label>
                    <input id="f-date" type="datetime-local" className="adm-input" value={form.publishedAt} onChange={(e) => patch({ publishedAt: e.target.value })} />
                    <span className="adm-hint">Пусто — сразу при публикации. Дата в будущем — новость появится на сайте в этот день.</span>
                  </div>
                </div>

                <div className="adm-section">
                  <h3 className="adm-h3">Обложка</h3>
                  <div className="adm-cover">
                    <div className="adm-cover-preview">
                      {form.coverUrl
                        ? <img src={mediaSrc(form.coverUrl)} alt={form.coverAlt || 'Текущая обложка'} />
                        : <span>Обложка не выбрана</span>}
                    </div>
                    <div className="adm-cover-side">
                      <div className="adm-actions">
                        <button type="button" className="adm-btn adm-btn-ghost" disabled={coverBusy} onClick={() => coverRef.current?.click()}>
                          {coverBusy ? 'Загрузка…' : form.coverUrl ? 'Заменить фото' : 'Выбрать фото'}
                        </button>
                        {form.coverUrl && <button type="button" className="adm-btn adm-btn-ghost is-danger" onClick={() => patch({ coverUrl: '' })}>Убрать</button>}
                        <input ref={coverRef} type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={(e) => void uploadCover(e.target.files?.[0])} />
                      </div>
                      <p className="adm-hint">Формат 16:9, лучше 1920×1080, JPG, PNG или WebP до 10 МБ. Фото обрезается по центру.</p>
                      <div className="adm-field">
                        <label htmlFor="f-alt">Описание фото (для доступности)</label>
                        <input id="f-alt" type="text" className="adm-input" value={form.coverAlt} maxLength={255} onChange={(e) => patch({ coverAlt: e.target.value })} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="adm-section">
                  <div className="adm-field">
                    <label htmlFor="f-lead" className="adm-label-lg">Лид</label>
                    <textarea id="f-lead" className="adm-input" rows={3} value={form.excerpt} maxLength={600} onChange={(e) => patch({ excerpt: e.target.value })} />
                    <span className="adm-hint">Показывается на карточке в списке. Рекомендуем до 200 символов · {form.excerpt.length}/600</span>
                  </div>
                  <div className="adm-field">
                    <span className="adm-label">Теги</span>
                    <div className="adm-tags">
                      {form.tags.map((t) => (
                        <span key={t} className="adm-tag">
                          {t}
                          <button type="button" aria-label={`Убрать тег ${t}`} onClick={() => patch({ tags: form.tags.filter((x) => x !== t) })}>×</button>
                        </span>
                      ))}
                      {form.tags.length < 10 && (
                        <input
                          type="text"
                          className="adm-tag-input"
                          placeholder="Добавить тег"
                          aria-label="Добавить тег"
                          value={tagDraft}
                          maxLength={30}
                          onChange={(e) => setTagDraft(e.target.value.replace(',', ''))}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagDraft); } }}
                          onBlur={() => tagDraft.trim() && addTag(tagDraft)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="adm-section">
                  <div className="adm-card-head">
                    <h3 className="adm-h3">Текст новости</h3>
                    <span className="adm-hint">Пишите прямо здесь — на сайте текст выглядит так же</span>
                  </div>
                  <NewsEditor key={editorKey} content={form.contentJson} onChange={onEditorChange} />
                </div>

                <div className="adm-section">
                  <h3 className="adm-h3">Поиск и соцсети</h3>
                  <div className="adm-field">
                    <label htmlFor="f-seo-t">Заголовок для поиска</label>
                    <input id="f-seo-t" type="text" className="adm-input" value={form.seoTitle} maxLength={255} onChange={(e) => patch({ seoTitle: e.target.value })} />
                  </div>
                  <div className="adm-field">
                    <label htmlFor="f-seo-d">Описание</label>
                    <textarea id="f-seo-d" className="adm-input" rows={2} value={form.seoDescription} maxLength={320} onChange={(e) => patch({ seoDescription: e.target.value })} />
                    <span className="adm-hint">Картинка для соцсетей берётся из обложки.</span>
                  </div>
                </div>

                {notice && <div className={`adm-notice is-${notice.kind}`} role={notice.kind === 'error' ? 'alert' : 'status'}>{notice.text}</div>}

                <div className="adm-formbar">
                  {typeof selected === 'number' && (
                    <button type="button" className="adm-btn adm-btn-ghost is-danger adm-formbar-left" onClick={() => void remove()} disabled={saving}>Удалить</button>
                  )}
                  {liveUrl && <a className="adm-btn adm-btn-ghost" href={liveUrl} target="_blank" rel="noopener noreferrer">Открыть на сайте</a>}
                  {form.status === 'draft' ? (
                    <>
                      <button type="button" className="adm-btn adm-btn-ghost" onClick={() => void save('draft')} disabled={saving}>Сохранить черновик</button>
                      <button type="button" className="adm-btn adm-btn-primary" onClick={() => void save('published')} disabled={saving}>
                        {saving ? 'Сохраняем…' : isFuture ? 'Запланировать' : 'Опубликовать'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="adm-btn adm-btn-ghost" onClick={() => void save('draft')} disabled={saving}>Снять с публикации</button>
                      <button type="button" className="adm-btn adm-btn-primary" onClick={() => void save('published')} disabled={saving}>
                        {saving ? 'Сохраняем…' : 'Сохранить'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
});

export default NewsAdmin;
