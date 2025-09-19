// Нужно
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { fetchVideos, createVideo, updateVideo, deleteVideo, Video } from "../src/components/http/videoAPI.tsx";

import Navbar from './components/Navbar';
import HomeEdit from './components/pages_editable/HomeEdit';
import VineryEdit from './components/pages_editable/VineryEdit';
import Card from './components/cards/Card';
import axios from "axios";

// import product from "./storage/ProductStorage.tsx"

import CreateProduct from './components/modals/CreateProduct';
import CreateClase from './components/modals/CreateClase';
import CreateType from './components/modals/СreateType';
import ModalsCard from './components/modals/ModalsCard'

import { Context } from './index';
import { observer } from 'mobx-react-lite';

import NewRoomCard from './components/modals/NewRoomCard';
import NewDishCard from './components/modals/NewDishCard';
import NewWineCard from './components/modals/NewWineCard';
import ExtCard from './components/cards/ExtCard';
import DescriptionInput from './components/text_inputs/DescriptionInput';
import Button from './components/text_inputs/Button';
import { Tabs } from "flowbite-react";
import { Table } from "flowbite-react";
import "./AdminPage.css";


import {fetchProducts, createProduct, updateProduct, deleteProduct, Product} from "./components/http/productAPI";

// Нужно
// (можно будет удалить, когда вставим бэк)
import Bottle from './components/assets/wine-bottle.png';
import Calendar from './components/assets/calendar.png';
import Excursion from './components/assets/excursion.png';
import Running from './components/assets/running.png';
// (можно будет удалить, когда вставим бэк)
// начало фоток для страниц(можно будет удалить, когда вставим бэк)
import VectorImage from './components/assets/Vector1.png';
import ThreeBottles from './components/assets/ThreeBottles.png';
import WineCaps from './components/assets/WineCaps.png';
import BottleTransparent from './components/assets/BottleTransparent.png';
import BottleTransparentHorizontal from './components/assets/BottleTransparentHorizontal.png';
import WineReservour from './components/assets/WineReservour.png';
import WineBarrel from './components/assets/WineBarrel.png';
import Grape from './components/assets/Grape.png';
import BottleProduce from './components/assets/BottleProduce.png';
import GrapeLines from './components/assets/GrapeLines.jpg';
import BackgroundImage from './images/Wine_Background2_AI.png';
// конец фоток для страниц(можно будет удалить, когда вставим бэк)
// Нужно
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { IoTicket } from "react-icons/io5";
import { FaWineGlassAlt } from "react-icons/fa";
import { FaHotel } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { MdOutlineRestaurant, MdModeEdit } from "react-icons/md";
// Нужно

// Начальные изображения для комнат
const initialImages = [
  { src: Calendar, alt: 'Calendar' },
  { src: Excursion, alt: 'Excursion' },
  { src: Running, alt: 'Running' },
  { src: Bottle, alt: 'Bottle' },
];

const addType = () => {
  return (
    <Card>
      <button className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48">
        Добавить тип
      </button>
    </Card>
  );
};

const addClase = () => {
  return (
    <Card>
      <button className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48">
        Добавить Класс
      </button>
    </Card>
  );
};

const addProduct = () => {
  return (
    <Card>
      <button className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48">
        Добавить Продукт
      </button>
    </Card>
  );
};

const AddCategory = ({onClick}) => {
  return (
    <Card>
      <button className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48" onClick={onClick}>
        Добавить Категорию
      </button>
    </Card>
  );
};

