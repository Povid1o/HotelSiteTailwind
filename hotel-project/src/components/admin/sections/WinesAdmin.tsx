import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index';
import {
  BackButton, FormBar, FormBlock, FormHead, Img, ListRow, PhotoGrid, Pills, SectionHead, Thumb,
  confirmDiscard, formStatus, uidOf, useAutoSelect, useDraft, useSaveFlow,
} from '../ui';

type Wine = {
  id: number; name: string; images: Img[]; year: number; alcohol: string; sugar: string; temperature: string; price: number; description: string[];
};
type Assortment = { sweetness: string; wines: Wine[] };
type WineType = { type: string; assortment: Assortment[] };

interface WineForm {
  name: string;
  type: string;
  sweetness: string;
  year: string;
  price: string;
  alcohol: string;
  sugar: string;
  temperature: string;
  description: string[];
  images: Img[];
}

const toForm = (wine: Wine, type: string, sweetness: string): WineForm => ({
  name: wine.name,
  type,
  sweetness,
  year: wine.year ? String(wine.year) : '',
  price: wine.price ? String(wine.price) : '',
  alcohol: wine.alcohol || '',
  sugar: wine.sugar || '',
  temperature: wine.temperature || '',
  description: [...(wine.description || [])],
  images: [...(wine.images || [])],
});

const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const priceText = (price: number) => (price ? `${price} ₽` : '—');

