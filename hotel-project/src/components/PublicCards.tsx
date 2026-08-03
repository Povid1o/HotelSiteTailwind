import React, { useEffect } from 'react';
import { getMediaUrl } from '../utils/contentHelpers';
import './styles/public-cards-v4.css';

import { openTravelLineBooking } from '../utils/travelLine';

const image = (value: any) => value && !(value instanceof File) ? getMediaUrl(value.url || value) : '';
const money = (value: any) => Number(value || 0).toLocaleString('ru-RU');

const CloseIcon = () => <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'><line x1='18' y1='6' x2='6' y2='18' /><line x1='6' y1='6' x2='18' y2='18' /></svg>;

export const RoomCard = ({ room, compact = false, onOpen }: { room: any; compact?: boolean; onOpen: () => void }) => {
  const roomImage = image(room.images?.[0]);
  const price = room.price?.[0]?.price;
  const title = room.properties?.[0] || 'Номер';
  return <article className={`public-card public-room-card${compact ? ' public-room-card--compact' : ''}`}>
    <div className='public-card__media public-room-card__media'>{roomImage && <img src={roomImage} alt={room.name} />}</div>
    <div className='public-card__body'>
      <span className='public-tag'>{title}</span>
      <h3>{room.name}</h3>
      <p>{room.description || 'Номер с видом на террасы и спокойным ритмом отдыха.'}</p>
      {!compact && <div className='public-features'>{(room.conviniences || []).slice(0, 3).map((feature: string) => <span key={feature}>{feature}</span>)}</div>}
      <div className='public-card__footer'>
        <strong>{price ? `от ${money(price)} ₽` : 'По запросу'}</strong>
        <button type='button' className={compact ? 'public-link-button' : 'public-outline-button'} onClick={onOpen}>{compact ? 'Подробнее →' : 'Подробнее'}</button>
      </div>
    </div>
  </article>;
};

export const RoomDialog = ({ room, onClose }: { room: any; onClose: () => void }) => {
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown); }, [onClose]);
  if (!room) return null;
  const roomImage = image(room.images?.[0]);
  const price = room.price?.[0]?.price;
  const amenities = room.conviniences || [];
  const notes = room.notes || [];
  return <div className='public-dialog-backdrop' onMouseDown={onClose}>
    <section className='public-room-dialog' role='dialog' aria-modal='true' aria-label={room.name} onMouseDown={event => event.stopPropagation()}>
      <div className='public-dialog__header'><h3>{room.name}</h3><button type='button' onClick={onClose} aria-label='Закрыть'><CloseIcon /></button></div>
      <div className='public-room-dialog__media'>{roomImage && <img src={roomImage} alt={room.name} />}</div>
      <p className='public-room-dialog__description'>{room.description || 'Номер с видом на террасы и спокойным ритмом отдыха.'}</p>
      <div className='public-room-dialog__details'><div><b>Удобства</b>{amenities.length ? amenities.map((item: string) => <p key={item}>· {item}</p>) : <p>· По запросу</p>}</div><div><b>Заезд / выезд</b><p>С {room.checkStandart?.checkIn || '14:00'} · до {room.checkStandart?.checkOut || '12:00'}</p>{notes.map((item: string) => <small key={item}>{item}</small>)}</div></div>
      <div className='public-dialog__actions'>
        <button type='button' className='public-outline-button' onClick={onClose}>Закрыть</button>
        <button
          type='button'
          className='public-primary-button'
          onClick={(e) => {
            onClose();
            openTravelLineBooking(e, room.id);
          }}
        >
          от {price ? `${money(price)} ₽` : '…'} — Забронировать
        </button>
      </div>
    </section>
  </div>;
};

