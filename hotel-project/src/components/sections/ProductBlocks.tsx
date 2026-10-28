import React from 'react';
import { Link } from 'react-router-dom';
import { list, media, txt } from './content';
import { sec } from './siteDefaults';
import { SmartLink } from './SiteBlocks';
import '../styles/v4-products.css';

export const PRODUCTS_PATH = '/LocalProducts';
export const CATALOG_PATH = '/LocalProducts/Catalog';
export const CATEGORY_SLOTS = 4;

export const SHAPES = ['Банка', 'Бутылка', 'Жестяная баночка'];
export const COLORS: Record<string, string> = {
  'Терракота': '#C7774D',
  'Песочный': '#D9A47F',
  'Коричневый': '#8F4524',
  'Шалфей': '#7FA08F',
  'Хвоя': '#1F4D4A',
};
const BACKDROP: Record<string, string> = { 'Банка': '#F0E4D2', 'Бутылка': '#E3ECE6', 'Жестяная баночка': '#F1E6DC' };

export interface Product { name: string; text: string; tag: string; size: string; price: string; shape: string; color: string; image: string }
export interface Category { n: number; id: string; name: string; toc: string; lead: string; products: Product[] }

/** Разделы ассортимента: пустые и скрытые пропускаются, номера идут по порядку. */
export const readCategories = (content: Record<string, any>): Category[] => {
  const out: Category[] = [];
  for (let slot = 1; slot <= CATEGORY_SLOTS; slot += 1) {
    const d = sec(`productsCategory${slot}`, content[`productsCategory${slot}`]);
    if (!d || !txt(d.name)) continue;
    const products = list(d.products).filter((p) => txt(p.name)).map((p): Product => ({
      name: txt(p.name), text: txt(p.text), tag: txt(p.tag), size: txt(p.size), price: txt(p.price),
      shape: txt(p.shape, 'Банка'), color: txt(p.color, 'Терракота'), image: media(p.image),
    }));
    if (!products.length) continue;
    out.push({ n: out.length + 1, id: `cat-${out.length + 1}`, name: txt(d.name), toc: txt(d.toc), lead: txt(d.lead), products });
  }
  return out;
};

export const pluralItems = (n: number) => {
  const mod10 = n % 10; const mod100 = n % 100;
  const word = mod10 === 1 && mod100 !== 11 ? 'позиция' : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'позиции' : 'позиций';
  return `${n} ${word}`;
};
export const num = (n: number) => (n < 10 ? `0${n}` : String(n));

/** Иллюстрация товара: своё фото, а если его нет — нарисованная банка, бутылка или жестянка. */
export const ProductArt: React.FC<{ shape: string; color: string; image?: string; alt?: string; size?: string }> = ({ shape, color, image, alt = '', size = '62%' }) => {
  if (image) return <img src={image} alt={alt} loading='lazy' />;
  const fill = COLORS[color] || COLORS['Терракота'];
  return (
    <svg viewBox='0 0 200 200' width={size} aria-hidden='true' role='presentation'>
      {shape === 'Бутылка' ? (
        <g>
          <rect x='86' y='20' width='28' height='56' rx='6' fill={fill} /><rect x='82' y='12' width='36' height='14' rx='4' fill='#19312F' />
          <rect x='68' y='64' width='64' height='130' rx='22' fill={fill} /><rect x='76' y='104' width='48' height='56' rx='5' fill='#F5F2EA' />
          <circle cx='100' cy='124' r='9' fill='#C7774D' /><rect x='86' y='142' width='28' height='4' rx='2' fill='#1F4D4A' />
        </g>
      ) : shape === 'Жестяная баночка' ? (
        <g>
          <rect x='50' y='88' width='100' height='84' rx='10' fill={fill} /><rect x='46' y='76' width='108' height='16' rx='5' fill='#19312F' />
          <rect x='62' y='108' width='76' height='44' rx='5' fill='#F5F2EA' /><rect x='72' y='120' width='56' height='5' rx='2.5' fill='#C7774D' /><rect x='72' y='132' width='38' height='5' rx='2.5' fill='#1F4D4A' />
        </g>
      ) : (
        <g>
          <rect x='52' y='64' width='96' height='104' rx='14' fill={fill} /><rect x='48' y='44' width='104' height='26' rx='6' fill='#19312F' />
          <rect x='64' y='94' width='72' height='50' rx='6' fill='#F5F2EA' /><rect x='74' y='106' width='52' height='5' rx='2.5' fill='#1F4D4A' /><rect x='74' y='118' width='36' height='5' rx='2.5' fill='#C7774D' />
        </g>
      )}
    </svg>
  );
};

