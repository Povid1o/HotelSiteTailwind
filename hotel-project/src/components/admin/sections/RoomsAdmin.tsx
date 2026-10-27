import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index';
import {
  BackButton, ChipEditor, FormBar, FormBlock, FormHead, Img, PhotoGrid, SectionHead, Switch,
  confirmDiscard, formStatus, imgSrc, useAutoSelect, useDraft, useSaveFlow,
} from '../ui';

interface RoomForm {
  name: string;
  description: string;
  checkIn: string;
  checkOut: string;
  isActive: boolean;
  images: Img[];
  properties: string[];
  conviniences: string[];
  prices: { title: string; price: string }[];
  notes: string;
}

type RoomItem = {
  id: number; name: string; images: Img[]; properties: string[]; conviniences: string[]; description: string;
  price: { title: string; price: string }[]; checkStandart: { checkIn: string; checkOut: string }; notes: string[]; isActive: boolean;
};

const toForm = (room: RoomItem): RoomForm => ({
  name: room.name,
  description: room.description,
  checkIn: room.checkStandart.checkIn,
  checkOut: room.checkStandart.checkOut,
  isActive: room.isActive,
  images: [...room.images],
  properties: [...room.properties],
  conviniences: [...room.conviniences],
  prices: room.price.map((p) => ({ title: p.title, price: Number.isFinite(Number(p.price)) ? String(Number(p.price)) : p.price })),
  notes: room.notes.join('\n'),
});

const TIME = /^([01]?\d|2[0-3]):[0-5]\d$/;
const parsePrice = (value: string) => Number(value.replace(/\s/g, '').replace(',', '.'));
const priceLabel = (room: RoomItem) => {
  const first = room.price[0];
  const value = Number(first?.price);
  return first && Number.isFinite(value) ? `${value.toLocaleString('ru-RU')} ₽` : '';
};
const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10, m100 = n % 100;
  return `${n} ${m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? few : many}`;
};

