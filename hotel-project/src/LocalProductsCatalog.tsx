import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CatalogChips, CatalogSection, PRODUCTS_PATH, PickupBand, readCategories } from './components/sections/ProductBlocks';
import { findPage, txt } from './components/sections/content';
import { sec } from './components/sections/siteDefaults';
import './components/styles/v4-pages.css';
import './components/styles/v4-sections.css';

/** Ассортимент: все разделы подряд, содержание сверху. Ссылка вида /LocalProducts/Catalog#cat-2 прокручивает к нужному разделу. */
const LocalProductsCatalog = observer(() => {
  const context = useContext(Context);
  const [nav, setNav] = useState(false);
  const { hash } = useLocation();
  if (!context) throw new Error('LocalProductsCatalog context');
  const content = findPage(context.pageContent.pages, '/LocalProducts', 'Местные продукты');
  const categories = readCategories(content);
  const head = sec('catalogSection', content.catalogSection) || {};

  useEffect(() => {
    if (!hash || !categories.length) return;
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, [hash, categories.length]);

  return <><Navbar nav={nav} setNav={setNav} /><main className='v4-page'>
    <section className='v4p-title'>
      <div className='v4-container v4p-title__in'>
        <p className='v4p-crumbs'><Link to={PRODUCTS_PATH}>Местные продукты</Link> &nbsp;/&nbsp; Ассортимент</p>
        <h1>{txt(head.title, 'Ассортимент')}</h1>
        {txt(head.lead) && <p className='v4p-title__lead'>{txt(head.lead)}</p>}
      </div>
    </section>
    {categories.length > 0
      ? <>
        <CatalogChips categories={categories} />
        {categories.map((category) => <CatalogSection key={category.id} category={category} />)}
      </>
      : <section className='v4-container v4s-sec'><p className='v4s-lead'>Ассортимент скоро появится.</p></section>}
    <PickupBand data={content.pickupSection} />
    <div className='v4s-end' />
  </main><Footer /></>;
});

export default LocalProductsCatalog;
