import React, { useContext, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { WineCard, WineDialog } from './components/PublicCards';
import { Context } from './index';
import { getMediaUrl } from './utils/contentHelpers';
import './components/styles/v4-pages.css';
import './components/styles/v4-shop-events.css';

const Shop = observer(() => {
  const context = useContext(Context);
  const [nav, setNav] = useState(false);
  const [type, setType] = useState('');
  const [sweetness, setSweetness] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('default');
  const [selectedWine, setSelectedWine] = useState<any>(null);
  if (!context) throw new Error('Shop context');
  const page: any = context.pageContent.pages.find((item: any) => item.path === '/Shop');
  const hero = typeof page?.content === 'object' ? page.content.shopHero || {} : {};
  const wines: any[] = useMemo(() => context.wine.wines.flatMap((wineType: any) => wineType.assortment.flatMap((group: any) => group.wines.map((wine: any) => ({ ...wine, type: wineType.type, sweetness: group.sweetness })))), [context.wine.wines]);
  const types = [...new Set(wines.map(item => item.type))];
  const sweetnesses = [...new Set(wines.map(item => item.sweetness))];
  const list = wines.filter(item => (!type || item.type === type) && (!sweetness || item.sweetness === sweetness) && item.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name, 'ru') : sort === 'new' ? (b.year || 0) - (a.year || 0) : a.id - b.id);
  return <><Navbar nav={nav} setNav={setNav} /><main className='v4-page'><section className='v4-page__hero v4-shop__hero' style={{ backgroundImage: `linear-gradient(180deg,rgba(25,49,47,.1),rgba(25,49,47,.6)),url("${hero.image ? getMediaUrl(hero.image) : '/images/VineryBackground.png'}")` }}><div><h1>{hero.title || 'Весь ассортимент'}</h1><p>{hero.description || `${wines.length} вин собственного производства — от лёгкого розе до выдержанного брюта.`}</p></div></section><section className='v4-container v4-shop'><aside className='v4-shop__filters'><b>Тип вина</b><div>{types.map(item => <button className={type === item ? 'is-active' : ''} onClick={() => setType(type === item ? '' : item)} key={item}>{item}</button>)}</div><b>Сладость</b><div>{sweetnesses.map(item => <button className={sweetness === item ? 'is-active' : ''} onClick={() => setSweetness(sweetness === item ? '' : item)} key={item}>{item}</button>)}</div>{(type || sweetness) && <button className='v4-reset' onClick={() => { setType(''); setSweetness(''); }}>Сбросить фильтры</button>}</aside><div><div className='v4-shop__tools'><label>Поиск<input value={query} onChange={event => setQuery(event.target.value)} placeholder='Например, Шардоне' /></label><label>Сортировка<select value={sort} onChange={event => setSort(event.target.value)}><option value='default'>По умолчанию</option><option value='name'>По названию</option><option value='new'>Сначала новые</option></select></label></div>{list.length ? <div className='v4-wine-grid'>{list.map(wine => <WineCard key={wine.id} wine={wine} onOpen={() => setSelectedWine(wine)} />)}</div> : <div className='v4-empty'>Ничего не нашлось. Попробуйте изменить фильтры или запрос поиска.</div>}</div></section></main><Footer />{selectedWine && <WineDialog wine={selectedWine} onClose={() => setSelectedWine(null)} />}</>;
});

export default Shop;
