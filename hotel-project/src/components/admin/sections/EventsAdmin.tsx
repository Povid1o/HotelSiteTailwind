import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index';
import {
  BackButton, FormBar, FormBlock, FormHead, Img, ListRow, PhotoGrid, Pills, SectionHead, Thumb,
  confirmDiscard, formStatus, useAutoSelect, useDraft, useSaveFlow,
} from '../ui';

type EventImg = Img | { url?: string };
type EventRow = { id: number; title: string; description: string; category_id: number; images: EventImg[] };
type EventCat = { id: number; header: string; description: string; events?: EventRow[] };

const imgOf = (item: EventImg): Img => (typeof item === 'string' || item instanceof File ? item : item.url || '');

interface EventForm {
  title: string;
  description: string;
  categoryId: number;
  images: Img[];
}

const toForm = (ev: EventRow): EventForm => ({
  title: ev.title,
  description: ev.description || '',
  categoryId: ev.category_id,
  images: (ev.images || []).map(imgOf).filter(Boolean),
});

const photosLabel = (n: number) => `${n} фото`;

const EventEditor: React.FC<{ eventId: number; onClose: () => void }> = observer(({ eventId, onClose }) => {
  const { events } = useContext(Context)!;
  const categories = events.categories as EventCat[];
  const find = () => {
    for (const cat of categories) {
      const hit = cat.events?.find((e) => e.id === eventId);
      if (hit) return hit;
    }
    return undefined;
  };
  const ev = find();
  const { draft, patch, dirty, sync } = useDraft<EventForm>(() => {
    const current = find();
    return current ? toForm(current) : { title: '', description: '', categoryId: 0, images: [] };
  });
  const { saving, msg, setMsg, run } = useSaveFlow();
  const [error, setError] = useState('');
  if (!ev) return null;

  const save = () => {
    if (!draft.title.trim()) { setError('Введите название мероприятия.'); setMsg({ kind: 'error', text: 'Проверьте подсвеченные поля.' }); return; }
    setError('');
    void run(async () => {
      const moved = draft.categoryId !== ev.category_id;
      await events.updateEvent(eventId, { title: draft.title.trim(), description: draft.description, categoryId: draft.categoryId, images: draft.images });
      const failed = events.getEventSaveError(eventId);
      if (failed) return failed;
      if (moved) await events.refreshAll();
      sync();
      return null;
    });
  };
  const cancel = () => { sync(); setError(''); setMsg(null); };
  const remove = async () => {
    if (!window.confirm(`Удалить мероприятие «${ev.title}»? Это действие нельзя отменить.`)) return;
    try {
      await events.deleteEvent(eventId);
      onClose();
    } catch (e: any) {
      setMsg({ kind: 'error', text: e?.response?.data?.message || 'Не удалось удалить мероприятие. Попробуйте ещё раз.' });
    }
  };
  const status = formStatus(saving, dirty);

  return (
    <div className="adm-card">
      <BackButton onClick={() => { if (confirmDiscard()) onClose(); }} />
      <FormHead title={draft.title || 'Мероприятие'} status={status.text} tone={status.tone} />

      <div className="adm-field">
        <label htmlFor="ev-cat">Раздел</label>
        <select id="ev-cat" className="adm-input" value={draft.categoryId} onChange={(e) => patch({ categoryId: Number(e.target.value) })}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.header}</option>)}
        </select>
      </div>
      <div className="adm-field">
        <label htmlFor="ev-title">Название</label>
        <input id="ev-title" className="adm-input adm-input-lg" value={draft.title} maxLength={160} aria-invalid={!!error} onChange={(e) => patch({ title: e.target.value })} />
        {error && <p className="adm-field-error" role="alert">{error}</p>}
      </div>
      <div className="adm-field">
        <label htmlFor="ev-desc">Описание</label>
        <textarea id="ev-desc" className="adm-input" rows={6} value={draft.description} placeholder="Что увидят гости, сколько длится, что входит в стоимость, как записаться" onChange={(e) => patch({ description: e.target.value })} />
      </div>

      <FormBlock title="Фотографии" note={`${photosLabel(draft.images.length)} · первое — обложка`}>
        <PhotoGrid items={draft.images} onChange={(images) => patch({ images })} tile={{ w: 96, h: 68 }} max={20} />
      </FormBlock>

      <FormBar dirty={dirty} saving={saving} onSave={save} onCancel={cancel} onDelete={() => void remove()} deleteLabel="Удалить" message={msg?.kind === 'error' ? msg : null} />
    </div>
  );
});

