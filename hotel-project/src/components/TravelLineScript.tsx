// src/components/TravelLineScript.tsx
import { useEffect } from 'react';

const TravelLineScript = () => {
  useEffect(() => {
    // Инициализируем очередь команд (queue)
    window.travelline = window.travelline || {};
    const tl = window.travelline;
    tl.integration = tl.integration || {};
    const ti = tl.integration;
    ti.__cq = ti.__cq || [];

    // Пушим команды в очередь (setContext и embed для search-form)
    ti.__cq.push(["setContext", "TL-INT-putvina-rf_2025-09-10", "ru"]);
    ti.__cq.push(["embed", "search-form", { container: "tl-search-form" }]);

    // Если loader еще не загружен, загружаем его
    if (!ti.__loader) {
      ti.__loader = true;
      const hosts = ["ru-ibe.tlintegration.ru", "ibe.tlintegration.ru", "ibe.tlintegration.com"];
      const script = document.createElement('script');
      script.type = "text/javascript";
      script.async = true;
      script.src = `https://${hosts[0]}/integration/loader.js`;

      // Обработка ошибок/фоллбэка на другие хосты (как в оригинале)
      const fallback = (hostsCopy) => {
        if (hostsCopy.length === 0) return;
        script.src = `https://${hostsCopy[0]}/integration/loader.js`;
        script.onerror = script.onload = () => fallback(hostsCopy.slice(1)); // Рекурсивный фоллбэк
      };
      script.onerror = script.onload = () => fallback(hosts.slice(1));

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  return null;
};

export default TravelLineScript;