import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GRAPE_COLORS, lines, list, media, rec, safeMapUrl, txt } from './content';
import { sec } from './siteDefaults';
import WineBarrel from '../assets/WineBarrel.jpg';
import NewsCover from '../news/NewsCover';
import { getNews, NewsListItem } from '../http/newsAPI';
import { categoryLabel, defaultNewsSettings, formatNewsDate } from '../news/newsFormat';
import '../styles/v4-sections.css';

/** Ссылка внутри сайта (/Hotel) или наружу (https://…). */
export const SmartLink: React.FC<{ to: string; className?: string; children: React.ReactNode }> = ({ to, className, children }) =>
  /^(https?:|mailto:|tel:|#)/.test(to)
    ? <a className={className} href={to}>{children}</a>
    : <Link className={className} to={to || '/'}>{children}</Link>;

const Head: React.FC<{ kicker: string; title: string; lead?: string }> = ({ kicker, title, lead }) => (
  <div className='v4s-head'><p className='v4-kicker'>{kicker}</p><h2>{title}</h2>{lead && <p className='v4s-lead'>{lead}</p>}</div>
);

/* ---------- цифры ---------- */
export const FactsStrip: React.FC<{ data: unknown }> = ({ data }) => {
  const items = list(rec(data).items).map((i) => ({ value: txt(i.value), label: txt(i.label) })).filter((i) => i.value).slice(0, 4);
  if (items.length < 2) return null;
  return (
    <section className='v4-container v4s-sec v4s-sec--tight' aria-label='Коротко о нас'>
      <ul className='v4s-facts'>{items.map((item, i) => <li key={i}><b>{item.value}</b><span>{item.label}</span></li>)}</ul>
    </section>
  );
};

/* ---------- место ---------- */
export const TerroirBlock: React.FC<{ data: unknown }> = ({ data }) => {
  const d = sec('terroirSection', data);
  if (!d) return null;
  const items = list(d.items).map((i) => ({ title: txt(i.title), text: txt(i.text) })).filter((i) => i.title);
  return (
    <section className='v4-container v4s-sec'>
      <Head kicker='Место' title={txt(d.title)} />
      <div className='v4s-terroir'>{items.map((item, i) => <div key={i}><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>
    </section>
  );
};

/* ---------- сорта ---------- */
export const GrapesBlock: React.FC<{ data: unknown }> = ({ data }) => {
  const d = sec('grapesSection', data);
  if (!d) return null;
  const items = list(d.items).filter((i) => txt(i.name));
  if (!items.length) return null;
  return (
    <section className='v4-container v4s-sec'>
      <Head kicker='Виноградник' title={txt(d.title)} lead={txt(d.lead)} />
      <div className='v4s-grapes'>
        {items.map((item, i) => {
          const type = txt(item.type);
          return (
            <Link className='v4s-grape' to='/Shop' key={i}>
              <span className='v4s-grape__berry' style={{ background: GRAPE_COLORS[type] || '#C9C98A' }} aria-hidden='true' />
              <h3>{txt(item.name)}</h3>
              {type && <span className='v4s-grape__type'>{type}</span>}
              {txt(item.note) && <p>{txt(item.note)}</p>}
              {txt(item.area) && <span className='v4s-grape__area'>{txt(item.area)}</span>}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

/* ---------- винодел ---------- */
export const WinemakerBlock: React.FC<{ data: unknown }> = ({ data }) => {
  const d = sec('winemakerSection', data);
  if (!d) return null;
  const quote = txt(d.quote);
  const name = txt(d.name);
  if (!quote && !name) return null;
  const own = media(d.image);
  return (
    <section className='v4-container v4s-sec'>
      <div className='v4s-maker'>
        <figure><img src={own || WineBarrel} alt={own ? name || 'Винодел' : ''} loading='lazy' /></figure>
        <div>
          <p className='v4-kicker v4-kicker--light'>Винодел</p>
          {quote && <blockquote>«{quote}»</blockquote>}
          {name && <p className='v4s-maker__name'>{name}</p>}
          {txt(d.role) && <p className='v4s-maker__role'>{txt(d.role)}</p>}
        </div>
      </div>
    </section>
  );
};

/* ---------- визит ---------- */
export const VisitBlock: React.FC<{ data: unknown }> = ({ data }) => {
  const d = sec('visitSection', data);
  const formats = list(d?.formats).filter((f) => txt(f.name));
  const [index, setIndex] = useState(0);
  const [dateIndex, setDateIndex] = useState(0);
  if (!d || !formats.length) return null;
  const format = formats[Math.min(index, formats.length - 1)];
  const includes = lines(format.includes);
  const dates = lines(format.dates);
  return (
    <section className='v4-container v4s-sec' id='visit'>
      <Head kicker='Приезжайте' title={txt(d.title)} />
      {formats.length > 1 && (
        <div className='v4s-formats' role='group' aria-label='Формат визита'>
          {formats.map((item, i) => (
            <button type='button' key={i} aria-pressed={i === index} onClick={() => { setIndex(i); setDateIndex(0); }}>
              <b>{txt(item.name)}</b>{txt(item.sub) && <span>{txt(item.sub)}</span>}
            </button>
          ))}
        </div>
      )}
      <div className='v4s-visit'>
        <div className='v4s-visit__main'>
          <h3>{txt(format.name)}</h3>
          {txt(format.text) && <p>{txt(format.text)}</p>}
          {includes.length > 0 && <ul className='v4s-ticks'>{includes.map((line, i) => <li key={i}>{line}</li>)}</ul>}
        </div>
        <div className='v4s-visit__side'>
          {(txt(format.duration) || txt(format.price)) && (
            <div className='v4s-visit__nums'>
              {txt(format.duration) && <div><small>Длительность</small><b>{txt(format.duration)}</b></div>}
              {txt(format.price) && <div><small>Стоимость</small><b>{txt(format.price)}</b></div>}
            </div>
          )}
          {dates.length > 0 && (
            <div>
              <small className='v4s-visit__lbl'>Ближайшие даты</small>
              <div className='v4s-dates'>{dates.map((line, i) => <button type='button' key={i} aria-pressed={i === dateIndex} onClick={() => setDateIndex(i)}>{line}</button>)}</div>
            </div>
          )}
          <a className='v4s-solid' href='#site-contacts'>Записаться{formats.length > 1 ? ` · ${txt(format.name)}` : ' на дегустацию'}</a>
        </div>
      </div>
    </section>
  );
};

/* ---------- один день ---------- */
export const DayBlock: React.FC<{ data: unknown }> = ({ data }) => {
  const d = sec('daySection', data);
  if (!d) return null;
  const steps = list(d.steps).map((s) => ({ time: txt(s.time), title: txt(s.title), text: txt(s.text) })).filter((s) => s.title).slice(0, 6);
  if (!steps.length) return null;
  return (
    <section className='v4-container v4s-sec'>
      <Head kicker='Один день' title={txt(d.title)} lead={txt(d.lead)} />
      <ol className='v4s-day' style={{ ['--v4s-cols' as any]: Math.min(steps.length, 4) }}>
        {steps.map((step, i) => (
          <li key={i}><i aria-hidden='true' />{step.time && <span className='v4s-day__time'>{step.time}</span>}<h3>{step.title}</h3>{step.text && <p>{step.text}</p>}</li>
        ))}
      </ol>
    </section>
  );
};

/* ---------- пакеты ---------- */
export const PacksBlock: React.FC<{ data: unknown }> = ({ data }) => {
  const d = sec('packagesSection', data);
  if (!d) return null;
  const items = list(d.items).filter((i) => txt(i.name)).slice(0, 6);
  if (!items.length) return null;
  return (
    <section className='v4-container v4s-sec'>
      <Head kicker='Предложения' title={txt(d.title)} />
      <div className='v4s-packs'>
        {items.map((item, i) => (
          <article key={i} className={`v4s-pack v4s-pack--${i % 3}`}>
            {txt(item.tag) && <span className='v4s-pack__tag'>{txt(item.tag)}</span>}
            <h3>{txt(item.name)}</h3>
            {txt(item.text) && <p>{txt(item.text)}</p>}
            {txt(item.price) && <b className='v4s-pack__price'>{txt(item.price)}</b>}
            <SmartLink to={txt(item.link, '/Hotel')} className='v4s-pack__btn'>Узнать подробнее</SmartLink>
          </article>
        ))}
      </div>
    </section>
  );
};

/* ---------- галерея ---------- */
/** Свои фото владельца; если их меньше трёх — запасные (фото из других блоков сайта). */
export const AtmosphereGallery: React.FC<{ data: unknown; fallback?: string[] }> = ({ data, fallback = [] }) => {
  const d = sec('atmosphereGallery', data);
  if (!d) return null;
  const own = list(d.images).map((i) => ({ src: media(i.src ?? i), alt: txt(i.alt) })).filter((i) => i.src);
  const images = (own.length >= 3 ? own : fallback.map((src) => ({ src, alt: '' }))).slice(0, 7);
  if (images.length < 3) return null;
  return (
    <section className='v4-container v4s-sec'>
      <Head kicker='Атмосфера' title={txt(d.title)} />
      <div className={`v4s-gallery n${images.length}`}>{images.map((image, i) => <figure key={i}><img src={image.src} alt={image.alt} loading='lazy' /></figure>)}</div>
    </section>
  );
};

/* ---------- новости ---------- */
export const NewsTeaser: React.FC = () => {
  const [items, setItems] = useState<NewsListItem[]>([]);
  useEffect(() => {
    let off = false;
    getNews({ limit: 3 }).then((data) => { if (!off) setItems(data.items); }).catch(() => undefined);
    return () => { off = true; };
  }, []);
  if (!items.length) return null;
  return (
    <section className='v4-container v4s-sec'>
      <div className='v4s-head v4s-head--row'>
        <div><p className='v4-kicker'>Новости</p><h2>Что нового на Террасах</h2></div>
        <Link className='v4-btn v4-btn--secondary' to='/News'>Все новости →</Link>
      </div>
      <ul className='v4s-news'>
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`/News/${item.slug}`}>
              <div className='v4s-news__img'><NewsCover className='v4s-news__cover' id={item.id} url={item.coverUrl} alt={item.coverAlt} /></div>
              <p className='v4s-news__meta'><span>{categoryLabel(defaultNewsSettings.categories, item.category)}</span>{formatNewsDate(item.publishedAt)}</p>
              <h3>{item.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

/* ---------- как добраться ---------- */
export const LocationBlock: React.FC<{ data: unknown; address: string }> = ({ data, address }) => {
  const d = sec('locationSection', data);
  if (!d) return null;
  const routes = list(d.routes).map((r) => ({ from: txt(r.from), time: txt(r.time) })).filter((r) => r.from);
  const map = safeMapUrl(d.mapUrl);
  return (
    <section className='v4-container v4s-sec'>
      <div className={`v4s-where${map ? ' has-map' : ''}`}>
        <div>
          <p className='v4-kicker'>Как добраться</p>
          <h2>{txt(d.title)}</h2>
          <p className='v4s-lead'>{txt(d.text, address)}</p>
          {routes.length > 0 && <ul className='v4s-routes'>{routes.map((route, i) => <li key={i}><span>{route.from}</span><b>{route.time}</b></li>)}</ul>}
          <a className='v4-btn v4-btn--secondary' href='#site-contacts'>Контакты и маршрут</a>
        </div>
        {map && <div className='v4s-map'><iframe src={map} title='Карта проезда' loading='lazy' referrerPolicy='no-referrer-when-downgrade' /></div>}
      </div>
    </section>
  );
};

/* ---------- отзывы ---------- */
export const ReviewsBlock: React.FC<{ data: unknown }> = ({ data }) => {
  const d = rec(data);
  const items = list(d.items).map((i) => ({ text: txt(i.text), author: txt(i.author), date: txt(i.date) })).filter((i) => i.text).slice(0, 3);
  if (!items.length) return null;
  return (
    <section className='v4-container v4s-sec'>
      <Head kicker='Гости о нас' title={txt(d.title, 'Что говорят гости')} />
      <div className='v4s-reviews'>
        {items.map((item, i) => (
          <figure key={i}>
            <blockquote>«{item.text}»</blockquote>
            {(item.author || item.date) && <figcaption>{[item.author, item.date].filter(Boolean).join(', ')}</figcaption>}
          </figure>
        ))}
      </div>
    </section>
  );
};

/* ---------- плашка с призывом ---------- */
export const CtaBand: React.FC<{ section: string; data: unknown; to: string }> = ({ section, data, to }) => {
  const d = sec(section, data);
  if (!d) return null;
  return (
    <section className='v4-container v4s-sec'>
      <div className='v4s-cta'><h2>{txt(d.title)}</h2><p>{txt(d.text)}</p><SmartLink to={to} className='v4s-cta__btn'>{txt(d.button)}</SmartLink></div>
    </section>
  );
};
