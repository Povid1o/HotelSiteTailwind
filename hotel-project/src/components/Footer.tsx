import React from 'react';
import { YMaps, Map, Placemark} from '@pbe/react-yandex-maps';
import { Link } from 'react-router-dom';

import "./styles/footer.css"



// Карта — отдельный переиспользуемый блок. Так на странице «Контакты» и в
// футере всегда отображается одна и та же реальная карта, а не её заглушка.
export const YandexMap = ({ height = '240px' }: { height?: string }) => {
  return (
    <div className="w-full">
      <YMaps >
        <Map defaultState={{
            center: [44.738755, 37.599938],
            zoom: 10
            }}
            style={{ width: '100%', height }}>
          <Placemark geometry={[44.738755, 37.599938]} />
        </Map>
      </YMaps>
    </div>
  );
};


const Footer = () => {

     return (
        <>
          <footer className="site-footer" id="site-contacts">
            <div className="site-footer__top">
              <Link to='/' className="site-footer__brand">Винные Террасы</Link>
              <nav className="site-footer__nav" aria-label="Навигация в подвале">
                <Link to="/Hotel">Апартаменты</Link>
                <Link to="/Events">Мероприятия</Link>
                <a href="#site-map">Как добраться</a>
                <Link to="/Contacts">Контакты</Link>
                <Link to="/Privacy">Политика конфиденциальности</Link>
              </nav>
            </div>
            <hr className="site-footer__rule" />
            <div id="site-map" className="site-footer__map"><YandexMap /></div>
            <div className="site-footer__bottom"><span>Абрау-Дюрсо, Краснодарский край</span><span>© {new Date().getFullYear()} Винные Террасы</span></div>
          </footer>
        </>
      );
}
 
export default Footer;
