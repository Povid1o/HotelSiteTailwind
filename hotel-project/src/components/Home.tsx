import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import TravelLineSearchForm from './TravelLineSearchForm';
import { getMediaUrl } from '../utils/contentHelpers';
import { RoomCard, RoomDialog } from './PublicCards';
import './styles/home-v3.css';

const fallback = '/images/Wine_Background2_AI.png';
const media = (value: any, alternative = '') => value && !(value instanceof File) ? getMediaUrl(value) : alternative;

const Home = observer(() => {
  const context = useContext(Context);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  if (!context) throw new Error('Home must be used within Context Provider');
  const { pageContent, hotel, dish, events } = context;
  const page: any = pageContent.pages.find((item: any) => item.path === '/' || item.name === 'Главная');
  const content: any = typeof page?.content === 'object' ? page.content : {};
  const hero = content.mainBackground || {};
  const about = content.aboutSection || {};
  const gallery = content.firstGallery || {};
  const scenery = content.secondGallery || {};
  const fallbackWhy1 = '/static/pages/why_stay_1.jpg';
  const fallbackWhy2 = '/static/pages/why_stay_2.jpg';
  const pictures = [
    media(gallery.images?.[0]?.src || gallery.images?.[0], fallbackWhy1),
    media(gallery.images?.[1]?.src || gallery.images?.[1], fallbackWhy2)
  ].filter(Boolean);
  const sceneryImage = media(scenery.images?.[0]?.src || scenery.images?.[0], fallback);
  const rooms = hotel.rooms.filter((room: any) => room.isActive !== false).slice(0, 3);
  const restaurantDish: any = dish.dishes.flatMap((section: any) => section.products || [])[0];
  const eventList: any[] = events.categories.flatMap((category: any) => (category.events || []).map((event: any) => ({ ...event, category })) ).slice(0, 2);

  return <>
    <main className='v4-home'>
    <section className='v4-home__hero' style={{ backgroundImage: `linear-gradient(180deg, rgba(25,49,47,.12), rgba(25,49,47,.78)), url("${media(hero.image, fallback)}")` }}>
      <div className='v4-container v4-home__hero-content'>
        <p className='v4-kicker v4-kicker--light'>Абрау-Дюрсо</p>
        <h1>{hero.title || 'Время, которое течёт медленнее'}</h1>
        <p className='v4-home__lead'>{hero.description || 'Терруарный retreat среди виноградников — проживание, вино, гастрономия и тишина в одном маршруте.'}</p>
        <div className='v4-actions'><Link className='v4-btn v4-btn--primary' to='/Hotel'>Выбрать номер</Link><Link className='v4-btn v4-btn--light' to='/Vinery'>Смотреть винодельню</Link></div>
      </div>
    </section>
    <section className='v4-home__booking'><TravelLineSearchForm id='home-v4' /></section>

    <section className='v4-container v4-home__why'>
      <div><p className='v4-kicker'>Почему остаться</p><h2>{about.title || 'Терраса, вино и время без расписания'}</h2><p>{about.description || 'Здесь нет программы на каждый час. Есть терраса с видом на виноградники, неспешный завтрак, дегустация без спешки и вечер у моря. Мы соединили отель, винодельню и ресторан в один маршрут — гость выбирает темп сам.'}</p></div>
      <div className='v4-home__why-gallery'><figure>{pictures[0] && <img src={pictures[0]} alt='' />}</figure><figure>{pictures[1] && <img src={pictures[1]} alt='' />}</figure></div>
    </section>

    <section className='v4-container v4-home__rooms'>
      <div className='v4-section-head'><div><p className='v4-kicker'>Проживание</p><h2>Номера с видом на террасы</h2></div><Link className='v4-btn v4-btn--secondary' to='/Hotel'>Все номера →</Link></div>
      <div className='v4-room-grid'>{rooms.map((room: any) => <RoomCard compact key={room.id} room={room} onOpen={() => setSelectedRoom(room)} />)}</div>
    </section>

    <section className='v4-container v4-home__story'><figure style={{ backgroundImage: `url("${sceneryImage}")` }} /><div><p className='v4-kicker'>Винодельня</p><h2>Место рассказывает о себе через вино</h2><p>Виноградники на террасах видят море и получают утренний свет — так формируется характер каждого сорта. Мы показываем не бутылки, а процесс: землю, время и руки.</p><Link className='v4-btn v4-btn--primary' to='/Vinery'>Узнать о винодельне →</Link></div></section>

    <section className='v4-container v4-home__duo'>
      <article className='v4-card'>{restaurantDish && <div className='v4-card__image'>{media(restaurantDish.images?.[0]) && <img src={media(restaurantDish.images?.[0])} alt={restaurantDish.name} />}</div>}<div className='v4-card__body'><p className='v4-kicker'>Ресторан</p><h3>Сезонное меню террас</h3><p>Продукты своей земли и виноделия — меню меняется с урожаем.</p><Link to='/Restaurant'>Смотреть меню →</Link></div></article>
      <article className='v4-card v4-home__events'><div className='v4-card__body'><p className='v4-kicker'>Мероприятия</p><h3>Ближайшие события</h3>{eventList.map((event: any) => <div className='v4-home__event' key={event.id}><span>{event.date || 'Скоро'}</span><div><b>{event.title}</b><p>{event.description}</p></div></div>)}<Link to='/Events'>Все мероприятия →</Link></div></article>
    </section>
    <section className='v4-home__cta'><h2>Готовы приехать?</h2><p>Выберите номер и даты — мы подтвердим бронирование в течение дня.</p><Link className='v4-btn v4-btn--primary' to='/Hotel'>Забронировать номер</Link></section>
    </main>
    {selectedRoom && <RoomDialog room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
  </>;
});
export default Home;