const CategoryBar: React.FC<{ category: EventCat }> = observer(({ category }) => {
  const { events } = useContext(Context)!;
  const [open, setOpen] = useState(false);
  const [header, setHeader] = useState(category.header);
  const [description, setDescription] = useState(category.description || '');
  const [state, setState] = useState<'idle' | 'saving' | 'error'>('idle');
  useEffect(() => { setOpen(false); setHeader(category.header); setDescription(category.description || ''); setState('idle'); }, [category.id, category.header, category.description]);

  const save = async () => {
    if (!header.trim()) { setState('error'); return; }
    setState('saving');
    try {
      await events.updateCategory(category.id, { header: header.trim(), description });
      setOpen(false);
      setState('idle');
    } catch {
      setState('error');
    }
  };

  if (!open) {
    return (
      <div className="adm-catbar">
        <span className="adm-muted">{category.description || 'У раздела нет описания.'}</span>
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setOpen(true)}>Изменить раздел</button>
      </div>
    );
  }
  return (
    <div className="adm-card adm-catform">
      <div className="adm-field">
        <label htmlFor="evcat-h">Название раздела</label>
        <input id="evcat-h" className="adm-input" value={header} maxLength={80} onChange={(e) => setHeader(e.target.value)} />
      </div>
      <div className="adm-field">
        <label htmlFor="evcat-d">Описание раздела</label>
        <textarea id="evcat-d" className="adm-input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      {state === 'error' && <p className="adm-field-error" role="alert">Не удалось сохранить раздел. Проверьте название и попробуйте ещё раз.</p>}
      <div className="adm-actions">
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setOpen(false)}>Отмена</button>
        <button type="button" className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => void save()} disabled={state === 'saving'}>{state === 'saving' ? 'Сохраняем…' : 'Сохранить раздел'}</button>
      </div>
    </div>
  );
});

const EventsAdmin: React.FC = observer(() => {
  const { events } = useContext(Context)!;
  const categories = events.categories as EventCat[];
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');

  const all = categories.flatMap((c) => (c.events || []).map((e) => ({ ev: e, cat: c })));
  const visible = filter === 'all' ? all : all.filter(({ cat }) => String(cat.id) === filter);
  const activeCategory = categories.find((c) => String(c.id) === filter);
  const current = all.find(({ ev }) => ev.id === selected);
  useAutoSelect(visible.map(({ ev }) => ev.id), selected, setSelected);

  const pick = (key: string) => { if (confirmDiscard()) { setFilter(key); setSelected(null); } };
  const select = (id: number | null) => { if (confirmDiscard()) setSelected(id); };
  const add = async () => {
    const target = activeCategory || categories[0];
    if (!target || adding || !confirmDiscard()) return;
    setAdding(true);
    setAddError('');
    try {
      const created = await events.createEvent({ title: 'Новое мероприятие', categoryId: target.id, description: '', images: [] });
      if (created?.id) setSelected(created.id);
    } catch (e: any) {
      setAddError(e?.response?.data?.message || 'Не удалось создать мероприятие. Проверьте, что вы авторизованы.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <SectionHead title="Мероприятия" lead="Экскурсии, забеги, open-air и календарь событий на странице «Мероприятия».">
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => void add()} disabled={adding || categories.length === 0}>{adding ? 'Создаём…' : 'Новое мероприятие'}</button>
      </SectionHead>
      {addError && <div className="adm-notice is-error" role="alert">{addError}</div>}

      <Pills label="Раздел" value={filter} onChange={pick} items={[{ key: 'all', label: 'Все' }, ...categories.map((c) => ({ key: String(c.id), label: c.header }))]} />
      {activeCategory && <CategoryBar category={activeCategory} />}

      <div className={`adm-split${current ? ' is-editing' : ''}`}>
        <section className="adm-split-list adm-split-wide" aria-label="Список мероприятий">
          {visible.length > 0 ? (
            <ul className="adm-rows">
              {visible.map(({ ev, cat }) => (
                <ListRow
                  key={ev.id}
                  active={ev.id === selected}
                  onClick={() => select(ev.id)}
                  thumb={<Thumb src={ev.images?.[0] ? imgOf(ev.images[0]) : null} w={64} h={48} />}
                  title={ev.title}
                  sub={events.isSavingEvent(ev.id) ? 'Сохраняем…' : `${cat.header} · ${photosLabel((ev.images || []).length)}`}
                />
              ))}
            </ul>
          ) : (
            <p className="adm-empty">Мероприятий пока нет. Нажмите «Новое мероприятие».</p>
          )}
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm adm-add-line" onClick={() => void add()} disabled={adding || categories.length === 0}>+ Добавить мероприятие</button>
        </section>

        <section className="adm-split-edit" aria-label="Редактирование мероприятия">
          {current ? <EventEditor key={current.ev.id} eventId={current.ev.id} onClose={() => setSelected(null)} /> : (
            <div className="adm-card adm-empty"><p>Выберите мероприятие слева, чтобы изменить название, описание и фото.</p></div>
          )}
        </section>
      </div>
    </div>
  );
});

export default EventsAdmin;