const AdminPage = observer(() =>  {
  // let product = new product()
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<{ name: string; price: number }>({
    name: "",
    price: 0,
  });
  const [newProductData, setNewProductData] = useState<{ name: string; price: number }>({ name: '', price: 0 });


  const context = useContext(Context);
  if (!context) {
    throw new Error('AdminPage must be used within Context Provider');
  }
  const { dish, hotel, pageContent, wine, product } = context;

  useEffect(() => {
    console.log('=== НАЧАЛО ЗАГРУЗКИ ДАННЫХ ===');
    console.log('API_URL:', process.env.REACT_APP_API_URL);

    const loadData = async () => {
      try {
        console.log('Загружаем блюда...');
        await dish.loadDishes();
        console.log('✅ Блюда загружены:', dish.dishes);
      } catch (error) {
        console.error('❌ Ошибка загрузки блюд:', error);

        console.error('Детали ошибки:', {
          // @ts-ignore
          message: error.message,
          // @ts-ignore
          stack: error.stack,
          // @ts-ignore
          response: error.response?.data,
          // @ts-ignore
          status: error.response?.status,
          // @ts-ignore
          statusText: error.response?.statusText
        });
      }

      try {
        console.log('Загружаем номера...');
        await hotel.loadRooms();
        console.log('✅ Номера загружены:', hotel.rooms);
      } catch (error) {
        console.error('❌ Ошибка загрузки номеров:', error);
        console.error('Детали ошибки:', {
          // @ts-ignore
          message: error.message,
          // @ts-ignore
          stack: error.stack,
          // @ts-ignore
          response: error.response?.data,
          // @ts-ignore
          status: error.response?.status,
          // @ts-ignore
          statusText: error.response?.statusText
        });
      }

      try {
        console.log('Загружаем контент страниц...');
        await pageContent.loadPageContent();
        console.log('✅ Контент страниц загружен:', pageContent.pages);
      } catch (error) {
        console.error('❌ Ошибка загрузки контента страниц:', error);
        console.error('Детали ошибки:', {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
      }

      try {
        console.log('Загружаем вина...');
        await wine.loadWines();
        console.log('✅ Вина загружены:', wine.wines);
      } catch (error) {
        console.error('❌ Ошибка загрузки вин:', error);
        console.error('Детали ошибки:', {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
      }

      try {
        console.log('Загружаем продукты...');
        await product.loadProducts();
        console.log('✅ Продукты загружены:', product.products);
      } catch (error) {
        console.error('❌ Ошибка загрузки продуктов:', error);
        console.error('Детали ошибки:', {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
      }
    };

    loadData();
  }, [dish, hotel, pageContent, wine, product]);

  useEffect(() => {
    // Загружаем данные при монтировании компонента
    dish.loadDishes().catch(console.error);
    hotel.loadRooms().catch(console.error);
    pageContent.loadPageContent().catch(console.error);
    wine.loadWines().catch(console.error);
    product.loadProducts().catch(console.error)
  }, [dish, hotel, pageContent, wine, product]);

  const useVideos = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);

    const loadVideos = async () => {
      setLoading(true);
      try {
        const data = await fetchVideos();
        setVideos(data);
      } finally {
        setLoading(false);
      }
    };

    const addVideo = async (video: Omit<Video, "id">) => {
      const newVideo = await createVideo(video);
      setVideos(prev => [...prev, newVideo]);
    };

    const editVideo = async (id: number, video: Partial<Video>) => {
      const updated = await updateVideo(id, video);
      setVideos(prev => prev.map(v => (v.id === id ? updated : v)));
    };

    const removeVideo = async (id: number) => {
      await deleteVideo(id);
      setVideos(prev => prev.filter(v => v.id !== id));
    };

    useEffect(() => {
      loadVideos();
    }, []);

    return { videos, loading, addVideo, editVideo, removeVideo };
  };
  const { videos, loading, addVideo, editVideo, removeVideo } = useVideos();
  const [editingVideoId, setEditingVideoId] = useState<number | null>(null);
  const [editingVideoData, setEditingVideoData] = useState<{ title: string; description: string; videoUrl: string }>({
    title: '',
    description: '',
    videoUrl: '',
  });
  const [newVideoData, setNewVideoData] = useState<{ title: string; description: string; videoUrl: string }>({
    title: '',
    description: '',
    videoUrl: '',
  });
  // //Список блюд
  // const [dishes, setDishes] = useState([
  //   {
  //     category: "Antipasti",
  //     products: [
  //       {
  //         id: 1,
  //         name: "Bruschetta",
  //         images: ["https://i.imgur.com/GuUbM8Q.png",...initialImages],
  //         header: "Bruschetta",
  //         description: "Very delicious slice of bread with vegetables",
  //         descriptionFull: "Our Bruschetta features toasted artisanal bread topped with ripe tomatoes, fresh basil, and garlic. Drizzled with extra virgin olive oil, it's a perfect balance of flavors and textures.",
  //         weight: "150g",
  //         price: 8.99,
  //       },
  //       {
  //         id: 2,
  //         name: "Caprese Salad",
  //         images: ["https://i.imgur.com/44wBlh1.png",...initialImages],
  //         header: "Caprese Salad",
  //         description: "What Salad could be more Italian, than Caprese?",
  //         descriptionFull: "Our Caprese Salad showcases layers of fresh mozzarella, ripe tomatoes, and fragrant basil leaves. Finished with a drizzle of balsamic glaze and extra virgin olive oil, it's a refreshing start to any meal.",
  //         weight: "200g",
  //         price: 10.99,
  //       },
  //     ],
  //   },
  //   {
  //     category: "Primi Platti",
  //     products: [
  //       {
  //         id: 3,
  //         name: "Spaghetti Carbonara",
  //         images: ["https://i.imgur.com/jJBWmPu.png",...initialImages],
  //         header: "Spaghetti Carbonara",
  //         description: "Well, that's now the most italian thing here",
  //         descriptionFull: "Our Spaghetti Carbonara is a classic Roman dish made with al dente pasta, crispy pancetta, eggs, and Pecorino Romano cheese. Finished with freshly ground black pepper, it's rich, creamy, and utterly satisfying.",
  //         weight: "300g",
  //         price: 14.99,
  //       },
  //       {
  //         id: 4,
  //         name: "Risotto ai Funghi",
  //         images: ["https://i.imgur.com/NflqYmH.png",...initialImages],
  //         header: "Risotto ai Funghi",
  //         description: "You probably gonna like it",
  //         descriptionFull: "Our Risotto ai Funghi is a creamy Arborio rice dish cooked with a medley of wild mushrooms, white wine, and Parmigiano-Reggiano. Finished with a drizzle of truffle oil, it's a luxurious and comforting Italian classic.",
  //         weight: "280g",
  //         price: 16.99,
  //       },
  //     ],
  //   },
  //   {
  //     category: "Soups",
  //     products: [
  //       {
  //         id: 5,
  //         name: "Borsch",
  //         images: ["https://i.imgur.com/4VIMe45.png",...initialImages],
  //         header: "Borsch",
  //         description: "For the most patriotic ppl",
  //         descriptionFull: "Our Borsch is a hearty Eastern European soup featuring tender beef, beets, cabbage, and other vegetables. Served with a dollop of sour cream and fresh dill, it's a comforting and flavorful dish perfect for cold days.",
  //         weight: "400ml",
  //         price: 9.99,
  //       },
  //       {
  //         id: 6,
  //         name: "Unnamed thing",
  //         images: ["https://i.imgur.com/PraiyRI.png",...initialImages],
  //         header: "Dunno what's it",
  //         description: "I mean...I really dunno",
  //         descriptionFull: "This mysterious soup is a chef's special creation, featuring a unique blend of seasonal ingredients. With a rich broth and surprising textures, it's an adventurous choice for curious diners looking to expand their culinary horizons.",
  //         weight: "350ml",
  //         price: 12.99,
  //       },
  //     ],
  //   },
  // ]);
  // //Список отельных комнат
  // const [hotelRooms, setRooms] = useState([
  //   {
  //     name: "Стандарт",
  //     images: [...initialImages],
  //     properties: ["бассейн", "душ", "батарея", "не знаю"],
  //     conviniences: ["никто не бьёт", "не знаю"],
  //     description: "Удобный стандартный номер со всеми необходимыми удобствами",
  //     price: [{ title: 'ночь', price: '10000' }, { title: 'неделя', price: '50000' }],
  //     checkStandart: { checkIn: "14:00", checkOut: "12:00" },
  //     notes: ["Курение запрещено", "Животные не допускаются"],
  //     isActive: true,
  //   },
  //   {
  //     name: "Стандарт+",
  //     images: [...initialImages],
  //     properties: ["бассейн", "душ", "батарея", "не знаю"],
  //     conviniences: ["никто не бьёт", "не знаю"],
  //     description: "Улучшенный стандартный номер с дополнительными удобствами",
  //     price: [{ title: 'ночь', price: '20000' }, { title: 'неделя', price: '100000' }],
  //     checkStandart: { checkIn: "14:00", checkOut: "12:00" },
  //     notes: ["Завтрак включен", "Поздний выезд возможен"],
  //     isActive: true,
  //   },
  // ]);
  // //Список страниц
  // // В AdminPage.tsx добавить эти импорты и заменить объект pagesList

  // // Начальные изображения для галерей
  // const initialGalleryImages = [
  //   { src: "https://media.admagazine.ru/photos/61409580103eaf1470f8df16/16:9/w_2560%2Cc_limit/Room-9-St-Andrea-(1).jpg", alt: "Room 9 St Andrea" },
  //   { src: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/42/0e/53/sant-andrea-9.jpg?w=1200&h=-1&s=1", alt: "Sant Andrea" },
  //   { src: "https://flowbite.com/docs/images/carousel/carousel-3.svg", alt: "Carousel Image 3" },
  //   { src: "https://flowbite.com/docs/images/carousel/carousel-4.svg", alt: "Carousel Image 4" },
  //   { src: "https://flowbite.com/docs/images/carousel/carousel-5.svg", alt: "Carousel Image 5" },
  // ];
  // // Список страниц
  // const [pagesContent, setPagesContent] = useState([
  //   {
  //     name: "Главная",
  //     path: "/",
  //     isActive: true,
  //     content: {
  //       mainBackground: {
  //         image: BackgroundImage,
  //         title: "Добро пожаловать на Винные Терассы"
  //       },
  //       aboutSection: {
  //         title: "Кто мы?",
  //         description: 'Отель-винодельня "Винные Террассы" - это уникальное место, сочетающее в себе шарм и гостеприимство с изысканными винами, произведенным нашими виноделами по собственному рецепту. Мы предлагаем гостям возможность насладиться роскошью и комфортом, а также окунуться в удивительный мир виноделия, попробовать уникальные сорта вин и узнать историю их создания.'
  //       },
  //       firstGallery: {
  //         title: "Номерной Фонд",
  //         images: [...initialGalleryImages]
  //       },
  //       secondGallery: {
  //         title: "Отель расположен в самой живописной локации Абрау",
  //         images: [...initialGalleryImages]
  //       },
  //       videoSection: {
  //         title: "Посмотрите видео-презентацию",
  //         videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  //       },
  //       servicesSection: {
  //         title: "Ваш отдых - наша ответственность",
  //         services: [
  //           {
  //             name: "Трансфер",
  //             image: "https://kursk-kortezh.ru/admin/Data-Gallery/pictures/tuazev8six-uslugi-transfera-v-prage.jpg"
  //           },
  //           {
  //             name: "Изысканная кухня",
  //             image: "https://media.istockphoto.com/id/500466008/ru/%D1%84%D0%BE%D1%82%D0%BE/%D0%B3%D0%BE%D0%B2%D1%8F%D0%B4%D0%B8%D0%BD%D1%8B-%D1%81%D1%82%D0%B5%D0%B9%D0%BA.jpg?s=612x612&w=0&k=20&c=RN33VmjFFu06kFNyM_8vRe_A5eDgKlV6u86t1FZnpSM="
  //           },
  //           {
  //             name: "Современный дизайн",
  //             image: "https://mykaleidoscope.ru/uploads/posts/2021-03/1616624585_56-p-dizain-modern-interera-58.jpg"
  //           },
  //           {
  //             name: "Сервис",
  //             image: "https://habrastorage.org/webt/gt/pc/ia/gtpciaxhxff_iswdxx-qhwizuo8.jpeg"
  //           },
  //           {
  //             name: "Качественное вино",
  //             image: "https://forumsamogon.ru/wp-content/uploads/e/e/e/eeeb1c2d5d567758dbf6327fd1b0d490.jpg"
  //           }
  //         ]
  //       }
  //     }
  //   },
  //   {
  //     name: "Винодельня",
  //     path: "/Винодельня",
  //     isActive: true,
  //     content: {
  //       mainBackground: {
  //         image: "./components/assets/VineryBackground.png",
  //         title: "Винодельня"
  //       },
  //       introSection: {
  //         title: "Винодельня",
  //         description: "Откройте для себя мир превосходных вин в нашей винодельне! Мы предлагаем уникальные и высококачественные сорта вин, созданные с любовью и вниманием к каждой детали. Посетите нашу винодельню и убедитесь в качестве наших вин самостоятельно. Здесь вы сможете насладиться изысканными напитками, отдохнуть и провести время в уютной атмосфере.",
  //         image: ThreeBottles,
  //         buttonText: "Ассортимент вин",
  //         buttonLink: "/Каталог"
  //       },
  //       historySection: {
  //         title: "НАША ИСТОРИЯ",
  //         leftDates: [
  //           { year: '1960', description: 'Основание винодельни' },
  //           { year: '1966', description: 'Первый урожай' },
  //           { year: '1970', description: 'Выпуск первого вина' }
  //         ],
  //         rightDates: [
  //           { year: '1980', description: 'Расширение производства' },
  //           { year: '1999', description: 'Международное признание' },
  //           { year: '2000', description: 'Модернизация производства' }
  //         ]
  //       },
  //       wineSection: {
  //         firstText: "У нас вы сможете попробовать как классические, так и эксклюзивные вина, созданные по уникальным рецептурам. Наши опытные сомелье помогут вам выбрать вино, которое идеально подойдёт именно для вашего случая.",
  //         secondText: "Наш каталог включает более 100 наименований вин, среди которых вы обязательно найдете напиток по своему вкусу. Мы гордимся тем, что наши вина получают высокие оценки от экспертов и ценителей со всего мира.",
  //         buttonText: "Наша винотека",
  //         buttonLink: "/Каталог"
  //       },
  //       productionSection: {
  //         title: "ЭТАПЫ НАШЕГО ПРОИЗВОДСТВА",
  //         stages: [
  //           { name: "Сбор винограда", image: Grape },
  //           { name: "Дробление Прессование", image: BottleProduce },
  //           { name: "Ферментация", image: WineBarrel },
  //           { name: "Выдержка", image: WineBarrel },
  //           { name: "Фильтрация", image: WineBarrel },
  //           { name: "Розлив Созревание", image: WineReservour }
  //         ]
  //       },
  //       regionSection: {
  //         title: "ВИННЫЙ РЕГИОН",
  //         firstText: "Краснодарский край — главный винодельческий регион России с разнообразными сортами винограда и высококачественными винами. Здесь выращивают Каберне Совиньон, Мерло, Шардоне и Ркацители.",
  //         secondText: "Регион сочетает культуру, красоту природы и винодельческое искусство.",
  //         backgroundImage: GrapeLines
  //       }
  //     }
  //   },
  //   {
  //     name: "Ресторан",
  //     path: "/Ресторан",
  //     isActive: true,
  //     content: "Контент, содержащийся на этой странице редактируется в разделе %'Меню Ресторана'"
  //   },
  //   {
  //     name: "Мероприятия",
  //     path: "/Мероприятия",
  //     isActive: true,
  //     content: "Контент, содержащийся на этой странице редактируется в другом разделе"
  //   }
  // ]);
  // // Список вин
  // const [wines, setWines] = useState([
  //   {
  //     type: "Красное",
  //     assortment: [
  //       {
  //         sweetness: "Сухое",
  //         wines: [
  //           {
  //             id: 9,
  //             name: 'Вино Faustino Crianza Tempranillo красное сухое',
  //             images: ['https://jmrkpxyvei.a.trbcdn.net/medias/1015344-3-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3w5NzE1fGltYWdlL2F2aWZ8aW1hZ2VzL2gwMi9oNjIvMTAzMTgzNTg4NzIwOTQuYXZpZnxiODkzNDU2ZTlkNjA0MGQ3NWFiM2JmNDcwZThmOTA5ODZhM2I1Yzk3YjlmNzMxNDg3ZjAyN2EyY2Q1ZjNkYWQ2',],
  //             year: 2022,
  //             alcohol: "14-14.5",
  //             sugar: "3-5",
  //             temperature: "17-19",
  //             price: 4300,
  //             description: [
  //               "Виноград: Каберне Совиньон",
  //               "Цвет: Глубокий рубиновый с фиолетовым оттенком",
  //               "Аромат: Черная смородина, эвкалипт, темный шоколад",
  //               "Вкус: Мощные танины и долгое пряное послевкусие",
  //               "Сочетания: Стейк рибай, блюда из баранины, выдержанные сыры"
  //             ]
  //           },
  //           {
  //             id: 10,
  //             name: 'Вино Il Gaggio Grillo Terre Siciliane белое сухое',
  //             images: ['https://jmrkpxyvei.a.trbcdn.net/medias/1014538-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wzNjM2MHxpbWFnZS9hdmlmfGltYWdlcy9oYzMvaDFhLzEwMTE3NDg5OTgzNTE4LmF2aWZ8MGY3NWNiOGIzNGIzOWM4MzBlODRkYjVlMGU4MmZiMjEwODk3ZjAzMDg0MjAzMDNiZjFkMGU1NWY1ODMzYzQxMA',],
  //             year: 2015,
  //             alcohol: "13.5-14",
  //             sugar: "4-6",
  //             temperature: "18-20",
  //             price: 5600,
  //             description: [
  //               "Виноград: Санджовезе",
  //               "Цвет: Гранатовый с кирпичными ободком",
  //               "Аромат: Вяленая вишня, кожа, трюфельные ноты",
  //               "Вкус: Комплексный и элегантный с шелковистыми танинами",
  //               "Сочетания: Флорентийский стейк, дичь, грибные ризотто"
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         sweetness: "Полусухое",
  //         wines: [
  //           {
  //             id: 6,
  //             name: 'Вино Corvo Irmana Frappato красное полусухое',
  //             images: ['https://jmrkpxyvei.a.trbcdn.net/medias/1024656-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxMjQ3MnxpbWFnZS9hdmlmfGltYWdlcy9oZWMvaDNjLzEwMDUyMTk4NjYyMTc0LmF2aWZ8MDZhMjM1NGEyZTM5ZWVmMzkyZDk2MWQyMzE4NDNjNTM2NjUwZWJjZmZiMTRiNWZjYmU4NDczNmQ4MmVlZjllOA',],
  //             year: 2000,
  //             alcohol: "13-14",
  //             sugar: "8-12",
  //             temperature: "16-18",
  //             price: 3500,
  //             description: [
  //               "Виноград: Фраппато",
  //               "Цвет: Прозрачный рубиновый с оранжевыми ободком",
  //               "Аромат: Сушеная клюква, кориандр, кожистые ноты",
  //               "Вкус: Элегантная кислинка и минеральный финиш",
  //               "Сочетания: Паста болоньезе, пицца с салями"
  //             ]
  //           },
  //           {
  //             id: 8,
  //             name: 'Вино Pasqua Montepulciano d’Abruzzo красное полусухое',
  //             images: ['https://jmrkpxyvei.a.trbcdn.net/medias/1004105.png-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxNDQ5MnxpbWFnZS9hdmlmfGltYWdlcy9oZjEvaDljLzEwMTE2MzMyMjkwMDc4LmF2aWZ8Y2QyZjIxNWFiYTkzMzlmZjFlOGNkYTAzY2Q1YTg1ZWJmMTJjMWVhZWZlNzNiMjFmYmYxMjI5ZGJjMzEyZjM0Nw',],
  //             year: 2023,
  //             alcohol: "13-14",
  //             sugar: "10-15",
  //             temperature: "16-18",
  //             price: 1800,
  //             description: [
  //               "Виноград: Монтепульчано",
  //               "Цвет: Насыщенный фиолетовый с пурпурной пеной",
  //               "Аромат: Свежая черника, фиалка, легкий перец",
  //               "Вкус: Сочные фрукты и бархатистые танины",
  //               "Сочетания: Брускетты, паста карбонара, молодые сыры"
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         sweetness: "Полусладкое",
  //         wines: [
  //           {
  //             id: 2,
  //             name: 'Вино Ведерниковъ Губернаторское Красностоп Золотовский красное сухое',
  //             images: ['https://jmrkpxyvei.a.trbcdn.net/medias/1020457-3-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxNzY2MHxpbWFnZS9hdmlmfGltYWdlcy9oZDgvaDAyLzExNjMxNjU2MzM3NDM4LmF2aWZ8MTMzNmViYTUzMDY2ODlhYTZhNjliYTM5ODUyMjM4NmVkNWU5ZTVkNjczOGUyOGUzODA1ZDc3ZTc1ZjBiZTllYw',],
  //             year: 1980,
  //             alcohol: "13-14",
  //             sugar: "25-35",
  //             temperature: "16-18",
  //             price: 8700,
  //             description: [
  //               "Виноград: Красностоп",
  //               "Цвет: Глубокий гранатовый с кирпичными отблесками",
  //               "Аромат: Выдержанные тона чернослива, кожи и специй",
  //               "Вкус: Мягкие танины и длительное послевкусие",
  //               "Сочетания: Дичь, зрелые сыры, мясные пироги"
  //             ]
  //           },
  //           {
  //             id: 4,
  //             name: 'Вино игристое Абрау-Дюрсо Русское Игристое красное полусладкое',
  //             images: ['https://jmrkpxyvei.a.trbcdn.net/medias/1001719-1-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wyMzQ3MnxpbWFnZS9hdmlmfGltYWdlcy9oYzkvaGYyLzExNDIwNTQ4NjYxMjc4Lmavif%7Cjmrkpxyvei.a.trbcdn.net/medias/1001719-1-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wyMzQ3MnxpbWFnZS9hdmlmfGltYWdlcy9oYzkvaGYyLzExNDIwNTQ4NjYxMjc4LmF2aWZ8MjY5ZWQzYjkxZDBlNDllODMwM2ZjNmU4MzU4MjczYmY2Njk1ZmZmMTE3YjQ3YmI5YzIyYzRjNTk2NWFhYjg3ZQ',],
  //             year: 1990,
  //             alcohol: "12-13",
  //             sugar: "35-45",
  //             temperature: "10-12",
  //             price: 2800,
  //             description: [
  //               "Виноград: Каберне Совиньон, Саперави",
  //               "Цвет: Ярко-рубиновый с фиолетовыми отблесками",
  //               "Аромат: Малина, вишня и легкие дрожжевые ноты",
  //               "Вкус: Игристое ягодное настроение с бархатистой пеной",
  //               "Сочетания: Клубника в шоколаде, ягодные муссы"
  //             ]
  //           },
  //           {
  //             id: 5,
  //             name: 'Напиток винный Santo Stefano Rosso Zero безалкогольный',
  //             images: ['https://jmrkpxyvei.a.trbcdn.net/medias/1028093-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wyMDI2OXxpbWFnZS9hdmlmfGltYWdlcy9oMzgvaDM0LzExMDI0MDg5OTcyNzY2LmF2aWZ8MmMzYjQxNDZmMTQwMmUyMGU1NzYwMTBmY2ZhNGUwNGIxNDcxOWM3YTQ2Y2I0MWRjMWY1YjQ0YTA4NTlkODNlYg',],
  //             year: 2018,
  //             alcohol: "12.5-13.5",
  //             sugar: "40-50",
  //             temperature: "10-12",
  //             price: 1900,
  //             description: [
  //               "Виноград: Мерло, Пино Нуар",
  //               "Цвет: Фиолетово-рубиновый с лиловым краем",
  //               "Аромат: Свежая клубника, красная смородина",
  //               "Вкус: Сочная фруктовость с шелковистыми танинами",
  //               "Сочетания: Легкие десерты, фруктовые салаты"
  //             ]
  //           },
  //         ]
  //       },
  //       {
  //         sweetness: "Сладкое",
  //         wines: []
  //       }
  //     ]
  //   },
  //   {
  //     type: "Белое",
  //     assortment: [
  //       {
  //         sweetness: "Сухое",
  //         wines: [
  //           {
  //             id: 7,
  //             name: 'Вино Corvo Irmana Grillo белое сухое',
  //             images: ['https://jmrkpxyvei.a.trbcdn.net/medias/1024655-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxMzI4MXxpbWFnZS9hdmlmfGltYWdlcy9oYzkvaDk5LzEwMDUyMTk4MzM0NDk0LmF2aWZ8ZmE4YmJjZWYzN2M2ZmVjOGZjYTk5ODkyNjJkMmQzNWM1ZThkMDNiZDM2ZDc2ZmIxYmM1MDYxNzIwYzczYjVkZg',],
  //             year: 2017,
  //             alcohol: "12.5-13",
  //             sugar: "4-6",
  //             temperature: "8-10",
  //             price: 2200,
  //             description: [
  //               "Виноград: Грилло",
  //               "Цвет: Бледно-соломенный с зеленоватыми бликами",
  //               "Аромат: Белый персик, морская галька, миндальные цветы",
  //               "Вкус: Освежающая минеральность и соленый финиш",
  //               "Сочетания: Мидии гриль, овощи-гриль, средиземноморские салаты"
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         sweetness: "Полусухое",
  //         wines: [
  //           {
  //             id: 3,
  //             name: 'Вино JP. Chenet Original Colombard-Chardonnay белое полусухое',
  //             images: ['https://jmrkpxyvei.a.trbcdn.net/medias/1021991-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxNDAwNXxpbWFnZS9hdmlmfGltYWdlcy9oMGMvaDM0LzEwNTQzMjUxMjI2NjU0LmF2aWZ8MDAwNDQ2ZWZkNTUxNWQ4OGI2YzQ0NjA4ZTY1ODg3OTQ0ZmJlMzc2MTViYjBhNzIxYWRkMTMyNWU5ODE2NzY5Zg',],
  //             year: 1975,
  //             alcohol: "11-12",
  //             sugar: "30-40",
  //             temperature: "8-10",
  //             price: 4500,
  //             description: [
  //               "Виноград: Ркацители, Рислинг",
  //               "Цвет: Янтарный с золотистыми переливами",
  //               "Аромат: Сухофрукты, мед и миндальные ноты",
  //               "Вкус: Маслянистая текстура с карамельным оттенком",
  //               "Сочетания: Фуа-гра, голубые сыры, ореховые десерты"
  //             ]
  //           },
  //           {
  //             id: 11,
  //             name: 'Вино Masi Modello Bianco белое полусухое',
  //             images: ['https://jmrkpxyvei.a.trbcdn.net/medias/1018066-2-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wyMjM4NXxpbWFnZS9hdmlmfGltYWdlcy9oZDcvaDU0LzExNjI1MDYzNTQ2OTEwLmF2aWZ8MjNlMzg0ODZkNTk1ZDBmMjMxZGQxYmMwMGNiMDE4NzVmYzZhNmU0NTI1ZDZiNDU1MTE3ODE2MmIzZjJjZDNjYQ',],
  //             year: 2015,
  //             alcohol: "12-12.5",
  //             sugar: "15-20",
  //             temperature: "8-10",
  //             price: 2700,
  //             description: [
  //               "Виноград: Гарганега, Пино Гриджио",
  //               "Цвет: Светло-золотистый с зеленоватыми рефлексами",
  //               "Аромат: Белые цветы, спелый персик, миндаль",
  //               "Вкус: Сбалансированная кислотность с медовыми нюансами",
  //               "Сочетания: Рыба на гриле, креветки, овощные пасты"
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         sweetness: "Полусладкое",
  //         wines: [
  //           {
  //             id: 1,
  //             name: 'Вино игристое Sempre Prosecco Brut белое брют',
  //             images: ['https://jmrkpxyvei.a.trbcdn.net/medias/1027925-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxNTE2N3xpbWFnZS9hdmlmfGltYWdlcy9oNTEvaDY3LzEwOTM3ODA4MzU1MzU4LmF2aWZ8MzQ0ZTE5NzNhNDM1ODgzNGYxNDkzMDg5NWQwNWYzODUzYjc2NzY3M2RlZTVmNTNjNWUxNzJkNDlmYzBlMjMwZg',],
  //             year: 1985,
  //             alcohol: "11.5-12.5",
  //             sugar: "35-45",
  //             temperature: "6-8",
  //             price: 3200,
  //             description: [
  //               "Виноград: Шардоне, Пино Блан",
  //               "Цвет: Светло-соломенный с золотистыми бликами",
  //               "Аромат: Ноты зеленого яблока, груши и свежей выпечки",
  //               "Вкус: Элегантная игристость с медовыми нюансами",
  //               "Сочетания: Устрицы, легкие десерты, фруктовые тарталетки"
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         sweetness: "Сладкое",
  //         wines: []
  //       }
  //     ]
  //   },
  //   {
  //     type: "Розовое",
  //     assortment: [
  //       {
  //         sweetness: "Сухое",
  //         wines: []
  //       },
  //       {
  //         sweetness: "Полусухое",
  //         wines: []
  //       },
  //       {
  //         sweetness: "Полусладкое",
  //         wines: []
  //       },
  //       {
  //         sweetness: "Сладкое",
  //         wines: []
  //       }
  //     ]
  //   }
  // ]);

  // НАЧАЛО ФУНКЦИЙ ДЛЯ ПРОДУКТОВ

  // Состояние для отслеживания режима редактирования категорий
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  // const addCategory = (newCategory) => {
  //   const existingCategories = dishes.filter(dish =>
  //     dish.category === newCategory || dish.category.startsWith(`${newCategory} (`)
  //   );

  //   if (existingCategories.length === 0) {
  //     setDishes([...dishes, { category: newCategory, products: [] }]);
  //     return;
  //   }

  //   const existingNumbers = existingCategories.map(dish => {
  //     const match = dish.category.match(/\((\d+)\)$/);
  //     return match ? parseInt(match[1]) : 0; // 0 для базовой категории без номера
  //   });

  //   const maxNumber = Math.max(...existingNumbers);

  //   const finalCategory = `${newCategory} (${maxNumber + 1})`;

  //   setDishes([...dishes, { category: finalCategory, products: [] }]);
  // };

  // const deleteCategory = (categoryName) => {
  //   setDishes(dishes.filter(category => category.category !== categoryName));
  // };

  // const addProduct = (categoryName) => {
  //   const newProduct = {
  //     id: Date.now(),
  //     name: "Новый продукт",
  //     images: [],
  //     header: "Новый продукт",
  //     description: "",
  //     descriptionFull: "",
  //     weight: "",
  //     price: 0,
  //   };
  //   setDishes(dishes.map(category => {
  //     if (category.category === categoryName) {
  //       return {
  //         ...category,
  //         products: [...category.products, newProduct],
  //       };
  //     }
  //     return category;
  //   }));
  // };

  // const deleteProduct = (categoryName, productName) => {
  //   setDishes(dishes.map(category => {
  //     if (category.category === categoryName) {
  //       return {
  //         ...category,
  //         products: category.products.filter(product => product.name !== productName),
  //       };
  //     }
  //     return category;
  //   }));
  // };

  //  // Функция для обновления данных блюда
  //  const updateDishData = useCallback((categoryName, productId, updatedDishData) => {
  //   console.log('AdminPage: updating dish data for category', categoryName, 'product id', productId, updatedDishData);
  //   setDishes(prevDishes => {
  //     return prevDishes.map(category => {
  //       if (category.category === categoryName) {
  //         return {
  //           ...category,
  //           products: category.products.map(product => {
  //             if (product.id === productId) {
  //               return {
  //                 ...product,
  //                 ...updatedDishData,
  //                 images: updatedDishData.images || product.images,
  //               };
  //             }
  //             return product;
  //           })
  //         };
  //       }
  //       return category;
  //     });
  //   });
  // }, []);

  // // Функция для сохранения нового названия категории
  // const handleCategorySave = (oldCategoryName: string, newCategoryName: string) => {
  //   setDishes(dishes.map(category => {
  //     if (category.category === oldCategoryName) {
  //       return { ...category, category: newCategoryName };
  //     }
  //     return category;
  //   }));
  //   setEditingCategory(null);
  // };

  // ЗАМЕНИТЕ функции для блюд:
  // Вместо addCategory используйте:
  const addCategory = (newCategory: string) => {
    dish.addCategory(newCategory);
  };

  // Вместо deleteCategory используйте:
  const deleteCategory = (categoryName: string) => {
    dish.deleteCategoryLocal(categoryName);
  };

  // Вместо addProduct используйте:
  const addProduct = (categoryName: string) => {
    dish.addProduct(categoryName);
  };

  // Вместо deleteProduct используйте:
  const deleteProduct = (categoryName: string, productId: number) => {
    dish.deleteProduct(categoryName, productId);
  };

  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    // @ts-ignore
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  // const handleAddProduct = async () => {
  //   const newProduct = await createProduct({ name: "Новый продукт", price: 1000 });
  //   setProducts([...products, newProduct]);
  // };

  const handleAddProduct = async () => {
    try {
      const newProduct = await createProduct({ name: "Новый продукт", price: 1000 });
      setProducts([...products, newProduct]);
    } catch (e) {
      console.error("Ошибка создания продукта:", e);
    }
  };

  // const handleUpdateProduct = async (id: number, updatedData: any) => {
  //   const updated = await updateProduct(id, updatedData);
  //   setProducts(products.map(p => (p.id === id ? updated : p)));
  // };

  // Обновление продукта
  const handleUpdateProduct = async (id: number, updatedData: any) => {
    try {
      const updated = await updateProduct(id, updatedData);
      setProducts(products.map(p => (p.id === id ? updated : p)));
    } catch (e) {
      console.error("Ошибка обновления продукта:", e);
    }
  };

  // const handleDeleteProduct = async (id: number) => {
  //   await deleteProduct(id);
  //   setProducts(products.filter(p => p.id !== id));
  // };

  // Удаление продукта
  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (e) {
      console.error("Ошибка удаления продукта:", e);
    }
  };



  // Вместо updateDishData используйте:
  const updateDishData = useCallback((categoryName: string, productId: number, updatedDishData: any) => {
    dish.updateProduct(categoryName, productId, updatedDishData);
  }, [dish]);

  // Вместо handleCategorySave используйте:
  const handleCategorySave = (oldCategoryName: string, newCategoryName: string) => {
    dish.updateCategoryName(oldCategoryName, newCategoryName);
    setEditingCategory(null);
  };
  // КОНЕЦ ФУНКЦИЙ ДЛЯ ПРОДУКТОВ



  // НАЧАЛО ФУНКЦИЙ ДЛЯ НОМЕРОВ
  // const toggleIsActiveRoom = (index) => {
  //   setRooms(prevRooms =>
  //     prevRooms.map((room, i) =>
  //       i === index ? { ...room, isActive: !room.isActive } : room
  //     )
  //   );
  // };

  // const updateRoomData = useCallback((index, updatedRoomData) => {
  //   console.log('AdminPage: updating room data for index', index, updatedRoomData);
  //   console.log('Тип description:', Array.isArray(updatedRoomData.properties) ? 'массив' : typeof updatedRoomData.properties, 'Значение:', updatedRoomData.properties);
  //   setRooms(prevRooms => {
  //     const newRooms = [...prevRooms];
  //     newRooms[index] = {
  //       ...newRooms[index],
  //       ...updatedRoomData,
  //       price: updatedRoomData.price || newRooms[index].price,
  //       checkStandart: {
  //         checkIn: updatedRoomData.checkIn || newRooms[index].checkStandart.checkIn,
  //         checkOut: updatedRoomData.checkOut || newRooms[index].checkStandart.checkOut,
  //       },
  //       images: updatedRoomData.images || newRooms[index].images,
  //     };
  //     console.log('AdminPage: room updated', newRooms[index]);
  //     return newRooms;
  //   });
  // }, []);

  // ЗАМЕНИТЕ функции для номеров:

  // Вместо toggleIsActiveRoom используйте:
  const toggleIsActiveRoom = (roomId: number) => {
    hotel.toggleRoomActiveLocal(roomId);
  };

  // Вместо updateRoomData используйте:
  const updateRoomData = useCallback((roomId: number, updatedRoomData: any) => {
    hotel.updateRoomLocal(roomId, updatedRoomData);
  }, [hotel]);

  // Добавьте функцию для добавления номера:
  const addRoom = () => {
    hotel.addRoom();
  };

  // Добавьте функцию для удаления номера:
  const deleteRoom = (roomId: number) => {
    hotel.deleteRoomLocal(roomId);
  };
  // КОНЕЦ ФУНКЦИЙ ДЛЯ НОМЕРОВ



  // НАЧАЛО ФУНКЦИЙ ДЛЯ ВИН
  // const addWine = (wineType, sweetness) => {
  //   const newWine = {
  //     id: Date.now(),
  //     name: "Новая бутылка",
  //     images: [],
  //     year: new Date().getFullYear(),
  //     alcohol: "12-13",
  //     sugar: "5-10",
  //     temperature: "16-18",
  //     price: 0,
  //     description: [
  //       "Виноград: Не указан",
  //       "Цвет: Не указан",
  //       "Аромат: Не указан",
  //       "Вкус: Не указан",
  //       "Сочетания: Не указано"
  //     ]
  //   };

  //   setWines(prevWines => {
  //     return prevWines.map(wineCategory => {
  //       if (wineCategory.type === wineType) {
  //         return {
  //           ...wineCategory,
  //           assortment: wineCategory.assortment.map(assortmentItem => {
  //             if (assortmentItem.sweetness === sweetness) {
  //               return {
  //                 ...assortmentItem,
  //                 wines: [...assortmentItem.wines, newWine]
  //               };
  //             }
  //             return assortmentItem;
  //           })
  //         };
  //       }
  //       return wineCategory;
  //     });
  //   });
  // };

  // // Функция для удаления вина
  // const deleteWine = (wineType, sweetness, wineId) => {
  //   setWines(prevWines => {
  //     return prevWines.map(wineCategory => {
  //       if (wineCategory.type === wineType) {
  //         return {
  //           ...wineCategory,
  //           assortment: wineCategory.assortment.map(assortmentItem => {
  //             if (assortmentItem.sweetness === sweetness) {
  //               return {
  //                 ...assortmentItem,
  //                 wines: assortmentItem.wines.filter(wine => wine.id !== wineId)
  //               };
  //             }
  //             return assortmentItem;
  //           })
  //         };
  //       }
  //       return wineCategory;
  //     });
  //   });
  // };

  // // Функция для обновления данных вина
  // const updateWineData = useCallback((wineType, sweetness, wineId, updatedWineData) => {
  //   console.log('AdminPage: updating wine data for type', wineType, 'sweetness', sweetness, 'wine id', wineId, updatedWineData);
  //   console.log('Тип description:', Array.isArray(updatedWineData.description) ? 'массив' : typeof updatedWineData.description, 'Значение:', updatedWineData.description);
  //   setWines(prevWines => {
  //     return prevWines.map(wineCategory => {
  //       if (wineCategory.type === wineType) {
  //         return {
  //           ...wineCategory,
  //           assortment: wineCategory.assortment.map(assortmentItem => {
  //             if (assortmentItem.sweetness === sweetness) {
  //               return {
  //                 ...assortmentItem,
  //                 wines: assortmentItem.wines.map(wine => {
  //                   if (wine.id === wineId) {
  //                     return {
  //                       ...wine,
  //                       ...updatedWineData,
  //                       images: updatedWineData.images || wine.images,
  //                       description: updatedWineData.description || wine.description,
  //                       year: updatedWineData.year || wine.year
  //                     };
  //                   }
  //                   return wine;
  //                 })
  //               };
  //             }
  //             return assortmentItem;
  //           })
  //         };
  //       }
  //       return wineCategory;
  //     });
  //   });
  // }, []);

  // ЗАМЕНИТЕ функции для вин:

  // Вместо addWine используйте:
  const addWine = (wineType: string, sweetness: string) => {
    wine.addWine(wineType, sweetness);
  };

  // Вместо deleteWine используйте:
  const deleteWine = (wineType: string, sweetness: string, wineId: number) => {
    wine.deleteWineLocal(wineType, sweetness, wineId);
  };

  // Вместо updateWineData используйте:
  const updateWineData = useCallback((wineType: string, sweetness: string, wineId: number, updatedWineData: any) => {
    wine.updateWineLocal(wineType, sweetness, wineId, updatedWineData);
  }, [wine]);
  // КОНЕЦ ФУНКЦИЙ ДЛЯ ВИН




  // НАЧАЛО ФУНКЦИЙ ДЛЯ СТРАНИЦ
  // const updatePageContent = useCallback((pageName, sectionName, updatedData) => {
  //   console.log('AdminPage: updating page content for', pageName, 'section', sectionName, updatedData);
  //   setPagesContent(prevPages => {
  //     return prevPages.map(page => {
  //       if (page.name === pageName) {
  //         return {
  //           ...page,
  //           content: {
  //             ...page.content,
  //             [sectionName]: updatedData
  //           }
  //         };
  //       }
  //       return page;
  //     });
  //   });
  // }, []);


  const pageContentHandlers = {
    "Главная": (page) => (
      <ExtCard
        Card={() => (
          <a href="#" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
            Править
          </a>
        )}
        ExtContent={() => (
          <HomeEdit
            pageData={page.content}
            onContentChange={(sectionName, updatedData) =>
              updatePageContent(page.name, sectionName, updatedData)
            }
          />
        )}
      />
    ),
    "Винодельня": (page) => (
      <ExtCard
        Card={() => (
          <a href="#" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
            Править
          </a>
        )}
        ExtContent={() => (
          <VineryEdit
            pageData={page.content}
            onContentChange={(sectionName, updatedData) =>
              updatePageContent(page.name, sectionName, updatedData)
            }
          />
        )}
      />
    ),
    "Ресторан": () => (
      <span className="text-gray-500">
        Контент редактируется в разделе "Меню Ресторана"
      </span>
    ),
    "Мероприятия": () => (
      <span className="text-gray-500">
        Контент редактируется в разделе "Мероприятия"
      </span>
    ),
  };
  // ЗАМЕНИТЕ функцию для страниц:

  // Вместо updatePageContent используйте:
  const updatePageContent = useCallback((pageName: string, sectionName: string, updatedData: any) => {
    pageContent.updatePageContentLocal(pageName, sectionName, updatedData);
  }, [pageContent]);

  // Добавьте функцию для переключения активности страниц:
  const togglePageActive = (pageName: string) => {
    pageContent.togglePageActiveLocal(pageName);
  };
  // КОНЕЦ ФУНКЦИЙ ДЛЯ СТРАНИЦ

  if (dish.isLoading || hotel.isLoading || pageContent.isLoading || wine.isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div>Загрузка...</div>
      </div>
    );
  }

  // Добавьте обработку ошибок:
  if (dish.error || hotel.error || pageContent.error || wine.error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-red-500">
          Ошибка загрузки: {dish.error || hotel.error || pageContent.error || wine.error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-no-repeat bg-cover">
      <Navbar />
      <div className="container m-auto p-4 mt-auto md:p-6 lg:p-12">
        <h1 className="text-3xl text-gray-500 font-bold mb-4 text-center">Административная панель</h1>

        <div className="flex flex-col space-y-4 pt-4">

            <ModalsCard
                Card={addType}
                ExtContent={CreateType}
            />
            <ModalsCard
                Card={addClase}
                ExtContent={CreateClase}
            />
            <ModalsCard
                Card={addProduct}
                ExtContent={CreateProduct}
            />

          </div>


        <Tabs aria-label="Tabs with underline" className="tabsContainer" variant="underline">

          <Tabs.Item active title="Контент на страницах" icon={FaHome}>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Название страницы</Table.HeadCell>
                  <Table.HeadCell>Статус</Table.HeadCell>
                  <Table.HeadCell>Действия</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {/* Существующие продукты */}
                  {Array.isArray(products) && products.map(({ id, name, price }) => (
                      <Table.Row key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {editingProduct === id ? (
                              <input
                                  type="text"
                                  value={editingData.name}
                                  onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                                  className="border rounded p-1 w-full"
                              />
                          ) : (
                              name
                          )}
                        </Table.Cell>

                        <Table.Cell>
                          {editingProduct === id ? (
                              <input
                                  type="number"
                                  value={editingData.price}
                                  onChange={(e) => setEditingData({ ...editingData, price: +e.target.value })}
                                  className="border rounded p-1 w-20"
                              />
                          ) : (
                              price
                          )}
                        </Table.Cell>

                        <Table.Cell>
                          {editingProduct === id ? (
                              <>
                                <button
                                    onClick={async () => {
                                      await product.updateProduct(id, editingData);
                                      setEditingProduct(null);
                                    }}
                                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                >
                                  Сохранить
                                </button>
                                <button
                                    onClick={() => setEditingProduct(null)}
                                    className="bg-gray-400 text-white px-2 py-1 rounded"
                                >
                                  Отмена
                                </button>
                              </>
                          ) : (
                              <button
                                  onClick={() => {
                                    setEditingProduct(id);
                                    setEditingData({ name, price });
                                  }}
                                  className="font-medium text-main_theme hover:underline dark:text-cyan-500"
                              >
                                Редактировать
                              </button>
                          )}
                        </Table.Cell>

                        <Table.Cell>
                          <button
                              onClick={() => product.deleteProduct(id)}
                              className="font-medium text-main_theme hover:underline dark:text-cyan-500"
                          >
                            Удалить
                          </button>
                        </Table.Cell>
                      </Table.Row>
                  ))}

                  {/* Нижний инпут для нового продукта */}
                  <Table.Row className="bg-gray-100 dark:bg-gray-800">
                    <Table.Cell>
                      <input
                          type="text"
                          value={newProductData.name}
                          onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                          placeholder="Название нового продукта"
                          className="border rounded p-1 w-full"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <input
                          type="number"
                          value={newProductData.price}
                          onChange={(e) => setNewProductData({ ...newProductData, price: +e.target.value })}
                          placeholder="Цена"
                          className="border rounded p-1 w-20"
                      />
                    </Table.Cell>
                    <Table.Cell colSpan={2}>
                      <button
                          onClick={async () => {
                            try {
                              const response = await axios.post<Product>(
                                  `${process.env.REACT_APP_API_URL}api/product`,
                                  newProductData,
                                  {
                                    headers: { "x-admin-key": "secret123" }
                                  }
                              );
                              product.setProducts([...product.products, response.data]);
                              setNewProductData({ name: '', price: 0 }); // Очистка инпута после добавления
                            } catch (e) {
                              console.error("Ошибка создания продукта:", e);
                            }
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Добавить
                      </button>

                      <button
                          onClick={() => setNewProductData({ name: '', price: 0 })}
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Отмена
                      </button>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </Tabs.Item>

          <Tabs.Item title="Карточки номеров" icon={FaHotel}>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Название номера</Table.HeadCell>
                  <Table.HeadCell>Цена за ночь</Table.HeadCell>
                  <Table.HeadCell>Статус</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {hotel.rooms.map((room, index) => (
                    <Table.Row key={room.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {room.name}
                      </Table.Cell>
                      <Table.Cell>{room.price[0]?.price || 'N/A'}</Table.Cell>
                      <Table.Cell>{room.isActive ? "Активно" : "В архиве"}</Table.Cell>
                      <Table.Cell>
                        <ExtCard
                          Card={() => (
                            <a href="#" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
                              Править
                            </a>
                          )}
                          ExtContent={() => (
                            <NewRoomCard
                              roomName={room.name}
                              photos={room.images}
                              properties={room.properties}
                              conviniences={room.conviniences}
                              description={room.description}
                              prices={room.price}
                              checkIn={room.checkStandart.checkIn}
                              checkOut={room.checkStandart.checkOut}
                              notes={room.notes}
                              onDataChange={(updatedData) => updateRoomData(index, updatedData)}
                            />
                          )}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <a
                          href="#"
                          onClick={() => toggleIsActiveRoom(index)}
                          className="font-medium text-main_theme hover:underline dark:text-cyan-500"
                        >
                          {room.isActive ? "В архив" : "Активировать"}
                        </a>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Tabs.Item>

          <Tabs.Item title="Меню ресторана" icon={MdOutlineRestaurant}>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Название блюда</Table.HeadCell>
                  <Table.HeadCell>Цена</Table.HeadCell>
                  <Table.HeadCell>Действия</Table.HeadCell>
                  <Table.HeadCell>
                    <AddCategory onClick={() => addCategory("Новая категория")} />
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {dish.dishes.map(({ category, products }) => (
                    <>
                        <div className="my-5 mx-auto flex justify-center items-center gap-4 w-full" key={category}>
                          {editingCategory !== category ? (
                            <>
                              <h3 className="font-bold text-main_theme text-lg font-body">
                                {category}
                              </h3>
                              <Button
                                icon={<MdModeEdit className='h-[20px] w-[20px]' />}
                                func={() => setEditingCategory(category)}
                              />
                              <Button
                                icon={<FaTrashAlt className='h-[20px] w-[20px]' />}
                                func={() => deleteCategory(category)}
                                customBackground={"bg-[#ff6b6b]"}
                              />
                              <Button
                                icon={<IoMdAdd className='h-[20px] w-[20px]' />}
                                func={() => addProduct(category, "Новый продукт")}
                                customBackground={"bg-[#2ecc71]"}
                              />
                            </>
                          ) : (
                            <DescriptionInput
                              inputField={true}
                              horizontal={true}
                              text={category}
                              onSave={(newName) => handleCategorySave(category, newName)}
                            />
                          )}
                        </div>
                      {Array.isArray(products) ? products.map(({ id, images, name, header, description, descriptionFull, weight, price}) => (
                        <Table.Row key={name} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {name}
                          </Table.Cell>
                          <Table.Cell>{price}</Table.Cell>
                          <Table.Cell>
                            <ExtCard
                              Card={() => (
                                <a href="#" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
                                  Править
                                </a>
                              )}
                              ExtContent={() => (
                                <NewDishCard
                                  dishName={name}
                                  photos={images}
                                  price={price}
                                  description={descriptionFull}
                                  descriptionBrief={description}
                                  weight={weight}
                                  onDataChange={(updatedData) => updateDishData(category, id, updatedData)}
                                />
                              )}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <a
                              href="#"
                              onClick={() => deleteProduct(category, name)}
                              className="font-medium text-main_theme hover:underline dark:text-cyan-500"
                            >
                              Удалить
                            </a>
                          </Table.Cell>
                        </Table.Row>
                      )) : <div></div> }
                    </>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Tabs.Item>

          <Tabs.Item title="Мероприятия" icon={IoTicket}>
            Ждём встройки <span className="font-medium text-gray-800 dark:text-white">МОДУЛЯ БРОНИРОВАНИЯ</span>.
            А пока вкладка будет пустовать...Пупууууу
          </Tabs.Item>

          <Tabs.Item title="Ассортимент винодельни" icon={FaWineGlassAlt}>
          <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Название</Table.HeadCell>
                  <Table.HeadCell>Цена</Table.HeadCell>
                  <Table.HeadCell>Действия</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {Array.isArray(wine) && wine.wines.map(({ type, assortment }) => (
                    <>
                      <div key={type} >
                        <div className="my-5 mx-auto flex justify-center items-center gap-4 w-full">
                          <h3 className="font-bold text-main_theme text-2xl font-body">
                            {type}
                          </h3>
                        </div>
                      </div>
                      {assortment.map(({ sweetness, wines }) => (
                        <>
                        <div className="flex items-center gap-4 w-full" key={sweetness}>
                          <h4 className="font-bold text-main_theme text-base font-body">
                            {sweetness}
                          </h4>
                          <Button
                            icon={<IoMdAdd className='h-[20px] w-[20px]' />}
                            func={() => addWine(type, sweetness)}
                            customBackground={"bg-[#2ecc71]"}
                          />
                        </div>
                        {wines.map(({ id, name, images, year, alcohol, sugar, temperature, price, description }) => (
                          <Table.Row key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              {name}
                            </Table.Cell>
                            <Table.Cell>{price}</Table.Cell>
                            <Table.Cell>
                              <ExtCard
                                Card={() => (
                                  <a href="#" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
                                    Править
                                  </a>
                                )}
                                ExtContent={() => (
                                  <NewWineCard
                                    dishName={name}
                                    photos={images}
                                    price={price}
                                    description={description}
                                    year={year}
                                    alcohol={alcohol}
                                    sugar={sugar}
                                    temperature={temperature}
                                    onDataChange={(updatedData) => updateWineData(type, sweetness, id, updatedData)}
                                  />
                                )}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <a
                                href="#"
                                onClick={() => deleteWine(type, sweetness, id)}
                                className="font-medium text-main_theme hover:underline dark:text-cyan-500"
                              >
                                Удалить
                              </a>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </>
                      ))}
                    </>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Tabs.Item>

          <Tabs.Item title="Продукты" icon={HiClipboardList}>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Название</Table.HeadCell>
                  <Table.HeadCell>Цена</Table.HeadCell>
                  <Table.HeadCell>Действия</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {products.map((product) => (
                      <Table.Row key={product.id}>
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>{product.price}</Table.Cell>
                        <Table.Cell>
                          <button onClick={() =>{
                            handleUpdateProduct(product.id, { name: product.name + " (обновлено)"})
                            setEditingProduct(product.id);
                            setEditingData({ name: product.name, price: product.price })
                          }}>
                            Редактировать
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)}>Удалить</button>
                        </Table.Cell>
                      </Table.Row>

                  ))}

                </Table.Body>
              </Table>
              <button onClick={handleAddProduct} className="mt-4 bg-main_theme text-white px-4 py-2 rounded-xl">
                Добавить продукт
              </button>
            </div>
          </Tabs.Item>

          <Tabs.Item title="Видео" icon={FaHome}>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Название</Table.HeadCell>
                  <Table.HeadCell>Описание</Table.HeadCell>
                  <Table.HeadCell>Ссылка на видео</Table.HeadCell>
                  <Table.HeadCell>Действия</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">

                  {/* Существующие видео */}
                  {videos.map((video) => (
                      <Table.Row key={video.id}>
                        <Table.Cell>
                          {editingVideoId === video.id ? (
                              <input
                                  type="text"
                                  value={editingVideoData.title}
                                  onChange={(e) => setEditingVideoData({ ...editingVideoData, title: e.target.value })}
                                  className="border rounded p-1 w-full"
                              />
                          ) : (
                              video.title
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {editingVideoId === video.id ? (
                              <input
                                  type="text"
                                  value={editingVideoData.description}
                                  onChange={(e) => setEditingVideoData({ ...editingVideoData, description: e.target.value })}
                                  className="border rounded p-1 w-full"
                              />
                          ) : (
                              video.description
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {editingVideoId === video.id ? (
                              <input
                                  type="text"
                                  value={editingVideoData.videoUrl}
                                  onChange={(e) => setEditingVideoData({ ...editingVideoData, videoUrl: e.target.value })}
                                  className="border rounded p-1 w-full"
                              />
                          ) : (
                              video.videoUrl
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {editingVideoId === video.id ? (
                              <>
                                <button
                                    onClick={async () => {
                                      await editVideo(video.id, editingVideoData);
                                      setEditingVideoId(null);
                                    }}
                                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                >
                                  Сохранить
                                </button>
                                <button
                                    onClick={() => setEditingVideoId(null)}
                                    className="bg-gray-400 text-white px-2 py-1 rounded"
                                >
                                  Отмена
                                </button>
                              </>
                          ) : (
                              <>
                                <button
                                    onClick={() => {
                                      setEditingVideoId(video.id);
                                      setEditingVideoData({ title: video.title, description: video.description, videoUrl: video.videoUrl });
                                    }}
                                    className="font-medium text-main_theme hover:underline dark:text-cyan-500 mr-2"
                                >
                                  Редактировать
                                </button>
                                <button
                                    onClick={() => removeVideo(video.id)}
                                    className="font-medium text-red-500 hover:underline"
                                >
                                  Удалить
                                </button>
                              </>
                          )}
                        </Table.Cell>
                      </Table.Row>
                  ))}

                  {/* Нижний инпут для нового видео */}
                  <Table.Row className="bg-gray-100 dark:bg-gray-800">
                    <Table.Cell>
                      <input
                          type="text"
                          value={newVideoData.title}
                          onChange={(e) => setNewVideoData({ ...newVideoData, title: e.target.value })}
                          placeholder="Название видео"
                          className="border rounded p-1 w-full"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <input
                          type="text"
                          value={newVideoData.description}
                          onChange={(e) => setNewVideoData({ ...newVideoData, description: e.target.value })}
                          placeholder="Описание"
                          className="border rounded p-1 w-full"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <input
                          type="text"
                          value={newVideoData.videoUrl}
                          onChange={(e) => setNewVideoData({ ...newVideoData, videoUrl: e.target.value })}
                          placeholder="Ссылка на видео"
                          className="border rounded p-1 w-full"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <button
                          onClick={async () => {
                            await addVideo(newVideoData);
                            setNewVideoData({ title: '', description: '', videoUrl: '' }); // очистка
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Добавить
                      </button>
                      <button
                          onClick={() => setNewVideoData({ title: '', description: '', videoUrl: '' })}
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Отмена
                      </button>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </Tabs.Item>

        </Tabs>
      </div>
    </div>
  );
});

export default AdminPage;