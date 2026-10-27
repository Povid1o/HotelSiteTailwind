import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFound from './components/NotFoundPage';
import { setPageMeta } from './components/SiteMeta';
import NewsCover from './components/news/NewsCover';
import { getNewsBySlug, NewsArticleData } from './components/http/newsAPI';
import {
  categoryLabel, formatNewsDate, formatReadingTime, mediaSrc, mergeNewsSettings, NEWS_PAGE_PATH, withStaticBase,
} from './components/news/newsFormat';
import './components/styles/news.css';

type LoadState = 'loading' | 'ready' | 'missing' | 'error';

const NewsArticle = observer(() => {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const [nav, setNav] = useState(false);
  const context = useContext(Context);
  const page = context?.pageContent.pages.find((item) => item.path === NEWS_PAGE_PATH);
  const settings = useMemo(
    () => mergeNewsSettings(typeof page?.content === 'object' ? (page.content as any).newsPage : undefined),
    [page]
  );

  const [article, setArticle] = useState<NewsArticleData | null>(null);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    setArticle(null);
    getNewsBySlug(slug)
      .then((data) => { if (!cancelled) { setArticle(data); setState('ready'); } })
      .catch((error) => { if (!cancelled) setState(error?.response?.status === 404 ? 'missing' : 'error'); });
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (!article) return;
    setPageMeta(
      article.seoTitle || `${article.title} — Винные Террасы`,
      article.seoDescription || article.excerpt,
      article.coverUrl ? new URL(mediaSrc(article.coverUrl), window.location.origin).href : undefined,
      'article'
    );
  }, [article]);

  const html = useMemo(() => (article ? withStaticBase(article.contentHtml) : ''), [article]);

  // Внутренние ссылки из текста открываем без перезагрузки страницы.
  const onBodyClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const link = (event.target as HTMLElement).closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const href = link.getAttribute('href') || '';
    if (href.startsWith('/') && !href.startsWith('//') && !link.target) {
      event.preventDefault();
      navigate(href);
    }
  };

  if (state === 'missing') return <NotFound />;

  const catLabel = article ? categoryLabel(settings.categories, article.category) : '';
  const date = article ? formatNewsDate(article.publishedAt) : '';

  return (
    <>
      <Navbar nav={nav} setNav={setNav} />
      <main className="v4-page news-page">
        {state === 'loading' && <p className="news-state">Загружаем новость…</p>}
        {state === 'error' && (
          <div className="news-state">
            <p>Не удалось загрузить новость.</p>
            <Link className="news-back" to="/News">← Все новости</Link>
          </div>
        )}

        {article && (
          <>
            <article className="news-wrap news-wrap--article news-article">
              <Link className="news-back" to="/News">← Все новости</Link>
              <div className="news-meta">
                {catLabel && <span className="news-meta__cat">{catLabel}</span>}
                {date && <span className="news-meta__date">{date}</span>}
              </div>
              <h1 className="news-article__title">{article.title}</h1>
              {article.excerpt && <p className="news-article__lead">{article.excerpt}</p>}

              {article.coverUrl && (
                <figure className="news-article__cover">
                  <NewsCover className="news-cover" id={article.id} url={article.coverUrl} alt={article.coverAlt} priority />
                </figure>
              )}

              <div className="news-article__layout">
                <aside className="news-aside" aria-label="О публикации">
                  {date && <div><div className="news-aside__label">Опубликовано</div><div className="news-aside__value">{date}</div></div>}
                  {catLabel && <div><div className="news-aside__label">Категория</div><div className="news-aside__value">{catLabel}</div></div>}
                  <div><div className="news-aside__label">Время чтения</div><div className="news-aside__value">{formatReadingTime(article.readingMinutes)}</div></div>
                  {article.tags.length > 0 && (
                    <div>
                      <div className="news-aside__label">Теги</div>
                      <div className="news-tags">{article.tags.map((tag) => <span className="news-tag" key={tag}>{tag}</span>)}</div>
                    </div>
                  )}
                </aside>
                {/* HTML очищен на сервере (sanitize-html) перед сохранением. */}
                <div className="news-article__body news-prose" onClick={onBodyClick} dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            </article>

            {settings.cta.enabled && (
              <section className="news-wrap news-wrap--article">
                <div className="news-cta">
                  <div className="news-cta__text">
                    <h2 className="news-cta__title">{settings.cta.title}</h2>
                    {settings.cta.text && <p className="news-cta__lead">{settings.cta.text}</p>}
                  </div>
                  <Link className="news-btn news-btn--light" to={settings.cta.href || '/Hotel'}>{settings.cta.buttonLabel}</Link>
                </div>
              </section>
            )}

            {article.related.length > 0 && (
              <section className="news-wrap news-wrap--article news-related" aria-labelledby="news-related-title">
                <div className="news-related__head">
                  <h2 className="news-related__title" id="news-related-title">Читайте также</h2>
                  <Link className="news-related__all" to="/News">Все новости →</Link>
                </div>
                <ul className="news-grid">
                  {article.related.map((item) => (
                    <li key={item.id}>
                      <Link className="news-card news-card--compact" to={`/News/${item.slug}`}>
                        <div className="news-card__media">
                          <NewsCover className="news-cover" id={item.id} url={item.coverUrl} alt={item.coverAlt} />
                        </div>
                        <div>
                          <div className="news-meta">
                            <span className="news-meta__cat">{categoryLabel(settings.categories, item.category)}</span>
                            <span className="news-meta__date">{formatNewsDate(item.publishedAt)}</span>
                          </div>
                          <h3 className="news-card__title">{item.title}</h3>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <div className="news-page-end" />
          </>
        )}
      </main>
      <Footer />
    </>
  );
});

export default NewsArticle;
