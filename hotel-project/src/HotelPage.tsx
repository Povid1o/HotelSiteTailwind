import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import { getMediaUrl } from './utils/contentHelpers';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './components/styles/v4-pages.css';

const HotelPage = observer(() => {
  const context = useContext(Context); const [nav, setNav] = useState(false); const [filter, setFilter] = useState('Все');
  if (!context) throw new Error('HotelPage must be used within Context Provider');
  const page: any = context.pageContent.pages.find((item: any) => item.path === '/Hotel' || item.name === 'Отель');
  const hero = typeof page?.content === 'object' ? page.content.hero : null;
  const rooms = context.hotel.rooms.filter((room: any) => room.isActive !== false).filter((room: any) => filter === 'Все' || (room.properties || []).join(' ').toLowerCase().includes(filter.toLowerCase()));
  return <><Navbar nav={nav} setNav={setNav}/><main className='v4-page'>
    <section className='v4-page__hero' style={{backgroundImage:`linear-gradient(180deg,rgba(25,49,47,.1),rgba(25,49,47,.6)),url("${hero?.image ? getMediaUrl(hero.image) : '/images/Wine_Background2_AI.png'}")`}}><div><h1>{hero?.title || 'Отель'}</h1><p>{hero?.description || 'Номера на террасах — от компактного стандарта до люкса с панорамным видом.'}</p></div></section>
    <section className='v4-container v4-hotel'><div className='v4-seg'>{['Все','Стандарт','Люкс'].map(item=><label key={item}><input type='radio' checked={filter===item} onChange={()=>setFilter(item)}/><span>{item}</span></label>)}</div>
      <div className='v4-hotel__grid'>{rooms.map((room:any)=>{const image=room.images?.[0] ? getMediaUrl(room.images[0]) : '';const price=room.price?.[0]?.price;return <article className='v4-card' key={room.id}><div className='v4-card__image v4-hotel__image'>{image&&<img src={image} alt={room.name}/>}</div><div className='v4-card__body'><span className='v4-tag'>{room.properties?.[0] || 'Номер'}</span><h3>{room.name}</h3><p>{room.description}</p><div className='v4-feature-list'>{(room.conviniences||[]).slice(0,3).map((feature:string)=><span key={feature}>{feature}</span>)}</div><div className='v4-card__footer'><strong>{price?`от ${Number(price).toLocaleString('ru-RU')} ₽`:'По запросу'}</strong><button className='v4-btn v4-btn--secondary'>Подробнее</button></div></div></article>})}</div>
    </section></main><Footer/></>;
}); export default HotelPage;
