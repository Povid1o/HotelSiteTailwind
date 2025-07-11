import {useEffect, useState} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useWindowDimensions from '../WindowResizeListener';

import BigBackground from "../assets/BigBackground.png";
import SmallBackground from "../assets/SmallBackground.png";
import AlcoIcon from "../assets/AlcoImage.png";
import SugarIcon from "../assets/SugarImage.png";
import TemperatureIcon from "../assets/TemperatureImage.png";
import { FaArrowRightLong } from "react-icons/fa6";

import "../styles/bottlePage.css"
import '../styles/ExitButton.css'

interface Wine {
  id: number;
  name: string;
  image: string;
  type?: string;
  year?: number;
  sweetness?: string;
  alcohol?: string;
  sugar?: string;
  temperature: string;
  price?: number;
  description?: string[];
}

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const productID = parseInt(productId || '0', 10) - 1; // Индексация с 0
  const location = useLocation();
  // Если при переходе мы передали объект wine, приёмлемо стартовать с него
  const [wine, setWine] = useState<Wine | null>(
    (location.state as { wine?: Wine })?.wine || null
  );
  const [loading, setLoading] = useState(!wine);

  useEffect(() => {
    // Если wine нет в state — запрашиваем из API
    if (!wine) {
      setLoading(true);
      fetch(`/api/wines/${productId}`)
        .then(res => res.json())
        .then((data: Wine) => setWine(data))
        .finally(() => setLoading(false));
    }
  }, [productId]);
  const { height, width } = useWindowDimensions();
  
  const isPortrait = height > width;

  const handleClose = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
    // Переход на домашнюю страницу, если нет истории
      window.location.href = '/';
    }
  };

  // Данные продукта (в реальном приложении получаем через API)
  const [productData] = useState<Wine[]>([
    {
      id: 1,
      name: 'Вино игристое Sempre Prosecco Brut белое брют',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1027925-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxNTE2N3xpbWFnZS9hdmlmfGltYWdlcy9oNTEvaDY3LzEwOTM3ODA4MzU1MzU4LmF2aWZ8MzQ0ZTE5NzNhNDM1ODgzNGYxNDkzMDg5NWQwNWYzODUzYjc2NzY3M2RlZTVmNTNjNWUxNzJkNDlmYzBlMjMwZg',
      type: 'Белое',
      year: 1985,
      sweetness: 'Полусладкое',
      alcohol: "11.5-12.5",
      sugar: "35-45",
      temperature: "6-8",
      price: 3200,
      description: [
        "Виноград: Шардоне, Пино Блан",
        "Цвет: Светло-соломенный с золотистыми бликами",
        "Аромат: Ноты зеленого яблока, груши и свежей выпечки",
        "Вкус: Элегантная игристость с медовыми нюансами",
        "Сочетания: Устрицы, легкие десерты, фруктовые тарталетки"
      ]
    },
    {
      id: 2,
      name: 'Вино Ведерниковъ Губернаторское Красностоп Золотовский красное сухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1020457-3-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxNzY2MHxpbWFnZS9hdmlmfGltYWdlcy9oZDgvaDAyLzExNjMxNjU2MzM3NDM4LmF2aWZ8MTMzNmViYTUzMDY2ODlhYTZhNjliYTM5ODUyMjM4NmVkNWU5ZTVkNjczOGUyOGUzODA1ZDc3ZTc1ZjBiZTllYw',
      type: 'Красное',
      year: 1980,
      sweetness: 'Полусладкое',
      alcohol: "13-14",
      sugar: "25-35",
      temperature: "16-18",
      price: 8700,
      description: [
        "Виноград: Красностоп",
        "Цвет: Глубокий гранатовый с кирпичными отблесками",
        "Аромат: Выдержанные тона чернослива, кожи и специй",
        "Вкус: Мягкие танины и длительное послевкусие",
        "Сочетания: Дичь, зрелые сыры, мясные пироги"
      ]
    },
    {
      id: 3,
      name: 'Вино JP. Chenet Original Colombard-Chardonnay белое полусухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1021991-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxNDAwNXxpbWFnZS9hdmlmfGltYWdlcy9oMGMvaDM0LzEwNTQzMjUxMjI2NjU0LmF2aWZ8MDAwNDQ2ZWZkNTUxNWQ4OGI2YzQ0NjA4ZTY1ODg3OTQ0ZmJlMzc2MTViYjBhNzIxYWRkMTMyNWU5ODE2NzY5Zg',
      type: 'Белое',
      year: 1975,
      sweetness: 'Полусладкое',
      alcohol: "11-12",
      sugar: "30-40",
      temperature: "8-10",
      price: 4500,
      description: [
        "Виноград: Ркацители, Рислинг",
        "Цвет: Янтарный с золотистыми переливами",
        "Аромат: Сухофрукты, мед и миндальные ноты",
        "Вкус: Маслянистая текстура с карамельным оттенком",
        "Сочетания: Фуа-гра, голубые сыры, ореховые десерты"
      ]
    },
    {
      id: 4,
      name: 'Вино игристое Абрау-Дюрсо Русское Игристое красное полусладкое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1001719-1-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wyMzQ3MnxpbWFnZS9hdmlmfGltYWdlcy9oYzkvaGYyLzExNDIwNTQ4NjYxMjc4LmF2aWZ8MjY5ZWQzYjkxZDBlNDllODMwM2ZjNmU4MzU4MjczYmY2Njk1ZmZmMTE3YjQ3YmI5YzIyYzRjNTk2NWFhYjg3ZQ',
      type: 'Красное',
      year: 1990,
      sweetness: 'Полусладкое',
      alcohol: "12-13",
      sugar: "35-45",
      temperature: "10-12",
      price: 2800,
      description: [
        "Виноград: Каберне Совиньон, Саперави",
        "Цвет: Ярко-рубиновый с фиолетовыми отблесками",
        "Аромат: Малина, вишня и легкие дрожжевые ноты",
        "Вкус: Игристое ягодное настроение с бархатистой пеной",
        "Сочетания: Клубника в шоколаде, ягодные муссы"
      ]
    },
    {
      id: 5,
      name: 'Напиток винный Santo Stefano Rosso Zero безалкогольный сильногазированный',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1028093-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wyMDI2OXxpbWFnZS9hdmlmfGltYWdlcy9oMzgvaDM0LzExMDI0MDg5OTcyNzY2LmF2aWZ8MmMzYjQxNDZmMTQwMmUyMGU1NzYwMTBmY2ZhNGUwNGIxNDcxOWM3YTQ2Y2I0MWRjMWY1YjQ0YTA4NTlkODNlYg',
      type: 'Красное',
      year: 2018,
      sweetness: 'Полусладкое',
      alcohol: "12.5-13.5",
      sugar: "40-50",
      temperature: "10-12",
      price: 1900,
      description: [
        "Виноград: Мерло, Пино Нуар",
        "Цвет: Фиолетово-рубиновый с лиловым краем",
        "Аромат: Свежая клубника, красная смородина",
        "Вкус: Сочная фруктовость с шелковистыми танинами",
        "Сочетания: Легкие десерты, фруктовые салаты"
      ]
    },
    {
      id: 6,
      name: 'Вино Corvo Irmana Frappato красное полусухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1024656-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxMjQ3MnxpbWFnZS9hdmlmfGltYWdlcy9oZWMvaDNjLzEwMDUyMTk4NjYyMTc0LmF2aWZ8MDZhMjM1NGEyZTM5ZWVmMzkyZDk2MWQyMzE4NDNjNTM2NjUwZWJjZmZiMTRiNWZjYmU4NDczNmQ4MmVlZjllOA', 
      type: 'Красное',
      year: 2000, 
      sweetness: 'Полусухое',
      alcohol: "13-14",
      sugar: "8-12",
      temperature: "16-18",
      price: 3500,
      description: [
        "Виноград: Фраппато",
        "Цвет: Прозрачный рубиновый с оранжевыми ободком",
        "Аромат: Сушеная клюква, кориандр, кожистые ноты",
        "Вкус: Элегантная кислинка и минеральный финиш",
        "Сочетания: Паста болоньезе, пицца с салями"
      ]
    },
    {
      id: 7,
      name: 'Вино Corvo Irmana Grillo белое сухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1024655-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxMzI4MXxpbWFnZS9hdmlmfGltYWdlcy9oYzkvaDk5LzEwMDUyMTk4MzM0NDk0LmF2aWZ8ZmE4YmJjZWYzN2M2ZmVjOGZjYTk5ODkyNjJkMmQzNWM1ZThkMDNiZDM2ZDc2ZmIxYmM1MDYxNzIwYzczYjVkZg', 
      type: 'Белое',
      year: 2017, 
      sweetness: 'Сухое',
      alcohol: "12.5-13",
      sugar: "4-6",
      temperature: "8-10",
      price: 2200,
      description: [
        "Виноград: Грилло",
        "Цвет: Бледно-соломенный с зеленоватыми бликами",
        "Аромат: Белый персик, морская галька, миндальные цветы",
        "Вкус: Освежающая минеральность и соленый финиш",
        "Сочетания: Мидии гриль, овощи-гриль, средиземноморские салаты"
      ]
    },
    {
      id: 8,
      name: 'Вино Pasqua Montepulciano d’Abruzzo красное полусухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1004105.png-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxNDQ5MnxpbWFnZS9hdmlmfGltYWdlcy9oZjEvaDljLzEwMTE2MzMyMjkwMDc4LmF2aWZ8Y2QyZjIxNWFiYTkzMzlmZjFlOGNkYTAzY2Q1YTg1ZWJmMTJjMWVhZWZlNzNiMjFmYmYxMjI5ZGJjMzEyZjM0Nw', 
      type: 'Красное',
      year: 2023, 
      sweetness: 'Полусухое',
      alcohol: "13-14",
      sugar: "10-15",
      temperature: "16-18",
      price: 1800,
      description: [
        "Виноград: Монтепульчано",
        "Цвет: Насыщенный фиолетовый с пурпурной пеной",
        "Аромат: Свежая черника, фиалка, легкий перец",
        "Вкус: Сочные фрукты и бархатистые танины",
        "Сочетания: Брускетты, паста карбонара, молодые сыры"
      ]
    },
    {
      id: 9,
      name: 'Вино Faustino Crianza Tempranillo красное сухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1015344-3-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3w5NzE1fGltYWdlL2F2aWZ8aW1hZ2VzL2gwMi9oNjIvMTAzMTgzNTg4NzIwOTQuYXZpZnxiODkzNDU2ZTlkNjA0MGQ3NWFiM2JmNDcwZThmOTA5ODZhM2I1Yzk3YjlmNzMxNDg3ZjAyN2EyY2Q1ZjNkYWQ2', 
      type: 'Красное',
      year: 2022, 
      sweetness: 'Сухое',
      alcohol: "14-14.5",
      sugar: "3-5",
      temperature: "17-19",
      price: 4300,
      description: [
        "Виноград: Каберне Совиньон",
        "Цвет: Глубокий рубиновый с фиолетовым оттенком",
        "Аромат: Черная смородина, эвкалипт, темный шоколад",
        "Вкус: Мощные танины и долгое пряное послевкусие",
        "Сочетания: Стейк рибай, блюда из баранины, выдержанные сыры"
      ]
    },
    {
      id: 10,
      name: 'Вино Il Gaggio Grillo Terre Siciliane белое сухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1014538-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wzNjM2MHxpbWFnZS9hdmlmfGltYWdlcy9oYzMvaDFhLzEwMTE3NDg5OTgzNTE4LmF2aWZ8MGY3NWNiOGIzNGIzOWM4MzBlODRkYjVlMGU4MmZiMjEwODk3ZjAzMDg0MjAzMDNiZjFkMGU1NWY1ODMzYzQxMA', 
      type: 'Красное',
      year: 2015, 
      sweetness: 'Сухое',
      alcohol: "13.5-14",
      sugar: "4-6",
      temperature: "18-20",
      price: 5600,
      description: [
        "Виноград: Санджовезе",
        "Цвет: Гранатовый с кирпичными ободком",
        "Аромат: Вяленая вишня, кожа, трюфельные ноты",
        "Вкус: Комплексный и элегантный с шелковистыми танинами",
        "Сочетания: Флорентийский стейк, дичь, грибные ризотто"
      ]
    },
    {
      id: 11,
      name: 'Вино Masi Modello Bianco белое полусухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1018066-2-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wyMjM4NXxpbWFnZS9hdmlmfGltYWdlcy9oZDcvaDU0LzExNjI1MDYzNTQ2OTEwLmF2aWZ8MjNlMzg0ODZkNTk1ZDBmMjMxZGQxYmMwMGNiMDE4NzVmYzZhNmU0NTI1ZDZiNDU1MTE3ODE2MmIzZjJjZDNjYQ', 
      type: 'Белое',
      year: 2015, 
      sweetness: 'Полусухое',
      alcohol: "12-12.5",
      sugar: "15-20",
      temperature: "8-10",
      price: 2700,
      description: [
        "Виноград: Гарганега, Пино Гриджио",
        "Цвет: Светло-золотистый с зеленоватыми рефлексами",
        "Аромат: Белые цветы, спелый персик, миндаль",
        "Вкус: Сбалансированная кислотность с медовыми нюансами",
        "Сочетания: Рыба на гриле, креветки, овощные пасты"
      ]
    }
  ]);

  return (
    <div className="min-h-screen bg-white text-[#3E4756]">
      {isPortrait ? (
        // Вертикальный режим (мобильные устройства)
        <div className="flex flex-col">


          <div className='relative'>

            <img 
              src={SmallBackground} 
              alt="Фон продукта" 
              className="w-full h-auto object-cover"
            />

            <img 
              src={productData[productID].image}
              alt="Изображение продукта"
              className="absolute top-0 left-0 w-full h-full object-contain"
            />


            <div className='absolute top-4 right-4 z-10 cursor-pointer'>
              <div onClick={handleClose} className="cl-btn-6">
                <div className="cl-btn-6-in ">
                  <label className="cl-btn-6-txt text-gray-600">Close</label>
                </div>
              </div>
            </div>

          </div>

          
          <div className="p-4 lg:mx-auto lg:w-[900px]">
            <div className='flex justify-center items-center'>
                <h1 className="inline-block mobile-header">{productData[productID].name}</h1>
            </div>
            {/* <h2 className="text-xl text-gray-600 mb-4">{productData.subtitle}</h2> */}
            
            <section className="mobile-stats">

              <div className='mobile-stats-section'>
                <img src={AlcoIcon} className='mobile-stats-section-img pr-1'/>

                <div>
                    <p className="mobile-stats-section-name">Алкоголь</p>
                    <p className='mobile-stats-section-stat'>{productData[productID].alcohol}%</p>
                </div>
              </div>

              <div className='mobile-stats-section'>
                <img src={SugarIcon} className='mobile-stats-section-img'/>

                <div>
                    <p className="mobile-stats-section-name">Сахар</p>
                    <p className='mobile-stats-section-stat'>{productData[productID].sugar} г/дм³</p>
                </div>
              </div>

              <div className='mobile-stats-section col-span-2'>
                <img src={TemperatureIcon} className='mobile-stats-section-img'/>

                <div>
                    <p className="mobile-stats-section-name">Температура подачи</p>
                    <p className='mobile-stats-section-stat'>{productData[productID].temperature} °C</p>
                </div>
              </div>

            </section>
            
            <p className="mobile-header mb-8">{productData[productID].price} ₽</p>
            
            <h3 className="mobile-header mb-2">Описание</h3>
            <div className="space-y-2">
              {productData[productID].description.map((paragraph, index) => (
                <p key={index} className="mobile-paragraph">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Горизонтальный режим (десктоп/планшет)
        <div className="flex h-screen">

          <div className="relative w-1/2 flex items-center">
            <img 
              src={BigBackground} 
              alt="Фон продукта" 
              className="max-h-[120vh] object-contain absolute -top-[15rem]"
            />

            <img 
              src={productData[productID].image}
              alt="Изображение продукта"
              className="absolute top-0 left-0 w-full h-full object-contain"
            />

            {/* <div className='absolute top-4 right-4 z-10 cursor-pointer'>
              <div onClick={handleClose} className="cl-btn-6">
                <div className="cl-btn-6-in ">
                  <label className="cl-btn-6-txt text-gray-600">Close</label>
                </div>
              </div>
            </div> */}

          </div>
          
          <div className="w-1/2 overflow-y-auto p-8">

            <label className='flex justify-end'>
              <div 
                className='inline-flex flex-row cursor-pointer justify-end p-4 mb-5 group rounded-lg hover:bg-gray-100 transition-all duration-300'
                onClick={handleClose}
              >
                <p className='desktop-paragraph mr-3 transition-all duration-300 group-hover:text-main_theme'>
                  Вернуться назад
                </p>
                <FaArrowRightLong className='h-6 w-6 transform transition-transform duration-300 ease-in-out group-hover:translate-x-2 group-hover:text-main_theme' />
              </div>
            </label>

            <h1 className="desktop-header mb-10">{productData[productID].name}</h1>
            {/* <h2 className="text-2xl text-gray-600 mb-6">{productData.subtitle}</h2> */}
            
            <div className="desktop-stats mb-14">
              <div className='mobile-stats-section'>
                <img src={AlcoIcon} className='desktop-stats-section-img pr-1'/>
                <div>
                    <p className="desktop-stats-section-name">Алкоголь</p>
                    <p className='desktop-stats-section-stat'>{productData[productID].alcohol}%</p>
                </div>
              </div>
              
              <div className='mobile-stats-section'>
                <img src={SugarIcon} className='desktop-stats-section-img pr-1'/>
                <div>
                    <p className="desktop-stats-section-name">Сахар</p>
                    <p className='desktop-stats-section-stat'>{productData[productID].sugar} г/дм³</p>
                </div>
              </div>

              <div className='mobile-stats-section'>
                <img src={TemperatureIcon} className='desktop-stats-section-img pr-1'/>
                <div>
                    <p className="desktop-stats-section-name">Температура подачи</p>
                    <p className='desktop-stats-section-stat'>{productData[productID].temperature} °C</p>
                </div>
              </div>

            </div>
            
            <h2 className="desktop-header-lower mb-14">{productData[productID].price} ₽</h2>
            
            <h2 className="desktop-header-lower mb-4">Описание</h2>
            <div className="space-y-3">
              {productData[productID].description.map((paragraph, index) => (
                <p key={index} className="desktop-paragraph">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;