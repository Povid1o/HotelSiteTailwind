import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index';
import { contactDefault, privacyDefault } from '../../pages_editable/V4InfoPageEdit';
import { NEWS_PAGE_PATH } from '../../news/newsFormat';
import {
  BackButton, FormBar, FormBlock, FormHead, Img, ListRow, PhotoGrid, SectionHead, SinglePhoto,
  confirmDiscard, formStatus, snap, useAutoSelect, useDraft, useSaveFlow,
} from '../ui';

type Kind = 'hero' | 'about' | 'gallery' | 'contacts' | 'privacy';
interface Block { kind: Kind; section: string; title: string; note?: string }

const hero = (section: string, title = 'Шапка страницы'): Block => ({ kind: 'hero', section, title, note: 'Фото, заголовок и подпись в верхней части страницы.' });

/** Какие разделы содержимого редактируются на какой странице. */
const SCHEMAS: Record<string, Block[]> = {
  'Главная': [
    hero('mainBackground', 'Фон главной'),
    { kind: 'about', section: 'aboutSection', title: 'Блок «О нас»' },
    { kind: 'gallery', section: 'firstGallery', title: 'Первая галерея' },
    { kind: 'gallery', section: 'secondGallery', title: 'Вторая галерея' },
  ],
  'Винодельня': [hero('mainBackground')],
  'Витрина вина': [hero('shopHero')],
  'Отель': [hero('hero')],
  'Ресторан': [hero('hero')],
  'Страница ресторана': [hero('hero')],
  'Мероприятия': [hero('hero')],
  'Страница мероприятий': [hero('hero')],
  'Контакты': [{ kind: 'contacts', section: 'contacts', title: 'Контактная информация' }],
  'Политика конфиденциальности': [{ kind: 'privacy', section: 'privacy', title: 'Текст политики' }],
};

type Rec = Record<string, unknown>;
const isRec = (v: unknown): v is Rec => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback);
const img = (v: unknown): Img | null => (typeof v === 'string' || v instanceof File ? v : null);

interface GalleryItem { src: Img; alt: string }
type SectionData = Rec;
type PageForm = Record<string, SectionData>;

const readSection = (block: Block, content: Rec, pageName: string): SectionData => {
  const raw = isRec(content[block.section]) ? (content[block.section] as Rec) : {};
  switch (block.kind) {
    case 'hero':
      return { title: str(raw.title, pageName), description: str(raw.description), image: img(raw.image) };
    case 'about':
      return { title: str(raw.title), description: str(raw.description) };
    case 'gallery':
      return {
        title: str(raw.title),
        images: (Array.isArray(raw.images) ? raw.images : [])
          .map((item): GalleryItem | null => {
            const r = isRec(item) ? item : { src: item };
            const src = img(r.src);
            return src ? { src, alt: str(r.alt) } : null;
          })
          .filter((x): x is GalleryItem => !!x),
      };
    case 'contacts':
      return Object.fromEntries(Object.entries(contactDefault).map(([key, fallback]) => [key, str(raw[key], fallback)]));
    case 'privacy':
      return {
        eyebrow: str(raw.eyebrow, privacyDefault.eyebrow),
        title: str(raw.title, privacyDefault.title),
        sections: Array.isArray(raw.sections)
          ? raw.sections.filter(isRec).map((s, i) => ({ title: str(s.title, `Раздел ${i + 1}`), text: str(s.text) }))
          : privacyDefault.sections.map((s) => ({ ...s })),
      };
  }
};

const readForm = (blocks: Block[], content: Rec, pageName: string): PageForm =>
  Object.fromEntries(blocks.map((b) => [b.section, readSection(b, content, pageName)]));

const CONTACT_FIELDS: [string, string][] = [
  ['eyebrow', 'Надзаголовок'], ['title', 'Заголовок'], ['address', 'Адрес'], ['phone', 'Телефон'],
  ['phoneHref', 'Телефон для ссылки (только цифры и +)'], ['email', 'Почта'], ['reception', 'Режим работы'],
];

type PageRow = { id: number; name: string; path: string; content: unknown };

