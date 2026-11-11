import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getConsent, isMetrikaConfigured, isPrivatePath, setConsent } from '../utils/metrika';
import './styles/cookie-banner.css';

const CookieBanner = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(() => isMetrikaConfigured() && getConsent() === null);

  if (!visible || isPrivatePath(pathname)) return null;

  const choose = (value: 'accepted' | 'declined') => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <div className='cookie-banner' role='region' aria-label='Уведомление об использовании cookie'>
      <p>
        Мы используем cookie и сервис Яндекс Метрика, чтобы понимать, как посетители
        пользуются сайтом. Подробнее — в <Link to='/Privacy'>политике конфиденциальности</Link>.
      </p>
      <div className='cookie-banner__actions'>
        <button type='button' className='cookie-banner__decline' onClick={() => choose('declined')}>Отказаться</button>
        <button type='button' className='cookie-banner__accept' onClick={() => choose('accepted')}>Принять</button>
      </div>
    </div>
  );
};

export default CookieBanner;
