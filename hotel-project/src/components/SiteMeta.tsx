import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const pages = [
  { match: /^\/$/, title: 'Винные Террасы — отель, винодельня и ресторан', description: 'Отель, винодельня и ресторан Винные Террасы: отдых, гастрономия и вино в одном маршруте.' },
  { match: /^\/Hotel/, title: 'Отель — Винные Террасы', description: 'Номера и проживание в Винных Террасах.' },
  { match: /^\/Vinery/, title: 'Винодельня — Винные Террасы', description: 'История, территория и коллекция вин Винных Террас.' },
  { match: /^\/Restaurant/, title: 'Ресторан — Винные Террасы', description: 'Меню ресторана Винных Террас.' },
  { match: /^\/Events/, title: 'События — Винные Террасы', description: 'События, дегустации и маршруты Винных Террас.' },
  { match: /^\/News/, title: 'Новости — Винные Террасы', description: 'Новости отеля, винодельни и ресторана Винные Террасы.' },
  { match: /^\/Shop/, title: 'Коллекция вин — Винные Террасы', description: 'Коллекция вин Винных Террас. Для заказа свяжитесь с нами по email.' },
];

const setMeta = (name: string, content: string, property = false) => {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    if (property) element.setAttribute('property', name); else element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
};

/**
 * Страницы с собственными данными (например, новость) задают заголовок и описание
 * сами, после загрузки. Эффект дочерней страницы срабатывает позже SiteMeta.
 */
export const setPageMeta = (title: string, description: string, image?: string, type: 'website' | 'article' = 'website') => {
  document.title = title;
  setMeta('description', description);
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:type', type, true);
  if (image) setMeta('og:image', image, true);
};

const SiteMeta = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const current = pages.find((page) => page.match.test(pathname)) || pages[0];
    const canonical = `${window.location.origin}${pathname}`;
    document.documentElement.lang = 'ru';
    document.title = current.title;
    setMeta('description', current.description);
    setMeta('og:title', current.title, true);
    setMeta('og:description', current.description, true);
    setMeta('og:type', 'website', true);
    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;
  }, [pathname]);
  return null;
};

export default SiteMeta;
