import React, { memo, useState } from 'react';
import BlueSwiper from '../sliders/BlSwiper';
import Card from './Card';
import '../styles/hover.css';
import TravelLineSearchForm from '../TravelLineSearchForm';

interface Price {
  night?: number;
  week?: number;
  // Другие периоды, если есть
}

interface CheckInOut {
  checkIn?: string;
  checkOut?: string;
  minStay?: string;
}

interface ImageData {
  src?: string;
  alt?: string;
}

interface HotelRoomData {
  id: number; // Добавьте id, если он есть в ваших данных
  title?: string;
  description?: string;
  prices?: Price;
  features?: string[];
  amenities?: string[];
  rules?: string[];
  checkInOut?: CheckInOut;
  restrictions?: string[];
  images?: (string | ImageData)[]; // Массив строк или объектов ImageData
}

interface HotelRoomProps {
  viewType?: 'card' | 'extended';
  data: HotelRoomData;
}

const HotelRoom: React.MemoExoticComponent<(props: HotelRoomProps) => React.ReactElement | null> = memo(({
  viewType = 'card',
  data,
}) => {
  const {
    id,
    title,
    description,
    prices = {},
    features = [],
    amenities = [],
    rules = [],
    checkInOut = {},
    restrictions = [],
    images = [],
  } = data;

  const [showBooking, setShowBooking] = useState(false);

  // Card view component - использует только первое изображение
  if (viewType === 'card') {
    const mainImage = Array.isArray(images) ? images[0] : images;
    const imageSrc = typeof mainImage === 'string' ? mainImage : mainImage?.src;
    const imageAlt = typeof mainImage === 'string' ? 'Room image' : mainImage?.alt;

    return (
      <Card imgAlt={imageAlt} imgSrc={imageSrc}>
        <div className="flex flex-col mx-2 min-w-28 sm:mx-4 md:mx-6 lg:mx-8">
          <h2 className="font-bold mb-2 text-center text-base sm:text-2xl">
            {title}
          </h2>
          <p className="text-gray-700 mb-4 text-justify text-xs sm:text-base">
            {description}
          </p>
          <a className="underlineCard inline-block  w-fit text-nowrap mb-4 mx-2 text-left font-body font-bold text-main_theme text-base sm:text-lg sm:mb-6 sm:mx-4">
            От {prices?.night}₽
          </a>
        </div>
      </Card>
    );
  }

  // Extended view component - использует все изображения
  return (
    <div className="flex flex-col items-center justify-center max-h-4/5 max-w-5/6">
      {/* Image Swiper */}
      <div className="flex flex-col h-60 w-full md:h-80 z-0 min-w-60 lg:h-96">
        <BlueSwiper images={images} />
      </div>

      {/* Header */}
      <h2 className="text-2xl font-semibold my-4">{title}</h2>

      {/* Features */}
      <ul className="flex flex-wrap justify-center flex-row mx-auto mb-5">
        {features.map((feature, index) => (
          <li key={index} className="flex flex-row">
            <span className="h-2 w-2 bg-main_theme rounded-full my-auto mr-2" />
            <p>{feature}</p>
          </li>
        ))}
      </ul>

      {/* Description and Amenities */}
      <div className="grid grid-cols-1 mb-5 md:grid-cols-2 gap-5 lg:gap-32">
        <div className="flex flex-col max-md:mb-5">
          <h1 className="text-2xl font-semibold mb-3">Описание</h1>
          <p className="text-base">{description}</p>
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold mb-3">Удобства</h1>
          <ul className="grid grid-cols-2 gap-1">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex flex-row">
                <span className="h-1 w-1 bg-main_theme rounded-full my-auto mr-1" />
                <p className="my-auto">{amenity}</p>
              </div>
            ))}
          </ul>
        </div>
      </div>

      {/* Prices */}
      <div className="w-full max-w-md space-y-2">
        <h2 className="text-2xl font-semibold my-4">Цены</h2>
        {Object.entries(prices).map(([period, price], index) => (
          <div
            key={index}
            className="p-4 border border-gray-300 rounded-lg flex justify-between items-center"
          >
            <span className="text-lg font-semibold">
              {period === 'night' ? 'Ночь' : 'Неделя'}
            </span>
            <button
              onClick={() => setShowBooking(true)}
              className="text-lg font-semibold text-white bg-main_theme hover:bg-rose-950 px-4 py-2 rounded-lg"
            >
              ₽ {price}
            </button>
          </div>
        ))}
      </div>

      {/* Rules */}
      <div className="my-9 mr-auto">
        <strong className="text-2xl font-semibold">Правила Размещения</strong>

        <ul className="my-5 grid grid-cols-1 gap-x-20 gap-y-5 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-x-20 gap-y-5">
            <div>
              <h1 className="text-xl font-bold">Заезд</h1>
              <p>{checkInOut?.checkIn}</p>
            </div>
            <div>
              <h1 className="text-xl font-bold">Выезд</h1>
              <p>{checkInOut?.checkOut}</p>
            </div>
          </div>

        </ul>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:flex flex-row justify-around">
          {rules.map((note, index) => (
            <div key={index} className="flex flex-row mr-5">
              <span className="h-1 w-1 bg-main_theme rounded-full my-auto mr-1" />
              <p className="my-auto">{note}</p>
            </div>
          ))}
        </ul>
      </div>


      {/* Booking Button and Form */}
      <div className="w-full max-w-md my-6">
        <button
          onClick={() => setShowBooking((s) => !s)}
          className="w-full bg-main_theme hover:bg-rose-950 text-white font-semibold py-3 px-4 rounded-lg"
        >
          {showBooking ? 'Скрыть бронирование' : 'Забронировать номер'}
        </button>
        {showBooking && (
          <div className="mt-4">
            <TravelLineSearchForm id={`room-${id}-extended`} />
          </div>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.viewType === nextProps.viewType &&
         prevProps.data.id === nextProps.data.id; // Улучшенное сравнение по id
});

export default HotelRoom;