/** Обложка раздела по умолчанию: банка, две бутылки и жестянка. */
const HeroArt: React.FC = () => (
  <svg viewBox='0 0 400 400' width='100%' aria-hidden='true' role='presentation'>
    <circle cx='200' cy='206' r='188' fill='#DCE5DE' /><rect x='50' y='318' width='300' height='10' rx='5' fill='#B9C7BF' />
    <rect x='64' y='212' width='112' height='106' rx='14' fill='#C7774D' /><rect x='60' y='190' width='120' height='28' rx='6' fill='#19312F' />
    <rect x='76' y='238' width='88' height='54' rx='6' fill='#F5F2EA' /><rect x='88' y='252' width='64' height='5' rx='2.5' fill='#1F4D4A' /><rect x='88' y='264' width='44' height='5' rx='2.5' fill='#C7774D' />
    <rect x='204' y='132' width='30' height='62' rx='6' fill='#1F4D4A' /><rect x='200' y='122' width='38' height='14' rx='4' fill='#19312F' />
    <rect x='186' y='182' width='66' height='138' rx='22' fill='#1F4D4A' /><rect x='194' y='234' width='50' height='46' rx='5' fill='#F5F2EA' />
    <rect x='260' y='152' width='26' height='52' rx='6' fill='#D9A47F' /><rect x='256' y='142' width='34' height='13' rx='4' fill='#8F4524' />
    <rect x='244' y='192' width='58' height='128' rx='20' fill='#D9A47F' /><rect x='251' y='238' width='44' height='42' rx='5' fill='#F5F2EA' />
    <rect x='306' y='278' width='52' height='42' rx='6' fill='#8F4524' /><rect x='303' y='270' width='58' height='12' rx='4' fill='#19312F' /><circle cx='332' cy='302' r='9' fill='#F5F2EA' />
  </svg>
);

/** Полки кладовой — картинка блока «О производстве», пока нет фото. */
const ShelfArt: React.FC = () => (
  <svg viewBox='0 0 200 200' preserveAspectRatio='xMidYMid slice' width='100%' height='100%' aria-hidden='true' role='presentation'>
    <rect width='200' height='200' fill='#2B5F5A' />
    {[62, 122, 182].map((y) => <rect key={y} x='0' y={y} width='200' height='6' fill='#19312F' opacity='.5' />)}
    <g fill='#C7774D'><rect x='16' y='38' width='22' height='24' rx='4' /><rect x='46' y='38' width='22' height='24' rx='4' /><rect x='76' y='38' width='22' height='24' rx='4' /></g>
    <g fill='#DCE5DE'><rect x='118' y='26' width='16' height='36' rx='5' /><rect x='142' y='26' width='16' height='36' rx='5' /><rect x='166' y='26' width='16' height='36' rx='5' /></g>
    <g fill='#E3B68F'><rect x='16' y='98' width='30' height='24' rx='4' /><rect x='54' y='98' width='30' height='24' rx='4' /></g>
    <g fill='#C7774D'><rect x='104' y='86' width='16' height='36' rx='5' /><rect x='128' y='86' width='16' height='36' rx='5' /><rect x='152' y='86' width='16' height='36' rx='5' /></g>
    <g fill='#DCE5DE'><rect x='16' y='150' width='22' height='32' rx='4' /><rect x='46' y='150' width='22' height='32' rx='4' /></g>
    <g fill='#E3B68F'><rect x='92' y='158' width='30' height='24' rx='4' /><rect x='130' y='158' width='30' height='24' rx='4' /></g>
  </svg>
);

