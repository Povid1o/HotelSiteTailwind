import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import { getMediaUrl } from './utils/contentHelpers';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CircularGallery from './components/sliders/CircularGallery';
import { EventCard, WineCard, WineDialog } from './components/PublicCards';
import Grape from './components/assets/Grape.jpg';
import WineBarrel from './components/assets/WineBarrel.jpg';
import WineReservour from './components/assets/WineReservour.jpg';
import './components/styles/v4-pages.css';

const media = (value: any, fallback = '') => value && !(value instanceof File) ? getMediaUrl(value) : fallback;

const Vinery = observer(() => {
  const context = useContext(Context);
  const [nav, setNav] = useState(false);
  const [selectedWine, setSelectedWine] = useState<any>(null);
  if (!context) throw new Error('Vinery context');
  const page: any = context.pageContent.pages.find((item: any) => item.path === '/Vinery' || item.name === 'Винодельня');
  const content: any = typeof page?.content === 'object' ? page.content : {};
  const hero = content.mainBackground || {};
  const intro = content.introSection || {};
  const production = content.productionSection || {};
  const gallery = (production.stages || []).map((stage: any, index: number) => ({ [stage.name || `Этап ${index + 1}`]: media(stage.image, [Grape, WineBarrel, WineReservour][index % 3]) }));
  const wines = context.wine.wines.flatMap((type: any) => type.assortment.flatMap((group: any) => group.wines.map((wine: any) => ({ ...wine, type: type.type, sweetness: group.sweetness })))).slice(0, 6);
  const tastingEvents = context.events.categories.flatMap((category: any) => (category.events || []).map((event: any) => ({ ...event, category }))).slice(0, 2);

  return <><Navbar nav={nav} setNav={setNav} /><main className='v4-page'>
    <section className='v4-page__hero' style={{ backgroundImage: `linear-gradient(180deg,rgba(25,49,47,.1),rgba(25,49,47,.6)),url("${media(hero.image, '/images/VineryBackground.jpg')}")` }}><div><h1>{hero.title || 'Винодельня'}</h1><p>{hero.description || 'Терруар, время и ручной труд — то, что стоит за каждой бутылкой.'}</p></div></section>
    <section className='v4-container v4-vinery__story'><div><p className='v4-kicker'>Территория</p><h2>{intro.title || 'Террасы над морем'}</h2><p>{intro.description || 'Лозы растут на склонах, которые видят и море, и горы — разница высот даёт разный свет и разную зрелость. Мы собираем урожай вручную, по террасе за раз, и не торопим ферментацию.'}</p></div><figure>{media(intro.image) && <img src={media(intro.image)} alt='Террасы виноградника' />}</figure></section>
    <section className='v4-container v4-vinery__process'><p className='v4-kicker'>Процесс</p><h2>От лозы до бутылки</h2><div className='v4-vinery__carousel'><CircularGallery content={gallery.length ? gallery : [{ 'Сбор винограда': Grape }, { 'Ферментация': WineBarrel }, { 'Выдержка': WineReservour }]} bend={1} textColor='#f5f2ea' font='600 18px Cormorant Garamond' borderRadius={.05} /></div></section>
    <section className='v4-container v4-vinery__wines'><p className='v4-kicker'>Ассортимент</p><h2>Вина, которыми мы гордимся</h2><div className='v4-wine-grid'>{wines.map((wine: any) => <WineCard key={wine.id} wine={wine} onOpen={() => setSelectedWine(wine)} />)}</div><div className='v4-center'><Link className='v4-btn v4-btn--secondary' to='/Shop'>Смотреть весь ассортимент →</Link></div></section>
    <section className='v4-container v4-vinery__tasting-wrap'><div className='v4-vinery__tasting'><div><h3>Дегустация с виноделом</h3><p>Экскурсия по террасам и дегустация шести вин — по предварительной записи.</p></div><a href='#site-contacts' className='v4-btn v4-btn--primary'>Записаться на дегустацию</a></div></section>
    <section className='v4-container v4-vinery__events'><p className='v4-kicker'>Ближайшие события</p><h2>Дегустации на террасах</h2><div className='v4-event-grid'>{tastingEvents.map((event: any) => <EventCard key={event.id} event={event} category={event.category.header} />)}</div></section>
  </main><Footer />{selectedWine && <WineDialog wine={selectedWine} onClose={() => setSelectedWine(null)} />}</>;
});

export default Vinery;
