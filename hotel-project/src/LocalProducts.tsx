import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CtaBand } from './components/sections/SiteBlocks';
import { CATALOG_PATH, ProductionBand, ProductsHero, ProductsToc, WhereBlock, readCategories } from './components/sections/ProductBlocks';
import { findPage } from './components/sections/content';
import './components/styles/v4-pages.css';
import './components/styles/v4-sections.css';

/** «Местные продукты»: вступление и содержание, которое ведёт в ассортимент. */
const LocalProducts = observer(() => {
  const context = useContext(Context);
  const [nav, setNav] = useState(false);
  if (!context) throw new Error('LocalProducts context');
  const content = findPage(context.pageContent.pages, '/LocalProducts', 'Местные продукты');
  const categories = readCategories(content);

  return <><Navbar nav={nav} setNav={setNav} /><main className='v4-page'>
    <ProductsHero data={content.productsHero} />
    <ProductsToc data={content.tocSection} categories={categories} />
    <ProductionBand data={content.productionSection} />
    <WhereBlock data={content.whereSection} />
    <CtaBand section='ctaProducts' data={content.ctaProducts} to={CATALOG_PATH} />
    <div className='v4s-end' />
  </main><Footer /></>;
});

export default LocalProducts;
