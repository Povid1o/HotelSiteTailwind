import { ImageItem } from '../../../utils/contentHelpers';

export interface RoomEmergencyData {
  id: number;
  title: string;
  description: string;
  images: ImageItem[];
  prices: { night: number; week: number };
  features: string[];
  amenities: string[];
  checkInOut: { checkIn: string; checkOut: string; minStay: string };
  restrictions: string[];
}

export const standardRoomEmergency: RoomEmergencyData = {
  id: 1,
  title: 'Номер Стандарт',
  description:
    'Аппартаменты расположены в 160 м. От моря, красивой набережной и открытыми пляжами. Разнообразие кофеин, ресторанов на любой вкус и бюджет. Велодорожка вдоль всей набережной, протяжённостью 12 км.',
  images: [
    { src: 'https://media.admagazine.ru/photos/61409580103eaf1470f8df16/16:9/w_2560%2Cc_limit/Room-9-St-Andrea-(1).jpg', alt: 'Вид спальни' },
    { src: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/42/0e/53/sant-andrea-9.jpg?w=1200&h=-1&s=1', alt: 'Вид ванной' },
    { src: 'https://flowbite.com/docs/images/carousel/carousel-3.svg', alt: 'Вид балкона' },
  ],
  prices: { night: 10000, week: 50000 },
  features: ['3 человека', '2 кровати', '2 спальни', '160 м до моря', 'Свой мангал'],
  amenities: ['Бассейн', 'Автостоянка', 'Wi-Fi', 'Свой двор', 'Спутник/кабель ТВ', 'Холодильник', 'Душ', 'Сейф'],
  checkInOut: { checkIn: 'С 13:00', checkOut: 'до 22:00', minStay: 'С 14:00 до 22:00' },
  restrictions: ['18+', 'Нельзя с животными', 'Не больше указанного количества человек на дом'],
};
