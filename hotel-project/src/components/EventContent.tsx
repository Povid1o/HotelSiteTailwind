import React, { useContext, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { LuCalendarDays, LuCompass, LuGlassWater, LuSun, LuUtensils, LuWine } from 'react-icons/lu';
import { Context } from '../index';
import { getMediaUrl } from '../utils/contentHelpers';
import './styles/v4-pages.css';
import './styles/v4-shop-events.css';

const categoryIcon = (header: string) => {
  const name = header.toLowerCase();
  if (name.includes('дегуста')) return <LuWine />;
  if (name.includes('ресторан')) return <LuUtensils />;
  if (name.includes('экскурс')) return <LuCompass />;
  if (name.includes('open') || name.includes('сезон')) return <LuSun />;
  if (name.includes('акци')) return <LuGlassWater />;
  return <LuCalendarDays />;
};

const EventContent = observer(() => {
  const context = useContext(Context);
  const [active, setActive] = useState('');
  if (!context) throw new Error('Events context');
  const page: any = context.pageContent.pages.find((item: any) => item.path === '/Events');
  const hero = typeof page?.content === 'object' ? page.content.hero || {} : {};
  const categories = context.events.categories;
  const items = useMemo(() => categories.flatMap((category: any) => (category.events || []).map((event: any) => ({ ...event, category }))), [categories]);
  const visible = active ? items.filter((event: any) => event.category.id === Number(active)) : items;
  return <main className='v4-page'>
    <section className='v4-page__hero v4-events__hero' style={{ backgroundImage: `linear-gradient(180deg,rgba(25,49,47,.1),rgba(25,49,47,.6)),url('${hero.image ? getMediaUrl(hero.image) : '/images/VineryBackground.png'}')` }}>
      <div><h1>{hero.title || 'Мероприятия'}</h1><p>{hero.description || 'Дегустации, ужины и события на террасах — приходите или бронируйте место заранее.'}</p></div>
    </section>
    <section className='v4-container v4-events'>
      <p className='v4-kicker'>Категории</p>
      <div className='v4-event-chips'>{categories.map((category: any) => <button key={category.id} className={active === String(category.id) ? 'is-active' : ''} onClick={() => setActive(active === String(category.id) ? '' : String(category.id))}>{categoryIcon(category.header)}{category.header}</button>)}</div>
      <div className='v4-events__grid'>{visible.map((event: any) => <article className='v4-card' key={event.id}><div className='v4-events__image'>{event.images?.[0]?.url && <img src={getMediaUrl(event.images[0].url)} alt={event.title} />}</div><div className='v4-card__body'><span className='v4-tag'>{event.category.header}</span><h3>{event.title}</h3><p>{event.description}</p><a href='#site-contacts'>Записаться →</a></div></article>)}</div>
    </section>
  </main>;
});

export default EventContent;
