import React from 'react';
import ExtHotelCard from './ExtHotelCard';

const hotelData = {
  headerTitle: 'Стандарт',
  features: ['3 человека', '2 кровати', '2 спальни', '160 м до моря', 'Свой мангал'],
  description: 'Аппартаменты расположены в 160 м. От моря, красивой набережной и открытыми пляжами. Разнообразие кофеин, ресторанов на любой вкус и бюджет. Велодорожка вдоль всей набережной, протяжённостью 12 км.',
  amenities: ['Бассейн', 'Автостоянка', 'Wi-Fi', 'Свой двор', 'Спутник/кабель ТВ', 'Холодильник', 'Душ', 'Сейф'],
  prices: [
    { title: 'Ночь', price: '₽ 10000' },
    { title: 'Неделя', price: '₽ 50000' },
  ],
  rules: [
    { title: 'Заезд', description: 'С 13:00' },
    { title: 'Выезд', description: 'до 22:00' },
    { title: 'Минимальный срок проживания', description: 'С 14:00 до 22:00' },
  ],
};

const ExtHotelExample = () => {
  return (
    <div className="App">
      <ExtHotelCard {...hotelData} />
    </div>
  );
};

export default ExtHotelExample;