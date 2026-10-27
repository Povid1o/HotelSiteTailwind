import React, { useEffect, useId, useRef, useState } from 'react';
import { mediaSrc } from '../news/newsFormat';
import { checkNewsImage } from './news/newsExtensions';

const DISCARD_TEXT = 'Есть несохранённые изменения. Закрыть без сохранения?';

export type Img = string | File;

// ---------- вспомогательное ----------

const fileUrls = new WeakMap<File, string>();
/** Адрес для <img>: загруженный файл показываем сразу, не дожидаясь сервера. */
export const imgSrc = (value: Img | null | undefined): string => {
  if (!value) return '';
  if (typeof value === 'string') return mediaSrc(value);
  let url = fileUrls.get(value);
  if (!url) { url = URL.createObjectURL(value); fileUrls.set(value, url); }
  return url;
};

const uids = new WeakMap<object, number>();
let uidCounter = 0;
/** Стабильный номер объекта из стора: id у нового блюда меняется после создания на сервере, а номер — нет. */
export const uidOf = (obj: object): number => {
  let uid = uids.get(obj);
  if (!uid) { uid = ++uidCounter; uids.set(obj, uid); }
  return uid;
};

export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';

/** На широком экране сразу открываем первую запись, чтобы справа не было пустоты. */
export const useAutoSelect = (ids: number[], selected: number | null, select: (id: number) => void) => {
  const done = useRef(false);
  useEffect(() => {
    if (done.current || selected !== null || !ids.length) return;
    done.current = true;
    if (window.matchMedia('(min-width: 1280px)').matches) select(ids[0]);
  }, [ids, selected, select]);
};

// ---------- переключатель ----------

export const Switch: React.FC<{ label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, hint, checked, onChange }) => {
  const id = useId();
  return (
    <div className="adm-switch-row">
      <div>
        <div id={id} className="adm-switch-label">{label}</div>
        {hint && <div className="adm-hint">{hint}</div>}
      </div>
      <button type="button" role="switch" aria-checked={checked} aria-labelledby={id} className={`adm-switch${checked ? ' is-on' : ''}`} onClick={() => onChange(!checked)}>
        <span />
      </button>
    </div>
  );
};

// ---------- чипы с добавлением ----------

export const ChipEditor: React.FC<{ items: string[]; onChange: (items: string[]) => void; label: string; max?: number }> = ({ items, onChange, label, max = 20 }) => {
  const [text, setText] = useState('');
  const add = () => {
    const value = text.trim();
    setText('');
    if (value && !items.includes(value) && items.length < max) onChange([...items, value]);
  };
  return (
    <div className="adm-tags">
      {items.map((item) => (
        <span key={item} className="adm-tag">
          {item}
          <button type="button" aria-label={`Убрать: ${item}`} onClick={() => onChange(items.filter((x) => x !== item))}>×</button>
        </span>
      ))}
      <input
        type="text"
        className="adm-tag-input"
        placeholder="Добавить"
        aria-label={label}
        value={text}
        maxLength={80}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        onBlur={add}
      />
    </div>
  );
};

// ---------- фильтр-«пилюли» ----------

export const Pills: React.FC<{ label: string; items: { key: string; label: string }[]; value: string; onChange: (key: string) => void; children?: React.ReactNode }> = ({ label, items, value, onChange, children }) => (
  <div role="group" aria-label={label} className="adm-pills">
    {items.map((item) => (
      <button key={item.key} type="button" aria-pressed={item.key === value} className={item.key === value ? 'is-active' : ''} onClick={() => onChange(item.key)}>
        {item.label}
      </button>
    ))}
    {children}
  </div>
);

// ---------- фотографии ----------

