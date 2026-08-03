import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import { getMediaUrl } from './utils/contentHelpers';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { RoomCard, RoomDialog } from './components/PublicCards';
import './components/styles/v4-pages.css';

import TravelLineSearchForm from './components/TravelLineSearchForm';

const HotelPage = observer(() => {
  const context = useContext(Context); const [nav, setNav] = useState(false); const [filter, setFilter] = useState('Все'); const [selectedRoom, setSelectedRoom] = useState<any>(null);
  if (!context) throw new Error('HotelPage must be used within Context Provider');
  const page: any = context.pageContent.pages.find((item: any) => item.path === '/Hotel' || item.name === 'Отель');
  const hero = typeof page?.content === 'object' ? page.content.hero : null;
  const rooms = context.hotel.rooms.filter((room: any) => room.isActive !== false).filter((room: any) => filter === 'Все' || (room.properties || []).join(' ').toLowerCase().includes(filter.toLowerCase()));
  return <><Navbar nav={nav} setNav={setNav}/><main className='v4-page'>
    <section className='v4-page__hero' style={{backgroundImage:`linear-gradient(180deg,rgba(25,49,47,.1),rgba(25,49,47,.6)),url("${hero?.image ? getMediaUrl(hero.image) : '/images/Wine_Background2_AI.png'}")`}}><div><h1>{hero?.title || 'Отель'}</h1><p>{hero?.description || 'Номера на террасах — от компактного стандарта до люкса с панорамным видом.'}</p></div></section>
    <section className='v4-container v4-hotel__booking' id='booking'><TravelLineSearchForm id='hotel-page-v4' /></section>
    <section className='v4-container v4-hotel'><div className='v4-seg'>{['Все','Стандарт','Люкс'].map(item=><label key={item}><input type='radio' checked={filter===item} onChange={()=>setFilter(item)}/><span>{item}</span></label>)}</div>
      <div className='v4-hotel__grid'>{rooms.map((room:any)=><RoomCard key={room.id} room={room} onOpen={() => setSelectedRoom(room)} />)}</div>
    </section></main><Footer/>{selectedRoom && <RoomDialog room={selectedRoom} onClose={() => setSelectedRoom(null)} />}</>;
}); export default HotelPage;
