import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WineryStepper, { Stage } from './components/sections/WineryStepper';
import { CtaBand, FactsStrip, GrapesBlock, TerroirBlock, VisitBlock, WinemakerBlock } from './components/sections/SiteBlocks';
import { findPage, list, media, rec, txt } from './components/sections/content';
import { sec } from './components/sections/siteDefaults';
import { EventCard, WineCard, WineDialog } from './components/PublicCards';
import Grape from './components/assets/Grape.jpg';
import WineBarrel from './components/assets/WineBarrel.jpg';
import WineReservour from './components/assets/WineReservour.jpg';
import './components/styles/v4-pages.css';
import './components/styles/v4-sections.css';

const FALLBACK_PHOTOS = [Grape, WineBarrel, WineReservour];
const FALLBACK_STAGES = ['Сбор винограда', 'Ферментация', 'Выдержка'];

const Vinery = observer(() => {
  const context = useContext(Context);
  const [nav, setNav] = useState(false);
  const [selectedWine, setSelectedWine] = useState<any>(null);
  if (!context) throw new Error('Vinery context');
  const content = findPage(context.pageContent.pages, '/Vinery', 'Винодельня');
  const hero = rec(content.mainBackground);
  const intro = rec(content.introSection);
  const production = rec(content.productionSection);
  const winesHead = sec('winesSection', content.winesSection);
  const eventsHead = sec('eventsSection', content.eventsSection);

  const savedStages = list(production.stages).filter((stage) => txt(stage.name));
  const stages: Stage[] = (savedStages.length ? savedStages : FALLBACK_STAGES.map((name) => ({ name }))).map((stage, index) => ({
    name: txt(stage.name),
    months: txt(stage.months),
    text: txt(stage.text),
    image: media(stage.image, FALLBACK_PHOTOS[index % FALLBACK_PHOTOS.length]),
    fallback: FALLBACK_PHOTOS[index % FALLBACK_PHOTOS.length],
  }));

  const introImage = media(intro.image);
  const introImage2 = media(intro.image2);
  const introText2 = txt(intro.text2);
  const wines = context.wine.wines.flatMap((type: any) => type.assortment.flatMap((group: any) => group.wines.map((wine: any) => ({ ...wine, type: type.type, sweetness: group.sweetness })))).slice(0, 6);
  const tastingEvents = context.events.categories.flatMap((category: any) => (category.events || []).map((event: any) => ({ ...event, category }))).slice(0, 2);

  return <><Navbar nav={nav} setNav={setNav} /><main className='v4-page'>
    <section className='v4-page__hero' style={{ backgroundImage: `linear-gradient(180deg,rgba(25,49,47,.1),rgba(25,49,47,.6)),url("${media(hero.image, '/images/VineryBackground.jpg')}")` }}><div><h1>{txt(hero.title, 'Винодельня')}</h1><p>{txt(hero.description, 'Терруар, время и ручной труд — то, что стоит за каждой бутылкой.')}</p></div></section>

    <FactsStrip data={content.factsSection} />

    <section className='v4-container v4-vinery__story'>
      <div className='v4s-story__text'>
        <p className='v4-kicker'>Территория</p>
        <h2>{txt(intro.title, 'Террасы над морем')}</h2>
        <p>{txt(intro.description, 'Лозы растут на склонах, которые видят и море, и горы — разница высот даёт разный свет и разную зрелость. Мы собираем урожай вручную, по террасе за раз, и не торопим ферментацию.')}</p>
        {introText2 && <p>{introText2}</p>}
      </div>
      {introImage2
        ? <div className='v4s-story__pics'><figure><img src={introImage} alt='Террасы виноградника' /></figure><figure><img src={introImage2} alt='' /></figure></div>
        : <figure>{introImage && <img src={introImage} alt='Террасы виноградника' />}</figure>}
    </section>

    <section className='v4-container v4s-sec' id='process'>
      <div className='v4s-head'>
        <p className='v4-kicker'>Процесс</p><h2>{txt(production.title, 'От лозы до бутылки')}</h2>
        <p className='v4s-lead'>{txt(production.lead, 'Выберите этап — или листайте стрелками по порядку.')}</p>
      </div>
      <WineryStepper stages={stages} />
    </section>

    <TerroirBlock data={content.terroirSection} />
    <GrapesBlock data={content.grapesSection} />
    <WinemakerBlock data={content.winemakerSection} />
    <VisitBlock data={content.visitSection} />

    {winesHead && <section className='v4-container v4s-sec' id='wines'>
      <div className='v4s-head'><p className='v4-kicker'>{txt(winesHead.kicker)}</p><h2>{txt(winesHead.title)}</h2></div>
      <div className='v4-wine-grid'>{wines.map((wine: any) => <WineCard key={wine.id} wine={wine} onOpen={() => setSelectedWine(wine)} />)}</div>
      <div className='v4s-center'><Link className='v4-btn v4-btn--secondary' to='/Shop'>Смотреть весь ассортимент →</Link></div>
    </section>}

    {eventsHead && tastingEvents.length > 0 && <section className='v4-container v4s-sec'>
      <div className='v4s-head'><p className='v4-kicker'>Ближайшие события</p><h2>{txt(eventsHead.title)}</h2></div>
      <div className='v4-event-grid'>{tastingEvents.map((event: any) => <EventCard key={event.id} event={event} category={event.category.header} />)}</div>
    </section>}

    <CtaBand section='ctaVinery' data={content.ctaVinery} to='/Hotel' />
    <div className='v4s-end' />
  </main><Footer />{selectedWine && <WineDialog wine={selectedWine} onClose={() => setSelectedWine(null)} />}</>;
});

export default Vinery;