const PageEditor: React.FC<{ pageId: number; onClose: () => void }> = observer(({ pageId, onClose }) => {
  const { pageContent } = useContext(Context)!;
  const find = () => (pageContent.pages as PageRow[]).find((p) => p.id === pageId);
  const page = find();
  const blocks = (page && SCHEMAS[page.name]) || [];
  const read = (): PageForm => {
    const current = find();
    return current ? readForm(SCHEMAS[current.name] || [], isRec(current.content) ? current.content : {}, current.name) : {};
  };
  const { draft, patch, dirty, sync } = useDraft<PageForm>(read);
  const { saving, msg, setMsg, run } = useSaveFlow();
  if (!page) return null;

  const setSection = (section: string, part: SectionData) => patch({ [section]: { ...draft[section], ...part } });
  const baseline = read();
  const save = () => {
    const changed = blocks.filter((b) => snap(draft[b.section]) !== snap(baseline[b.section]));
    if (!changed.length) return;
    void run(async () => {
      await Promise.all(changed.map((b) => pageContent.updatePageContentLocal(page.name, b.section, draft[b.section])));
      const error = pageContent.getPageSaveError(page.id);
      if (!error) sync();
      return error;
    });
  };
  const cancel = () => { sync(); setMsg(null); };
  const status = formStatus(saving, dirty);

  const renderBlock = (block: Block) => {
    const data = draft[block.section] || {};
    switch (block.kind) {
      case 'hero':
        return (
          <FormBlock key={block.section} title={block.title} note={block.note}>
            <SinglePhoto value={data.image as Img | null} onChange={(image) => setSection(block.section, { image })} />
            <div className="adm-field">
              <label htmlFor={`${block.section}-t`}>Заголовок</label>
              <input id={`${block.section}-t`} className="adm-input" value={str(data.title)} onChange={(e) => setSection(block.section, { title: e.target.value })} />
            </div>
            <div className="adm-field">
              <label htmlFor={`${block.section}-d`}>Подзаголовок</label>
              <textarea id={`${block.section}-d`} className="adm-input" rows={2} value={str(data.description)} onChange={(e) => setSection(block.section, { description: e.target.value })} />
            </div>
          </FormBlock>
        );
      case 'about':
        return (
          <FormBlock key={block.section} title={block.title}>
            <div className="adm-field">
              <label htmlFor={`${block.section}-t`}>Заголовок</label>
              <input id={`${block.section}-t`} className="adm-input" value={str(data.title)} onChange={(e) => setSection(block.section, { title: e.target.value })} />
            </div>
            <div className="adm-field">
              <label htmlFor={`${block.section}-d`}>Текст</label>
              <textarea id={`${block.section}-d`} className="adm-input" rows={4} value={str(data.description)} onChange={(e) => setSection(block.section, { description: e.target.value })} />
            </div>
          </FormBlock>
        );
      case 'gallery': {
        const images = (data.images as GalleryItem[]) || [];
        return (
          <FormBlock key={block.section} title={block.title} note={`${images.length} фото · порядок меняется перетаскиванием`}>
            <div className="adm-field" style={{ marginTop: 0, marginBottom: 14 }}>
              <label htmlFor={`${block.section}-t`}>Заголовок галереи</label>
              <input id={`${block.section}-t`} className="adm-input" value={str(data.title)} onChange={(e) => setSection(block.section, { title: e.target.value })} />
            </div>
            <PhotoGrid
              items={images.map((i) => i.src)}
              tile={{ w: 88, h: 64 }}
              max={30}
              onChange={(next) => {
                const alts = new Map<Img, string>(images.map((i) => [i.src, i.alt]));
                setSection(block.section, { images: next.map((src) => ({ src, alt: alts.get(src) ?? '' })) });
              }}
            />
          </FormBlock>
        );
      }
      case 'contacts':
        return (
          <FormBlock key={block.section} title={block.title}>
            <div className="adm-grid-2">
              {CONTACT_FIELDS.map(([key, label]) => (
                <div key={key} className="adm-field">
                  <label htmlFor={`c-${key}`}>{label}</label>
                  <input id={`c-${key}`} className="adm-input" value={str(data[key])} onChange={(e) => setSection(block.section, { [key]: e.target.value })} />
                </div>
              ))}
            </div>
          </FormBlock>
        );
      case 'privacy': {
        const sections = (data.sections as { title: string; text: string }[]) || [];
        const setItem = (i: number, part: Partial<{ title: string; text: string }>) =>
          setSection(block.section, { sections: sections.map((s, j) => (j === i ? { ...s, ...part } : s)) });
        return (
          <FormBlock key={block.section} title={block.title}>
            <div className="adm-grid-2">
              <div className="adm-field">
                <label htmlFor="pv-e">Надзаголовок</label>
                <input id="pv-e" className="adm-input" value={str(data.eyebrow)} onChange={(e) => setSection(block.section, { eyebrow: e.target.value })} />
              </div>
              <div className="adm-field">
                <label htmlFor="pv-t">Заголовок</label>
                <input id="pv-t" className="adm-input" value={str(data.title)} onChange={(e) => setSection(block.section, { title: e.target.value })} />
              </div>
            </div>
            {sections.map((s, i) => (
              <div key={i} className="adm-privacy-item">
                <div className="adm-para-row">
                  <input className="adm-input" aria-label={`Заголовок раздела ${i + 1}`} value={s.title} onChange={(e) => setItem(i, { title: e.target.value })} />
                  <button type="button" className="adm-iconbtn" aria-label={`Удалить раздел ${i + 1}`} onClick={() => setSection(block.section, { sections: sections.filter((_, j) => j !== i) })}>×</button>
                </div>
                <textarea className="adm-input" aria-label={`Текст раздела ${i + 1}`} rows={3} value={s.text} onChange={(e) => setItem(i, { text: e.target.value })} />
              </div>
            ))}
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setSection(block.section, { sections: [...sections, { title: `${sections.length + 1}. Новый раздел`, text: '' }] })}>+ Добавить раздел</button>
          </FormBlock>
        );
      }
    }
  };

  return (
    <div className="adm-card">
      <BackButton onClick={() => { if (confirmDiscard()) onClose(); }} />
      <FormHead title={page.name} status={status.text} tone={status.tone} />
      <p className="adm-muted adm-page-link">Адрес на сайте: <a href={page.path} target="_blank" rel="noreferrer">{page.path} ↗</a></p>
      {blocks.length ? blocks.map(renderBlock) : <p className="adm-empty">Содержимое этой страницы не редактируется здесь.</p>}
      {blocks.length > 0 && <FormBar dirty={dirty} saving={saving} onSave={save} onCancel={cancel} message={msg?.kind === 'error' ? msg : null} />}
    </div>
  );
});