const ICONS: Record<string, string> = {
  'Отель': 'M3 21V8l9-5 9 5v13M9 21v-7h6v7',
  'Ресторан': 'M6 3v8a3 3 0 003 3v7M10 3v6M14 3c0 6 4 6 4 11v7',
  'Винодельня': 'M8 3h8l-1 8a3 3 0 01-6 0L8 3zM12 14v7M8 21h8',
  'Магазин': 'M4 7h16l-1 13H5L4 7zM9 7a3 3 0 016 0',
};
export const ICON_NAMES = Object.keys(ICONS);

const Head: React.FC<{ kicker: string; title: string; lead?: string }> = ({ kicker, title, lead }) => (
  <div className='v4s-head'><p className='v4-kicker'>{kicker}</p><h2>{title}</h2>{lead && <p className='v4s-lead'>{lead}</p>}</div>
);

const Arrow: React.FC = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M5 12h14M13 6l6 6-6 6' /></svg>
);

/* ---------- шапка раздела ---------- */
export const ProductsHero: React.FC<{ data: unknown }> = ({ data }) => {
  const d = sec('productsHero', data) || {};
  const image = media(d.image);
  return (
    <section className='v4p-hero'>
      <div className='v4-container v4p-hero__in'>
        <div className='v4p-hero__text'>
          <p className='v4-kicker'>{txt(d.kicker)}</p>
          <h1>{txt(d.title)}</h1>
          {txt(d.text) && <p className='v4p-hero__lead'>{txt(d.text)}</p>}
          <div className='v4-actions'>
            {txt(d.primary) && <Link className='v4s-solid' to={CATALOG_PATH}>{txt(d.primary)}</Link>}
            {txt(d.secondary) && <a className='v4-btn v4-btn--secondary' href='#where'>{txt(d.secondary)}</a>}
          </div>
        </div>
        <div className='v4p-hero__art'>{image ? <img src={image} alt='' /> : <HeroArt />}</div>
      </div>
    </section>
  );
};

/* ---------- содержание ---------- */
export const ProductsToc: React.FC<{ data: unknown; categories: Category[] }> = ({ data, categories }) => {
  const d = sec('tocSection', data) || {};
  return (
    <section className='v4-container v4s-sec v4p-sec' id='toc'>
      <Head kicker='Содержание' title={txt(d.title)} lead={txt(d.lead)} />
      {categories.length === 0 ? <p className='v4s-lead'>Ассортимент скоро появится.</p> : (
        <>
          <ol className='v4p-toc'>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link className='v4p-toc__row' to={`${CATALOG_PATH}#${cat.id}`}>
                  <span className='v4p-toc__n'>{num(cat.n)}</span>
                  <span className='v4p-toc__main'><b>{cat.name}</b>{cat.toc && <span>{cat.toc}</span>}</span>
                  <span className='v4p-toc__thumbs' aria-hidden='true'>
                    {cat.products.slice(0, 3).map((p, i) => <i key={i} style={{ background: COLORS[p.color] || COLORS['Терракота'] }} />)}
                  </span>
                  <span className='v4p-toc__cnt'>{pluralItems(cat.products.length)}</span>
                  <span className='v4p-toc__arr'><Arrow /></span>
                </Link>
              </li>
            ))}
          </ol>
          {txt(d.all) && <div className='v4p-toc__all'><Link className='v4-btn v4-btn--secondary' to={CATALOG_PATH}>{txt(d.all)}</Link></div>}
        </>
      )}
    </section>
  );
};

/* ---------- о производстве ---------- */
export const ProductionBand: React.FC<{ data: unknown }> = ({ data }) => {
  const d = sec('productionSection', data);
  if (!d || !txt(d.title)) return null;
  const image = media(d.image);
  const points = list(d.points).map((p) => txt(p.text)).filter(Boolean);
  return (
    <section className='v4-container v4s-sec v4p-sec'>
      <div className='v4p-band'>
        <figure className='v4p-band__pic'>{image ? <img src={image} alt='' loading='lazy' /> : <ShelfArt />}</figure>
        <div className='v4p-band__text'>
          <p className='v4-kicker v4-kicker--light'>{txt(d.kicker)}</p>
          <h2>{txt(d.title)}</h2>
          {txt(d.text) && <p>{txt(d.text)}</p>}
          {points.length > 0 && <ul className='v4p-points'>{points.map((point, i) => <li key={i}>{point}</li>)}</ul>}
        </div>
      </div>
    </section>
  );
};