interface PhotoGridProps {
  items: Img[];
  onChange: (items: Img[]) => void;
  tile?: { w: number; h: number };
  max?: number;
  label?: string;
  numbered?: boolean;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ items, onChange, tile = { w: 104, h: 72 }, max = 12, label = 'Добавить фото', numbered = true }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  const add = (files: FileList | null) => {
    if (!files) return;
    const accepted: File[] = [];
    let problem = '';
    Array.from(files).forEach((file) => {
      const bad = checkNewsImage(file);
      if (bad) problem = bad; else accepted.push(file);
    });
    setError(problem);
    if (accepted.length) onChange([...items, ...accepted].slice(0, max));
    if (fileRef.current) fileRef.current.value = '';
  };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div>
      <div className="adm-photos">
        {items.map((item, i) => (
          <div
            key={`${typeof item === 'string' ? item : item.name}-${i}`}
            className={`adm-photo${dragFrom === i ? ' is-drag' : ''}`}
            style={{ width: tile.w, height: tile.h }}
            draggable
            onDragStart={() => setDragFrom(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (dragFrom !== null) move(dragFrom, i); setDragFrom(null); }}
            onDragEnd={() => setDragFrom(null)}
          >
            <img src={imgSrc(item)} alt="" draggable={false} />
            {numbered && <span className="adm-photo-num">{i + 1}</span>}
            <div className="adm-photo-tools">
              <button type="button" aria-label={`Сдвинуть фото ${i + 1} влево`} disabled={i === 0} onClick={() => move(i, i - 1)}>‹</button>
              <button type="button" aria-label={`Сдвинуть фото ${i + 1} вправо`} disabled={i === items.length - 1} onClick={() => move(i, i + 1)}>›</button>
              <button type="button" aria-label={`Убрать фото ${i + 1}`} onClick={() => onChange(items.filter((_, j) => j !== i))}>×</button>
            </div>
          </div>
        ))}
        {items.length < max && (
          <button type="button" className="adm-photo-add" aria-label={label} style={{ width: tile.w, height: tile.h }} onClick={() => fileRef.current?.click()}>+</button>
        )}
        <input ref={fileRef} type="file" hidden multiple accept={IMAGE_ACCEPT} onChange={(e) => add(e.target.files)} />
      </div>
      {error && <p className="adm-field-error" role="alert">{error}</p>}
    </div>
  );
};

/** Одно фото с предпросмотром 16:9 — для шапок страниц. */
export const SinglePhoto: React.FC<{ value: Img | null | undefined; onChange: (value: Img | null) => void; hint?: string }> = ({ value, onChange, hint = 'Формат 16:9, лучше 1920×1080, JPG, PNG или WebP до 10 МБ.' }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const pick = (file?: File) => {
    if (!file) return;
    const bad = checkNewsImage(file);
    setError(bad || '');
    if (!bad) onChange(file);
    if (fileRef.current) fileRef.current.value = '';
  };
  return (
    <div className="adm-cover">
      <div className="adm-cover-preview">
        {value ? <img src={imgSrc(value)} alt="Текущее фото" /> : <span>Фото не выбрано</span>}
      </div>
      <div className="adm-cover-side">
        <div className="adm-actions">
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => fileRef.current?.click()}>{value ? 'Заменить фото' : 'Выбрать фото'}</button>
          {value && <button type="button" className="adm-btn adm-btn-ghost is-danger" onClick={() => onChange(null)}>Убрать</button>}
          <input ref={fileRef} type="file" hidden accept={IMAGE_ACCEPT} onChange={(e) => pick(e.target.files?.[0])} />
        </div>
        <p className="adm-hint">{hint}</p>
        {error && <p className="adm-field-error" role="alert">{error}</p>}
      </div>
    </div>
  );
};

// ---------- каркас формы ----------

export const SectionHead: React.FC<{ title: string; lead: string; children?: React.ReactNode }> = ({ title, lead, children }) => (
  <div className="adm-phead">
    <div>
      <h1 className="adm-h1">{title}</h1>
      <p className="adm-muted">{lead}</p>
    </div>
    {children && <div className="adm-actions">{children}</div>}
  </div>
);

export const FormHead: React.FC<{ title: string; status: string; tone?: 'ok' | 'warn' | 'error' }> = ({ title, status, tone = 'ok' }) => (
  <div className="adm-card-head">
    <h2 className="adm-h2">{title}</h2>
    <span className={`adm-status is-${tone}`} role="status">{status}</span>
  </div>
);

export const FormBlock: React.FC<{ title: string; note?: string; children: React.ReactNode }> = ({ title, note, children }) => (
  <div className="adm-section adm-block">
    <div className="adm-card-head">
      <h3 className="adm-h3">{title}</h3>
      {note && <span className="adm-hint">{note}</span>}
    </div>
    {children}
  </div>
);

interface FormBarProps {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  deleteLabel?: string;
  message?: { kind: 'ok' | 'error'; text: string } | null;
}

export const FormBar: React.FC<FormBarProps> = ({ dirty, saving, onSave, onCancel, onDelete, deleteLabel = 'Удалить', message }) => (
  <>
    {message && <div className={`adm-notice is-${message.kind}`} role={message.kind === 'error' ? 'alert' : 'status'}>{message.text}</div>}
    <div className="adm-formbar">
      {onDelete && <button type="button" className="adm-btn adm-btn-ghost is-danger adm-formbar-left" onClick={onDelete} disabled={saving}>{deleteLabel}</button>}
      <button type="button" className="adm-btn adm-btn-ghost" onClick={onCancel} disabled={saving || !dirty}>Отмена</button>
      <button type="button" className="adm-btn adm-btn-primary" onClick={onSave} disabled={saving || !dirty}>{saving ? 'Сохраняем…' : 'Сохранить'}</button>
    </div>
  </>
);

