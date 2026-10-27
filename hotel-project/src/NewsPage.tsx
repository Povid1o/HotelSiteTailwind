import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { setPageMeta } from './components/SiteMeta';
import NewsCover from './components/news/NewsCover';
import { getNews, NewsListItem } from './components/http/newsAPI';
import { categoryLabel, formatNewsDate, mergeNewsSettings, NEWS_PAGE_PATH } from './components/news/newsFormat';
import './components/styles/news.css';

type LoadState = 'loading' | 'ready' | 'error';

const NewsMeta = ({ category, date }: { category: string; date: string }) => (
  <div className="news-meta">
    {category && <span className="news-meta__cat">{category}</span>}
    {date && <span className="news-meta__date">{date}</span>}
  </div>
);

const NewsPage = observer(() => {
  const [nav, setNav] = useState(false);
  const context = useContext(Context);
  const page = context?.pageContent.pages.find((item) => item.path === NEWS_PAGE_PATH);
  const settings = useMemo(
    () => mergeNewsSettings(typeof page?.content === 'object' ? (page.content as any).newsPage : undefined),
    [page]
  );

  const [category, setCategory] = useState('');
  const [items, setItems] = useState<NewsListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [state, setState] = useState<LoadState>('loading');
  const [loadingMore, setLoadingMore] = useState(false);

  // Первая порция: «главная новость» + сетка карточек.
  const firstChunk = settings.perPage + (settings.showFeatured ? 1 : 0);

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    getNews({ category: category || undefined, limit: firstChunk })
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setTotal(data.total);
        setState('ready');
      })
      .catch(() => { if (!cancelled) setState('error'); });
    return () => { cancelled = true; };
  }, [category, firstChunk]);

  useEffect(() => {
    setPageMeta(
      settings.seoTitle || `${settings.title} — Винные Террасы`,
      settings.seoDescription || settings.lead
    );
  }, [settings]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const data = await getNews({ category: category || undefined, limit: settings.perPage, offset: items.length });
      setItems((prev) => [...prev, ...data.items]);
      setTotal(data.total);
    } catch {
      setState('error');
    } finally {
      setLoadingMore(false);
    }
  };

  const featured = settings.showFeatured ? items[0] : undefined;
  const gridItems = settings.showFeatured ? items.slice(1) : items;
  const canLoadMore = items.length < total;
  const tabs = [{ key: '', label: 'Все' }, ...settings.categories];

  return (
    <>
      <Navbar nav={nav} setNav={setNav} />
      <main className="v4-page news-page">
        <section className="news-wrap news-hero">
          <p className="news-kicker">Новости</p>
          <h1 className="news-h1">{settings.title}</h1>
          {settings.lead && <p className="news-lead">{settings.lead}</p>}
        </section>

        <section className="news-wrap">
          <div className="news-tabs" role="group" aria-label="Категории новостей">
            {tabs.map((tab) => (
              <button
                key={tab.key || 'all'}
                type="button"
                className="news-tab"
                aria-pressed={category === tab.key}
                onClick={() => setCategory(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        <section className="news-wrap" aria-live="polite">
          {state === 'loading' && !items.length && <p className="news-state">Загружаем новости…</p>}
          {state === 'error' && !items.length && (
            <p className="news-state">Не удалось загрузить новости. Попробуйте обновить страницу.</p>
          )}
          {state === 'ready' && !items.length && (
            <p className="news-state">В этой рубрике пока нет новостей.</p>
          )}

          {featured && (
            <Link className="news-feat" to={`/News/${featured.slug}`}>
              <div className="news-feat__media">
                <NewsCover className="news-cover" id={featured.id} url={featured.coverUrl} alt={featured.coverAlt} priority />
              </div>
              <div className="news-feat__body">
                <NewsMeta category={categoryLabel(settings.categories, featured.category)} date={formatNewsDate(featured.publishedAt)} />
                <h2 className="news-feat__title">{featured.title}</h2>
                {featured.excerpt && <p className="news-feat__lead">{featured.excerpt}</p>}
                <span className="news-more-link">Читать новость →</span>
              </div>
            </Link>
          )}

          {gridItems.length > 0 && (
            <ul className="news-grid">
              {gridItems.map((item) => (
                <li key={item.id}>
                  <Link className="news-card" to={`/News/${item.slug}`}>
                    <div className="news-card__media">
                      <NewsCover className="news-cover" id={item.id} url={item.coverUrl} alt={item.coverAlt} />
                    </div>
                    <div>
                      <NewsMeta category={categoryLabel(settings.categories, item.category)} date={formatNewsDate(item.publishedAt)} />
                      <h3 className="news-card__title">{item.title}</h3>
                      {item.excerpt && <p className="news-card__lead">{item.excerpt}</p>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {canLoadMore && (
            <div className="news-loadmore">
              <button type="button" className="news-btn news-btn--outline" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Загружаем…' : 'Показать ещё'}
              </button>
            </div>
          )}
        </section>

        {settings.cta.enabled && (
          <section className="news-wrap">
            <div className="news-cta">
              <div className="news-cta__text">
                <h2 className="news-cta__title">{settings.cta.title}</h2>
                {settings.cta.text && <p className="news-cta__lead">{settings.cta.text}</p>}
              </div>
              <Link className="news-btn news-btn--light" to={settings.cta.href || '/Hotel'}>{settings.cta.buttonLabel}</Link>
            </div>
          </section>
        )}
        <div className="news-page-end" />
      </main>
      <Footer />
    </>
  );
});

export default NewsPage;
