import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import TravelLineSearchForm from './TravelLineSearchForm';
import { getMediaUrl } from '../utils/contentHelpers';
import { RoomCard, RoomDialog } from './PublicCards';
import { AtmosphereGallery, DayBlock, FactsStrip, LocationBlock, NewsTeaser, PacksBlock, ReviewsBlock } from './sections/SiteBlocks';
import { findPage, txt } from './sections/content';
import { sec } from './sections/siteDefaults';
import Grape from './assets/Grape.jpg';
import WineBarrel from './assets/WineBarrel.jpg';
import WineReservour from './assets/WineReservour.jpg';
import VineryBackground from './assets/VineryBackground.png';
import { contactDefault } from './pages_editable/V4InfoPageEdit';
import './styles/home-v3.css';
import './styles/v4-sections.css';

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
  const gallery = content.firstGallery || {};
  const scenery = content.secondGallery || {};
  const fallbackWhy1 = '/static/pages/why_stay_1.jpg';
  const fallbackWhy2 = '/static/pages/why_stay_2.jpg';
  const pictures = [
    media(gallery.images?.[0]?.src || gallery.images?.[0], fallbackWhy1),
    media(gallery.images?.[1]?.src || gallery.images?.[1], fallbackWhy2)
  ].filter(Boolean);
  const about2 = sec('aboutSection', content.aboutSection);
  const teaser = sec('wineryTeaser', content.wineryTeaser);
  const sceneryImage = media(teaser?.image) || media(scenery.images?.[0]?.src || scenery.images?.[0], fallback);
  const roomsHead = sec('roomsSection', content.roomsSection);
  const restaurantHead = sec('restaurantTeaser', content.restaurantTeaser);
  const galleryPhotos = Array.from(new Set([
    ...(Array.isArray(gallery.images) ? gallery.images : []), ...(Array.isArray(scenery.images) ? scenery.images : []),
  ].map((item: any) => media(item?.src || item)).filter(Boolean).concat([Grape, WineBarrel, WineReservour, VineryBackground, fallback])));
  const ctaHome = sec('ctaHome', content.ctaHome);
  const rooms = hotel.rooms.filter((room: any) => room.isActive !== false).slice(0, 3);
  const contactsContent = findPage(pageContent.pages, '/Contacts', 'Контакты');
  const address = txt((contactsContent.contacts as any)?.address, contactDefault.address);
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

    {about2 && <section className='v4-container v4-home__why'>
      <div><p className='v4-kicker'>{txt(about2.kicker)}</p><h2>{txt(about2.title)}</h2><p>{txt(about2.description)}</p></div>
      <div className='v4-home__why-gallery'><figure>{pictures[0] && <img src={pictures[0]} alt='' />}</figure><figure>{pictures[1] && <img src={pictures[1]} alt='' />}</figure></div>
    </section>}

    <FactsStrip data={content.factsSection} />

    {roomsHead && <section className='v4-container v4-home__rooms'>
      <div className='v4-section-head'><div><p className='v4-kicker'>{txt(roomsHead.kicker)}</p><h2>{txt(roomsHead.title)}</h2></div><Link className='v4-btn v4-btn--secondary' to='/Hotel'>Все номера →</Link></div>
      <div className='v4-room-grid'>{rooms.map((room: any) => <RoomCard compact key={room.id} room={room} onOpen={() => setSelectedRoom(room)} />)}</div>
    </section>}

    <DayBlock data={content.daySection} />
    <PacksBlock data={content.packagesSection} />

    {teaser && <section className='v4-container v4-home__story'><figure style={{ backgroundImage: `url("${sceneryImage}")` }} /><div><p className='v4-kicker'>{txt(teaser.kicker)}</p><h2>{txt(teaser.title)}</h2><p>{txt(teaser.text)}</p><Link className='v4-btn v4-btn--primary' to='/Vinery'>{txt(teaser.button)}</Link></div></section>}

    <AtmosphereGallery data={content.atmosphereGallery} fallback={galleryPhotos} />

    <section className='v4-container v4-home__duo'>
      {restaurantHead && <article className='v4-card'>{restaurantDish && <div className='v4-card__image'>{media(restaurantDish.images?.[0]) && <img src={media(restaurantDish.images?.[0])} alt={restaurantDish.name} />}</div>}<div className='v4-card__body'><p className='v4-kicker'>{txt(restaurantHead.kicker)}</p><h3>{txt(restaurantHead.title)}</h3><p>{txt(restaurantHead.text)}</p><Link to='/Restaurant'>{txt(restaurantHead.button)}</Link></div></article>}
      <article className='v4-card v4-home__events'><div className='v4-card__body'><p className='v4-kicker'>Мероприятия</p><h3>Ближайшие события</h3>{eventList.map((event: any) => <div className='v4-home__event' key={event.id}><span>{event.date || 'Скоро'}</span><div><b>{event.title}</b><p>{event.description}</p></div></div>)}<Link to='/Events'>Все мероприятия →</Link></div></article>
    </section>
    <NewsTeaser />
    <LocationBlock data={content.locationSection} address={address} />
    <ReviewsBlock data={content.reviewsSection} />

    {ctaHome && <section className='v4-home__cta'><h2>{txt(ctaHome.title)}</h2><p>{txt(ctaHome.text)}</p><Link className='v4-btn v4-btn--primary' to='/Hotel'>{txt(ctaHome.button)}</Link></section>}
    </main>
    {selectedRoom && <RoomDialog room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
  </>;
});
export default Home;
