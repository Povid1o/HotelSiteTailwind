import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { hit, initMetrika } from '../utils/metrika';

/**
 * Отправляет в Метрику просмотр при каждой смене маршрута SPA.
 * UI нет; если счётчик не настроен или нет согласия, ничего не делает.
 */
const MetrikaTracker = () => {
  const { pathname, search, hash } = useLocation();
  const previousUrl = useRef(document.referrer);

  useEffect(() => {
    initMetrika();
    const url = window.location.href;
    hit(url, previousUrl.current);
    previousUrl.current = url;
  }, [pathname, search, hash]);

  return null;
};

export default MetrikaTracker;