export const BackButton: React.FC<{ onClick: () => void; label?: string }> = ({ onClick, label = '← К списку' }) => (
  <button type="button" className="adm-back" onClick={onClick}>{label}</button>
);

export const Thumb: React.FC<{ src?: Img | null; w: number; h: number }> = ({ src, w, h }) => (
  <div className="adm-thumb" style={{ width: w, height: h }}>{src ? <img src={imgSrc(src)} alt="" loading="lazy" /> : null}</div>
);


// ---------- черновик формы ----------

/** Сравнение черновика с сохранённым: файлы сравниваем по имени, размеру и дате. */
export const snap = (value: unknown): string =>
  JSON.stringify(value, (_key, item) => (item instanceof File ? `file:${item.name}:${item.size}:${item.lastModified}` : item));

const unsaved = new Set<symbol>();
export const hasUnsaved = () => unsaved.size > 0;
export const confirmDiscard = () => !hasUnsaved() || window.confirm(DISCARD_TEXT);

export const useDirtyGuard = (dirty: boolean) => {
  const id = useRef(Symbol('admin-form')).current;
  useEffect(() => {
    if (dirty) unsaved.add(id); else unsaved.delete(id);
    return () => { unsaved.delete(id); };
  }, [dirty, id]);
};

/** Браузер спросит подтверждение, если закрыть вкладку с несохранёнными правками. */
export const useBeforeUnloadGuard = () => {
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!hasUnsaved()) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);
};

/**
 * Черновик формы. `read` каждый раз собирает свежую копию данных из хранилища:
 * пока человек ничего не менял, форма следует за хранилищем, а после правок
 * его ввод не затирается, пока он не нажмёт «Сохранить» или «Отмена».
 */
export function useDraft<T extends object>(read: () => T) {
  const fresh = read();
  const freshSnap = snap(fresh);
  const [draft, setDraft] = useState<T>(fresh);
  const [baseSnap, setBaseSnap] = useState(freshSnap);
  const dirty = snap(draft) !== baseSnap;
  if (!dirty && freshSnap !== baseSnap) {
    setDraft(fresh);
    setBaseSnap(freshSnap);
  }
  useDirtyGuard(dirty);
  const sync = () => {
    const next = read();
    setDraft(next);
    setBaseSnap(snap(next));
  };
  const patch = (part: Partial<T>) => setDraft((previous) => ({ ...previous, ...part }));
  return { draft, patch, dirty, sync };
}

export type Msg = { kind: 'ok' | 'error'; text: string } | null;

/** Сохранение: задача возвращает текст ошибки или null, если всё прошло. */
export const useSaveFlow = () => {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true; // StrictMode монтирует эффект дважды
    return () => { alive.current = false; };
  }, []);
  const run = async (task: () => Promise<string | null>): Promise<boolean> => {
    setMsg(null);
    setSaving(true);
    try {
      const error = await task();
      if (alive.current) setMsg(error ? { kind: 'error', text: error } : { kind: 'ok', text: 'Сохранено' });
      return !error;
    } catch (e: any) {
      if (alive.current) setMsg({ kind: 'error', text: e?.response?.data?.message || e?.message || 'Не удалось сохранить' });
      return false;
    } finally {
      if (alive.current) setSaving(false);
    }
  };
  return { saving, msg, setMsg, run };
};

export const formStatus = (saving: boolean, dirty: boolean): { text: string; tone: 'ok' | 'warn' } =>
  saving ? { text: 'Сохраняем…', tone: 'warn' } : dirty ? { text: 'Есть несохранённые изменения', tone: 'warn' } : { text: 'Сохранено', tone: 'ok' };

// ---------- строка списка ----------

interface ListRowProps {
  active: boolean;
  onClick: () => void;
  thumb?: React.ReactNode;
  title: string;
  sub?: string;
  facts?: React.ReactNode;
  chip?: { label: string; tone: 'ok' | 'warn' | 'muted' };
}

export const ListRow: React.FC<ListRowProps> = ({ active, onClick, thumb, title, sub, facts, chip }) => (
  <li>
    <button type="button" className={`adm-row${active ? ' is-active' : ''}`} aria-current={active ? 'true' : undefined} onClick={onClick}>
      {thumb}
      <span className="adm-row-main">
        <span className="adm-row-title">{title}</span>
        {sub && <span className="adm-row-sub">{sub}</span>}
      </span>
      {facts && <span className="adm-row-facts">{facts}</span>}
      {chip && <span className={`adm-pill is-${chip.tone}`}>{chip.label}</span>}
    </button>
  </li>
);