const WineEditor: React.FC<{ wine: Wine; type: string; sweetness: string; onClose: () => void; onMoved: (type: string) => void }> = observer(({ wine: item, type, sweetness, onClose, onMoved }) => {
  const { wine } = useContext(Context)!;
  const types = wine.wines as WineType[];
  const { draft, patch, dirty, sync } = useDraft<WineForm>(() => toForm(item, type, sweetness));
  const { saving, msg, setMsg, run } = useSaveFlow();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sweetOptions = (types.find((t) => t.type === draft.type)?.assortment || []).map((a) => a.sweetness);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!draft.name.trim()) next.name = 'Введите название вина.';
    const year = Number(draft.year);
    if (draft.year.trim() && (!Number.isInteger(year) || year < 1900 || year > 2100)) next.year = 'Год — четыре цифры, например 2024.';
    const price = Number(draft.price.replace(/\s/g, '').replace(',', '.'));
    if (draft.price.trim() && (!Number.isFinite(price) || price < 0)) next.price = 'Цена — число, например 1800.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = () => {
    if (!validate()) { setMsg({ kind: 'error', text: 'Проверьте подсвеченные поля.' }); return; }
    void run(async () => {
      const id = item.id;
      const moved = draft.type !== type || draft.sweetness !== sweetness;
      await wine.updateWineLocal(type, sweetness, id, {
        name: draft.name.trim(),
        images: draft.images,
        description: draft.description.map((p) => p.trim()).filter(Boolean),
        sugar: draft.sugar.trim(),
        alcohol: draft.alcohol.trim(),
        temperature: draft.temperature.trim(),
        price: Number(draft.price.replace(/\s/g, '').replace(',', '.')) || 0,
        year: Number(draft.year) || new Date().getFullYear(),
        ...(moved ? { type: draft.type, sweetness: draft.sweetness } : {}),
      } as Partial<Wine>);
      const error = wine.getWineSaveError(id);
      if (error) return error;
      if (moved) {
        wine.moveWineLocal(type, sweetness, draft.type, draft.sweetness, item.id);
        onMoved(draft.type);
      }
      sync();
      return null;
    });
  };
  const cancel = () => { sync(); setErrors({}); setMsg(null); };
  const remove = () => {
    if (!window.confirm(`Удалить вино «${item.name}»? Это действие нельзя отменить.`)) return;
    wine.deleteWineLocal(type, sweetness, item.id);
    onClose();
  };
  const setParagraph = (i: number, value: string) => patch({ description: draft.description.map((p, j) => (j === i ? value : p)) });
  const status = formStatus(saving, dirty);

  return (
    <div className="adm-card">
      <BackButton onClick={() => { if (confirmDiscard()) onClose(); }} />
      <FormHead title={draft.name || 'Вино'} status={status.text} tone={status.tone} />

      <div className="adm-field">
        <label htmlFor="wine-name">Название</label>
        <input id="wine-name" className="adm-input adm-input-lg" value={draft.name} maxLength={160} aria-invalid={!!errors.name} onChange={(e) => patch({ name: e.target.value })} />
        {errors.name && <p className="adm-field-error" role="alert">{errors.name}</p>}
      </div>
      <div className="adm-grid-2">
        <div className="adm-field">
          <label htmlFor="wine-type">Цвет</label>
          <select id="wine-type" className="adm-input" value={draft.type} onChange={(e) => {
            const nextType = e.target.value;
            const options = (types.find((t) => t.type === nextType)?.assortment || []).map((a) => a.sweetness);
            patch({ type: nextType, sweetness: options.includes(draft.sweetness) ? draft.sweetness : options[0] || '' });
          }}>
            {types.map((t) => <option key={t.type} value={t.type}>{cap(t.type)}</option>)}
          </select>
        </div>
        <div className="adm-field">
          <label htmlFor="wine-sweet">Сладость</label>
          <select id="wine-sweet" className="adm-input" value={draft.sweetness} onChange={(e) => patch({ sweetness: e.target.value })}>
            {sweetOptions.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
          </select>
        </div>
        <div className="adm-field">
          <label htmlFor="wine-year">Год урожая</label>
          <input id="wine-year" className="adm-input" inputMode="numeric" value={draft.year} placeholder="2024" aria-invalid={!!errors.year} onChange={(e) => patch({ year: e.target.value })} />
          {errors.year && <p className="adm-field-error" role="alert">{errors.year}</p>}
        </div>
        <div className="adm-field">
          <label htmlFor="wine-price">Цена, ₽</label>
          <input id="wine-price" className="adm-input" inputMode="decimal" value={draft.price} placeholder="1800" aria-invalid={!!errors.price} onChange={(e) => patch({ price: e.target.value })} />
          {errors.price && <p className="adm-field-error" role="alert">{errors.price}</p>}
        </div>
        <div className="adm-field">
          <label htmlFor="wine-alc">Крепость, %</label>
          <input id="wine-alc" className="adm-input" value={draft.alcohol} placeholder="12-13" onChange={(e) => patch({ alcohol: e.target.value })} />
        </div>
        <div className="adm-field">
          <label htmlFor="wine-sugar">Сахар, г/л</label>
          <input id="wine-sugar" className="adm-input" value={draft.sugar} placeholder="5-10" onChange={(e) => patch({ sugar: e.target.value })} />
        </div>
        <div className="adm-field adm-span-2">
          <label htmlFor="wine-temp">Температура подачи, °C</label>
          <input id="wine-temp" className="adm-input" value={draft.temperature} placeholder="8-10" onChange={(e) => patch({ temperature: e.target.value })} />
        </div>
      </div>
      {(draft.type !== type || draft.sweetness !== sweetness) && <p className="adm-hint">Вино переедет в «{cap(draft.type)} · {draft.sweetness}» после сохранения.</p>}

      <FormBlock title="Описание" note="Абзацы показываются на сайте по порядку.">
        <div className="adm-para-list">
          {draft.description.map((p, i) => (
            <div key={i} className="adm-para-row">
              <textarea className="adm-input" aria-label={`Абзац ${i + 1}`} rows={2} value={p} onChange={(e) => setParagraph(i, e.target.value)} />
              <button type="button" className="adm-iconbtn" aria-label={`Удалить абзац ${i + 1}`} onClick={() => patch({ description: draft.description.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
        </div>
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => patch({ description: [...draft.description, ''] })}>+ Добавить абзац</button>
      </FormBlock>

      <FormBlock title="Фотографии" note={`${draft.images.length} фото`}>
        <PhotoGrid items={draft.images} onChange={(images) => patch({ images })} tile={{ w: 72, h: 96 }} max={10} numbered={false} />
      </FormBlock>

      <FormBar dirty={dirty} saving={saving} onSave={save} onCancel={cancel} onDelete={remove} deleteLabel="Удалить" message={msg?.kind === 'error' ? msg : null} />
    </div>
  );
});

const WinesAdmin: React.FC = observer(() => {
  const { wine } = useContext(Context)!;
  const types = wine.wines as WineType[];
  const [type, setType] = useState<string>(types[0]?.type || '');
  const [selectedUid, setSelectedUid] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);

  const active = types.find((t) => t.type === type) || types[0];
  const rows = (active?.assortment || []).flatMap((a) => a.wines.map((w) => ({ w, sweetness: a.sweetness })));
  const current = rows.find(({ w }) => uidOf(w) === selectedUid);
  useAutoSelect(rows.map(({ w }) => uidOf(w)), selectedUid, setSelectedUid);

  const pick = (name: string) => { if (confirmDiscard()) { setType(name); setSelectedUid(null); } };
  const select = (uid: number | null) => { if (confirmDiscard()) setSelectedUid(uid); };
  const add = () => {
    const group = active?.assortment[0];
    if (!active || !group || adding || !confirmDiscard()) return;
    setAdding(true);
    wine.addWine(active.type, group.sweetness);
    const list = wine.wines.find((t: WineType) => t.type === active.type)?.assortment.find((a: Assortment) => a.sweetness === group.sweetness)?.wines;
    const created = list?.[list.length - 1];
    if (created) setSelectedUid(uidOf(created));
    window.setTimeout(() => setAdding(false), 500);
  };

  return (
    <div>
      <SectionHead title="Вина" lead="Витрина вин: характеристики, цена и фотографии бутылок.">
        <button type="button" className="adm-btn adm-btn-primary" onClick={add} disabled={!active || adding}>Новое вино</button>
      </SectionHead>

      <Pills label="Цвет вина" value={active?.type || ''} onChange={pick} items={types.map((t) => ({ key: t.type, label: cap(t.type) }))} />

      <div className={`adm-split${current ? ' is-editing' : ''}`}>
        <section className="adm-split-list adm-split-wide" aria-label="Список вин">
          {rows.length > 0 ? (
            <ul className="adm-rows">
              {rows.map(({ w, sweetness }) => (
                <ListRow
                  key={uidOf(w)}
                  active={uidOf(w) === selectedUid}
                  onClick={() => select(uidOf(w))}
                  thumb={<Thumb src={w.images[0]} w={40} h={56} />}
                  title={w.name}
                  sub={wine.isSavingWine(w.id) ? 'Сохраняем…' : `${cap(active.type)} · ${sweetness}`}
                  facts={<><span>{w.year || ''}</span><strong>{priceText(w.price)}</strong></>}
                />
              ))}
            </ul>
          ) : (
            <p className="adm-empty">В этой категории пока нет вин. Нажмите «Новое вино».</p>
          )}
          {active && <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm adm-add-line" onClick={add} disabled={adding}>+ Добавить вино</button>}
        </section>

        <section className="adm-split-edit adm-split-narrow" aria-label="Редактирование вина">
          {current ? (
            <WineEditor key={uidOf(current.w)} wine={current.w} type={active.type} sweetness={current.sweetness} onClose={() => setSelectedUid(null)} onMoved={setType} />
          ) : (
            <div className="adm-card adm-empty"><p>Выберите вино слева, чтобы изменить характеристики, описание и фото.</p></div>
          )}
        </section>
      </div>
    </div>
  );
});

export default WinesAdmin;