const RoomEditor: React.FC<{ roomId: number; onClose: () => void }> = observer(({ roomId, onClose }) => {
  const { hotel } = useContext(Context)!;
  const room = hotel.rooms.find((r: RoomItem) => r.id === roomId) as RoomItem | undefined;
  const { draft, patch, dirty, sync } = useDraft<RoomForm>(() => {
    const current = hotel.rooms.find((r: RoomItem) => r.id === roomId) as RoomItem | undefined;
    return current ? toForm(current) : ({ name: '', description: '', checkIn: '', checkOut: '', isActive: true, images: [], properties: [], conviniences: [], prices: [], notes: '' });
  });
  const { saving, msg, setMsg, run } = useSaveFlow();
  const [errors, setErrors] = useState<Record<string, string>>({});
  if (!room) return null;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!draft.name.trim()) next.name = 'Введите название номера.';
    if (!TIME.test(draft.checkIn.trim())) next.checkIn = 'Время в формате 14:00.';
    if (!TIME.test(draft.checkOut.trim())) next.checkOut = 'Время в формате 12:00.';
    draft.prices.forEach((p, i) => {
      if (!p.title.trim()) next[`pt${i}`] = 'Укажите название цены.';
      const value = parsePrice(p.price);
      if (!p.price.trim() || !Number.isFinite(value) || value < 0) next[`pp${i}`] = 'Цена — число, например 8500.';
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = () => {
    if (!validate()) { setMsg({ kind: 'error', text: 'Проверьте подсвеченные поля.' }); return; }
    void run(async () => {
      await hotel.updateRoomLocal(room.id, {
        name: draft.name.trim(),
        description: draft.description,
        isActive: draft.isActive,
        checkStandart: { checkIn: draft.checkIn.trim(), checkOut: draft.checkOut.trim() },
        images: draft.images,
        properties: draft.properties,
        conviniences: draft.conviniences,
        price: draft.prices.map((p) => ({ title: p.title.trim(), price: String(parsePrice(p.price)) })),
        notes: draft.notes.split('\n').map((line) => line.trim()).filter(Boolean),
      });
      const error = hotel.getRoomSaveError(room.id);
      if (!error) sync();
      return error;
    });
  };
  const cancel = () => { sync(); setErrors({}); setMsg(null); };
  const remove = () => {
    if (!window.confirm(`Удалить номер «${room.name}»? Это действие нельзя отменить.`)) return;
    hotel.deleteRoomLocal(room.id);
    onClose();
  };
  const setPrice = (i: number, part: Partial<{ title: string; price: string }>) =>
    patch({ prices: draft.prices.map((p, j) => (j === i ? { ...p, ...part } : p)) });
  const status = formStatus(saving, dirty);

  return (
    <div className="adm-card">
      <BackButton onClick={() => { if (confirmDiscard()) onClose(); }} />
      <FormHead title={draft.name || 'Номер'} status={status.text} tone={status.tone} />

      <div className="adm-grid-2">
        <div className="adm-field adm-span-2">
          <label htmlFor="room-name">Название</label>
          <input id="room-name" className="adm-input adm-input-lg" value={draft.name} maxLength={120} aria-invalid={!!errors.name} onChange={(e) => patch({ name: e.target.value })} />
          {errors.name && <p className="adm-field-error" role="alert">{errors.name}</p>}
        </div>
        <div className="adm-field adm-span-2">
          <label htmlFor="room-desc">Описание</label>
          <textarea id="room-desc" className="adm-input" rows={4} value={draft.description} onChange={(e) => patch({ description: e.target.value })} />
        </div>
        <div className="adm-field">
          <label htmlFor="room-in">Время заезда</label>
          <input id="room-in" className="adm-input" value={draft.checkIn} inputMode="numeric" placeholder="14:00" aria-invalid={!!errors.checkIn} onChange={(e) => patch({ checkIn: e.target.value })} />
          {errors.checkIn && <p className="adm-field-error" role="alert">{errors.checkIn}</p>}
        </div>
        <div className="adm-field">
          <label htmlFor="room-out">Время выезда</label>
          <input id="room-out" className="adm-input" value={draft.checkOut} inputMode="numeric" placeholder="12:00" aria-invalid={!!errors.checkOut} onChange={(e) => patch({ checkOut: e.target.value })} />
          {errors.checkOut && <p className="adm-field-error" role="alert">{errors.checkOut}</p>}
        </div>
        <div className="adm-span-2">
          <Switch label="Показывать на сайте" hint="Если выключить, номер пропадёт со страницы, но останется в админке." checked={draft.isActive} onChange={(v) => patch({ isActive: v })} />
        </div>
      </div>

      <FormBlock title="Фотографии" note="Первое фото — обложка. Порядок меняется перетаскиванием.">
        <PhotoGrid items={draft.images} onChange={(images) => patch({ images })} tile={{ w: 104, h: 72 }} max={20} />
      </FormBlock>

      <FormBlock title="Особенности" note="Короткие строки в карточке: площадь, вид, кровать.">
        <ChipEditor label="Добавить особенность" items={draft.properties} onChange={(properties) => patch({ properties })} />
      </FormBlock>

      <FormBlock title="Удобства" note="Список со значками в карточке номера.">
        <ChipEditor label="Добавить удобство" items={draft.conviniences} onChange={(conviniences) => patch({ conviniences })} max={40} />
      </FormBlock>

      <FormBlock title="Цены">
        <div className="adm-price-list">
          {draft.prices.map((p, i) => (
            <div key={i} className="adm-price-row">
              <div className="adm-price-title">
                <input className="adm-input" aria-label="Название цены" placeholder="Например, ночь" value={p.title} aria-invalid={!!errors[`pt${i}`]} onChange={(e) => setPrice(i, { title: e.target.value })} />
                {errors[`pt${i}`] && <p className="adm-field-error" role="alert">{errors[`pt${i}`]}</p>}
              </div>
              <div className="adm-price-value">
                <input className="adm-input" aria-label="Цена, ₽" placeholder="8500" inputMode="decimal" value={p.price} aria-invalid={!!errors[`pp${i}`]} onChange={(e) => setPrice(i, { price: e.target.value })} />
                {errors[`pp${i}`] && <p className="adm-field-error" role="alert">{errors[`pp${i}`]}</p>}
              </div>
              <button type="button" className="adm-iconbtn" aria-label={`Удалить цену ${i + 1}`} onClick={() => patch({ prices: draft.prices.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
        </div>
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => patch({ prices: [...draft.prices, { title: '', price: '' }] })}>+ Добавить цену</button>
      </FormBlock>

      <FormBlock title="Примечание" note="Каждая строка — отдельное примечание.">
        <textarea className="adm-input" rows={3} aria-label="Примечание" placeholder="Например: завтрак включён в стоимость" value={draft.notes} onChange={(e) => patch({ notes: e.target.value })} />
      </FormBlock>

      <FormBar dirty={dirty} saving={saving} onSave={save} onCancel={cancel} onDelete={remove} deleteLabel="Удалить номер" message={msg?.kind === 'error' ? msg : null} />
    </div>
  );
});

const RoomsAdmin: React.FC = observer(() => {
  const { hotel } = useContext(Context)!;
  const [selected, setSelected] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const rooms = hotel.rooms as RoomItem[];
  const current = rooms.find((r) => r.id === selected);
  useAutoSelect(rooms.map((r) => r.id), selected, setSelected);

  const select = (id: number | null) => { if (confirmDiscard()) setSelected(id); };
  const add = async () => {
    if (adding || !confirmDiscard()) return;
    setAdding(true);
    setAddError('');
    try {
      await hotel.addRoom();
      const created = hotel.rooms[hotel.rooms.length - 1];
      if (created) setSelected(created.id);
    } catch (error: any) {
      setAddError(error?.response?.data?.message || 'Не удалось создать номер.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <SectionHead title="Номера" lead="Карточки номеров на странице «Отель»: фото, описание, цены и удобства.">
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => void add()} disabled={adding}>{adding ? 'Создаём…' : 'Новый номер'}</button>
      </SectionHead>
      {addError && <div className="adm-notice is-error" role="alert">{addError}</div>}

      <div className={`adm-split${current ? ' is-editing' : ''}`}>
        <section className="adm-split-list" aria-label="Список номеров">
          <ul className="adm-room-list">
            {rooms.map((room) => {
              const saving = hotel.isSavingRoom(room.id);
              return (
                <li key={room.id} className={`adm-room${room.id === selected ? ' is-active' : ''}`}>
                  <div className="adm-room-cover">{room.images[0] ? <img src={imgSrc(room.images[0])} alt="" loading="lazy" /> : <span>Нет фото</span>}</div>
                  <div className="adm-room-body">
                    <div className="adm-room-head">
                      <div className="adm-room-name">{room.name}</div>
                      <span className={`adm-pill is-${saving ? 'warn' : room.isActive ? 'ok' : 'muted'}`}>{saving ? 'Сохраняем…' : room.isActive ? 'На сайте' : 'В архиве'}</span>
                    </div>
                    <div className="adm-row-sub">{room.images.length} фото · {plural(room.price.length, 'цена', 'цены', 'цен')}{priceLabel(room) ? ` · от ${priceLabel(room)}` : ''}</div>
                    <div className="adm-actions">
                      <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => select(room.id)}>Редактировать</button>
                      <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => void hotel.toggleRoomActiveLocal(room.id)} disabled={saving}>{room.isActive ? 'Скрыть' : 'Показать'}</button>
                    </div>
                  </div>
                </li>
              );
            })}
            <li><button type="button" className="adm-room-add" onClick={() => void add()} disabled={adding}>+ Добавить номер</button></li>
          </ul>
          {hotel.rooms.length === 0 && <p className="adm-empty">Номеров пока нет. Нажмите «Новый номер», чтобы создать первый.</p>}
        </section>

        <section className="adm-split-edit" aria-label="Редактирование номера">
          {current ? <RoomEditor key={current.id} roomId={current.id} onClose={() => setSelected(null)} /> : (
            <div className="adm-card adm-empty"><p>Выберите номер слева, чтобы изменить его описание, фото и цены.</p></div>
          )}
        </section>
      </div>
    </div>
  );
});

export default RoomsAdmin;