const PagesAdmin: React.FC = observer(() => {
  const { pageContent } = useContext(Context)!;
  const pages = (pageContent.pages as PageRow[]).filter((p) => p.path !== NEWS_PAGE_PATH);
  const [selected, setSelected] = useState<number | null>(null);
  const current = pages.find((p) => p.id === selected);
  useAutoSelect(pages.map((p) => p.id), selected, setSelected);
  const select = (id: number | null) => { if (confirmDiscard()) setSelected(id); };

  return (
    <div>
      <SectionHead title="Страницы сайта" lead="Тексты и фотографии на страницах. Изменения появляются на сайте сразу после сохранения." />
      <div className={`adm-split${current ? ' is-editing' : ''}`}>
        <section className="adm-split-list adm-split-wide" aria-label="Список страниц">
          <ul className="adm-rows">
            {pages.map((p) => {
              const saving = pageContent.isSavingPage(p.id);
              const failed = pageContent.getPageSaveError(p.id);
              return (
                <ListRow
                  key={p.id}
                  active={p.id === selected}
                  onClick={() => select(p.id)}
                  title={p.name}
                  sub={p.path}
                  chip={saving ? { label: 'Сохраняем…', tone: 'warn' } : failed ? { label: 'Ошибка', tone: 'warn' } : SCHEMAS[p.name] ? { label: 'Опубликована', tone: 'ok' } : { label: 'Не редактируется', tone: 'muted' }}
                />
              );
            })}
          </ul>
        </section>
        <section className="adm-split-edit" aria-label="Редактирование страницы">
          {current ? <PageEditor key={current.id} pageId={current.id} onClose={() => setSelected(null)} /> : (
            <div className="adm-card adm-empty"><p>Выберите страницу слева, чтобы изменить её тексты и фотографии.</p></div>
          )}
        </section>
      </div>
    </div>
  );
});

export default PagesAdmin;