/* ---------- где купить ---------- */
export const WhereBlock: React.FC<{ data: unknown }> = ({ data }) => {
  const d = sec('whereSection', data);
  if (!d) return null;
  const items = list(d.items).filter((i) => txt(i.name));
  if (!items.length) return null;
  return (
    <section className='v4-container v4s-sec v4p-sec' id='where'>
      <Head kicker='Где купить' title={txt(d.title)} lead={txt(d.lead)} />
      <ul className='v4p-where'>
        {items.map((item, i) => (
          <li key={i}>
            <span className='v4p-where__ico' aria-hidden='true'>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'><path d={ICONS[txt(item.icon)] || ICONS['Магазин']} /></svg>
            </span>
            <h3>{txt(item.name)}</h3>
            {txt(item.text) && <p>{txt(item.text)}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
};

/* ---------- разделы ассортимента ---------- */
export const CatalogChips: React.FC<{ categories: Category[] }> = ({ categories }) => (
  <nav className='v4p-chips' id='toc' aria-label='Разделы ассортимента'>
    <div className='v4-container v4p-chips__in'>
      {categories.map((cat) => <a key={cat.id} href={`#${cat.id}`}><b>{num(cat.n)}</b> {cat.name}</a>)}
    </div>
  </nav>
);

export const CatalogSection: React.FC<{ category: Category }> = ({ category }) => (
  <section className='v4-container v4s-sec v4p-sec v4p-cat' id={category.id} aria-labelledby={`${category.id}-t`}>
    <div className='v4s-head v4s-head--row'>
      <div>
        <p className='v4-kicker'>{num(category.n)} · Раздел</p>
        <h2 id={`${category.id}-t`}>{category.name}</h2>
        {category.lead && <p className='v4s-lead'>{category.lead}</p>}
      </div>
      <a className='v4-btn v4-btn--secondary' href='#toc'>↑ К содержанию</a>
    </div>
    <ul className='v4p-grid'>
      {category.products.map((p, i) => (
        <li key={i}>
          <article className='v4p-card'>
            <div className='v4p-card__pic' style={{ background: p.image ? '#EAE6DA' : BACKDROP[p.shape] || BACKDROP['Банка'] }}>
              <ProductArt shape={p.shape} color={p.color} image={p.image} alt={p.name} />
              {p.tag && <span className='v4p-card__tag'>{p.tag}</span>}
            </div>
            <div className='v4p-card__body'>
              <h3>{p.name}</h3>
              {p.text && <p>{p.text}</p>}
              {(p.size || p.price) && <div className='v4p-card__meta'><span>{p.size}</span><b>{p.price}</b></div>}
            </div>
          </article>
        </li>
      ))}
    </ul>
  </section>
);

/* ---------- как забрать ---------- */
export const PickupBand: React.FC<{ data: unknown }> = ({ data }) => {
  const d = sec('pickupSection', data);
  if (!d || !txt(d.title) || !(txt(d.text) || txt(d.button))) return null;
  return (
    <section className='v4-container v4s-sec v4p-sec'>
      <div className='v4p-pickup'>
        <div><h2>{txt(d.title)}</h2>{txt(d.text) && <p>{txt(d.text)}</p>}</div>
        <div className='v4-actions'>
          {txt(d.button) && <SmartLink to={txt(d.buttonLink, '#site-contacts')} className='v4s-cta__btn'>{txt(d.button)}</SmartLink>}
          {txt(d.button2) && <SmartLink to={txt(d.button2Link, '#site-map')} className='v4-btn v4-btn--light'>{txt(d.button2)}</SmartLink>}
        </div>
      </div>
    </section>
  );
};

