import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';

/**
 * Загружает только данные текущей публичной страницы. Раньше App ждал весь
 * набор API-запросов до первого рендера, поэтому один медленный запрос скрывал
 * даже уже готовую главную. Здесь нет UI: страница сразу показывает свой
 * аккуратный fallback и автоматически обновляется, когда MobX-store получит
 * данные.
 */
const RouteDataLoader = observer(() => {
  const context = useContext(Context);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!context) return;

    const loadPageContent = () => {
      if (!context.pageContent.pages.length && !context.pageContent.isLoading) void context.pageContent.loadPageContent();
    };
    const loadRooms = () => {
      if (!context.hotel.rooms.length && !context.hotel.isLoading) void context.hotel.loadRooms();
    };
    const loadDishes = () => {
      if (!context.dish.dishes.length && !context.dish.isLoading) void context.dish.loadDishes();
    };
    const loadWines = () => {
      if (!context.wine.wines.length && !context.wine.isLoading) void context.wine.loadWines();
    };
    const loadEvents = () => {
      if ((!context.events.categories.length || !context.events.events.length) && !context.events.isLoading) void context.events.refreshAll();
    };

    if (pathname === '/') {
      loadPageContent();
      loadRooms();
      loadDishes();
      loadEvents();
    } else if (pathname === '/Hotel') {
      loadPageContent();
      loadRooms();
    } else if (pathname === '/Restaurant') {
      loadPageContent();
      loadDishes();
    } else if (pathname === '/Vinery') {
      loadPageContent();
      loadWines();
      loadEvents();
    } else if (pathname === '/Shop' || pathname.startsWith('/Shop/')) {
      loadPageContent();
      loadWines();
    } else if (pathname === '/Events' || pathname.startsWith('/Events/')) {
      loadPageContent();
      loadEvents();
    } else if (pathname === '/Contacts' || pathname === '/Privacy') {
      loadPageContent();
    }
  }, [context, pathname]);

  return null;
});

export default RouteDataLoader;
