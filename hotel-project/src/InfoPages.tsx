import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import Navbar from './components/Navbar';
import Footer, { YandexMap } from './components/Footer';
import './components/styles/v4-pages.css';
import './components/styles/v4-extra.css';

const contactFallback = {
  eyebrow: 'Контакты', title: 'Будем рады видеть вас на террасах',
  address: 'Абрау-Дюрсо, Краснодарский край', phone: '+7 (861) 200-00-00',
  phoneHref: '+78612000000', email: 'info@vineterraces.ru', reception: 'Ежедневно, 08:00 — 22:00'
};
const privacyFallback = [
  ['1. Какие данные мы собираем', 'Имя, телефон и почту — при бронировании номера, дегустации или места на мероприятии.'],
  ['2. Как мы их используем', 'Только для подтверждения брони и связи с вами по поводу вашего визита — без передачи третьим лицам и без рассылок без согласия.'],
  ['3. Хранение', 'Данные хранятся не дольше срока, необходимого для оказания услуги, и удаляются по вашему запросу.'],
  ['4. Ваши права', 'Вы можете запросить, изменить или удалить свои данные, написав на info@vineterraces.ru.']
];

export const Contacts = observer(() => {
  const [nav, setNav] = useState(false);
  const context: any = useContext(Context);
  const page = context?.pageContent.pages.find((item: any) => item.path === '/Contacts');
  const content = typeof page?.content === 'object' ? page.content.contacts || {} : {};
  const contact = { ...contactFallback, ...content };
  return <><Navbar nav={nav} setNav={setNav}/><main className='v4-page'><section className='v4-container v4-info'><div><p className='v4-kicker'>{contact.eyebrow}</p><h1>{contact.title}</h1><div className='v4-info__details'><div><b>Адрес</b><p>{contact.address}</p></div><div><b>Телефон</b><p><a href={`tel:${contact.phoneHref || contact.phone}`}>{contact.phone}</a></p></div><div><b>Почта</b><p><a href={`mailto:${contact.email}`}>{contact.email}</a></p></div><div><b>Ресепшн</b><p>{contact.reception}</p></div></div><Link className='v4-btn v4-btn--primary' to='/Hotel'>Забронировать номер</Link></div><div className='v4-info__map'><YandexMap height='420px' /></div></section></main><Footer/></>;
});

export const Privacy = observer(() => {
  const [nav, setNav] = useState(false);
  const context: any = useContext(Context);
  const page = context?.pageContent.pages.find((item: any) => item.path === '/Privacy');
  const content = typeof page?.content === 'object' ? page.content.privacy || {} : {};
  const sections = Array.isArray(content.sections) && content.sections.length ? content.sections : privacyFallback.map(([title, text]) => ({ title, text }));
  return <><Navbar nav={nav} setNav={setNav}/><main className='v4-page'><section className='v4-container v4-privacy'><p className='v4-kicker'>{content.eyebrow || 'Документы'}</p><h1>{content.title || 'Политика конфиденциальности'}</h1>{sections.map((section: any) => <div key={section.title}><h3>{section.title}</h3><p>{section.text}</p></div>)}</section></main><Footer/></>;
});

export default function InfoPages(){ return useLocation().pathname === '/Privacy' ? <Privacy/> : <Contacts/>; }