export const WineCard = ({ wine, onOpen }: { wine: any; onOpen: () => void }) => {
  const wineImage = image(wine.images?.[0]);
  return <article className='public-card public-wine-card'><button type='button' onClick={onOpen} aria-label={`Открыть: ${wine.name}`}>
    <div className='public-card__media public-wine-card__media'>{wineImage && <img src={wineImage} alt={wine.name} />}</div>
    <div className='public-card__body'><span className='public-tag'>{wine.type || 'Вино'}</span><h3>{wine.name}</h3><p>{wine.sweetness || 'Вино собственного производства'}</p><strong>{money(wine.price)} ₽</strong></div>
  </button></article>;
};

export const WineDialog = ({ wine, onClose }: { wine: any; onClose: () => void }) => {
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown); }, [onClose]);
  if (!wine) return null;
  const wineImage = image(wine.images?.[0]);
  const description = Array.isArray(wine.description) ? wine.description : [wine.description].filter(Boolean);
  return <div className='public-wine-dialog' role='dialog' aria-modal='true' aria-label={wine.name}>
    <div className='public-wine-dialog__media'>{wineImage && <img src={wineImage} alt={wine.name} />}</div>
    <section className='public-wine-dialog__content'><button className='public-back-button' type='button' onClick={onClose}>← Назад к ассортименту</button><span className='public-tag'>{wine.type || 'Вино'}</span><h1>{wine.name}</h1>
      <div className='public-wine-stats'><div><span>Алкоголь</span><b>{wine.alcohol || '—'}%</b></div><div><span>Сахар, г/дм³</span><b>{wine.sugar || '—'}</b></div><div><span>Подача, °C</span><b>{wine.temperature || '—'}</b></div></div>
      <strong className='public-wine-price'>{money(wine.price)} ₽</strong><h2>Описание</h2><div className='public-wine-description'>{description.length ? description.map((item: string, index: number) => <p key={index}>{item}</p>) : <p>Подробности о вине доступны по запросу.</p>}</div>
    </section>
  </div>;
};

export const EventCard = ({ event, category }: { event: any; category: string }) => {
  const eventImage = image(event.images?.[0]);
  return <article className='public-card public-event-card'><div className='public-card__media public-event-card__media'>{eventImage && <img src={eventImage} alt={event.title} />}</div><div className='public-card__body'><div className='public-event-card__meta'><span className='public-tag'>{category}</span><time>{event.date || 'Скоро'}</time></div><h3>{event.title}</h3><p>{event.description}</p><a href='#site-contacts'>Записаться →</a></div></article>;
};

export const DishCard = ({ dish, onOpen }: { dish: any; onOpen: () => void }) => {
  const dishImage = image(dish.images?.[0]);
  return <article className='public-dish-card'><button type='button' onClick={onOpen}><div>{dishImage && <img src={dishImage} alt={dish.name} />}</div><h3>{dish.name}</h3><p>{dish.description}</p></button></article>;
};

export const DishDialog = ({ dish, onClose }: { dish: any; onClose: () => void }) => {
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown); }, [onClose]);
  if (!dish) return null;
  const dishImage = image(dish.images?.[0]);
  const description = dish.descriptionFull || dish.description || 'Подробности о блюде доступны по запросу.';
  const price = dish.price ? `${money(dish.price)} ₽` : 'По запросу';
  return <div className='public-dialog-backdrop' onMouseDown={onClose}>
    <section className='public-dish-dialog' role='dialog' aria-modal='true' aria-label={dish.name} onMouseDown={event => event.stopPropagation()}>
      <div className='public-dialog__header'><h3>{dish.name}</h3><button type='button' onClick={onClose} aria-label='Закрыть'><CloseIcon /></button></div>
      <div className='public-dish-dialog__media'>{dishImage && <img src={dishImage} alt={dish.name} />}</div>
      <p className='public-dish-dialog__description'>{description}</p>
      {dish.weight && <p className='public-dish-dialog__weight'>{dish.weight}</p>}
      <div className='public-dialog__actions'><button type='button' className='public-outline-button' onClick={onClose}>Закрыть</button><strong>{price}</strong></div>
    </section>
  </div>;
};
