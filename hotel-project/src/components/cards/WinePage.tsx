import {useEffect, useState} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useWindowDimensions from '../WindowResizeListener';

import BigBackground from "../assets/BigBackground.png";
import SmallBackground from "../assets/SmallBackground.png";
import AlcoIcon from "../assets/AlcoImage.png";
import SugarIcon from "../assets/SugarImage.png";
import TemperatureIcon from "../assets/TemperatureImage.png";

import "../styles/bottlePage.css"

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

  // Данные продукта (в реальном приложении получаем через API)
  const [productData] = useState<Wine[]>([
    {
      id: 1,
      name: 'Вино игристое белое',
      image: 'https://krymwine.ru/upload/resize_cache/iblock/08a/700_700_140cd750bba9870f18aada2478b24840a/u2usww0s9fsyzy4bbgoaha4bm860mp8a.webp',
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
      name: 'Вино красное Красностоп Золотовский',
      image: 'https://krymwine.ru/upload/resize_cache/iblock/522/700_700_140cd750bba9870f18aada2478b24840a/aizouqgfnwmbpzgpga3mx9f8kre9fnhg.webp',
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
      name: 'Вино белое',
      image: 'https://krymwine.ru/upload/resize_cache/iblock/ade/700_700_140cd750bba9870f18aada2478b24840a/tntl3fmkj2j8quxu0on6ucgc0biqbx0m.webp',
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
      name: 'Вино игристое красное Русское игристое полусладкое',
      image: 'https://krymwine.ru/upload/resize_cache/iblock/b29/700_700_140cd750bba9870f18aada2478b24840a/n0ucqwbcvftwozqoqwyz2w3q0sehg2zo.webp',
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
      name: 'Вино игристое красное Русское игристое полусладкое',
      image: 'https://krymwine.ru/upload/resize_cache/iblock/b29/700_700_140cd750bba9870f18aada2478b24840a/n0ucqwbcvftwozqoqwyz2w3q0sehg2zo.webp',
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
      name: 'Вино Corvo Irmana Frappato',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1024656-300Wx300H-avif?context=bWFzdGVyfGltYWdlc3wyNzQwfGltYWdlL2F2aWZ8aW1hZ2VzL2g5MC9oNjQvMTAwNTIxOTg5MjQzMTguYXZpZnwyN2RjZDlkM2ZiYTQzMjAyNmFkOGU3ZDBhZDRiMzdlYWI2MzM5YmViMDcwNTFhMGI1NWQ3MTZlOWRhNmM5MTc1', 
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
      name: 'Вино Corvo Irmana Grillo',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1004105.png-300Wx300H-avif?context=bWFzdGVyfGltYWdlc3wzNzAyfGltYWdlL2F2aWZ8aW1hZ2VzL2g4NC9oZjMvMTAxMTYzMzMwNzY1MTAuYXZpZnxmYTM3OTc0YzZiOTAyNDkyZDhlMDZmNWFjNTUzMzUxY2MxYTMxY2MzMGJhOTgyMjI5NzI3ZGNlZDY2YmJlYmM4', 
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
      name: 'Вино Pasqua Montepulciano d\'Abruzzo',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1024655-300Wx300H-avif?context=bWFzdGVyfGltYWdlc3wzMDc2fGltYWdlL2F2aWZ8aW1hZ2VzL2hjMC9oMWIvMTAwNTIxOTg1OTY2MzguYXZpZnwwNDE0MjA5ZDFjNzY4ODc2MzU4NmVlNzE2YmZjMTk3NTAwYjhjM2NhZjhjZmRmYTU0ZWY5YWU5MzhlNjc1Yjk5', 
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
      name: 'Вино II Gaggio Cabernet-Sauvignon',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1000635.png-300Wx300H-avif?context=bWFzdGVyfGltYWdlc3wzMjY3fGltYWdlL2F2aWZ8aW1hZ2VzL2gwYi9oNWIvMTAxMTU4NDcwNjE1MzQuYXZpZnw1YTA2NDM4MWUxNWYxM2RkMWUzYWQyNGI5NzBjODBlOWZmZmJiYzVkOGExYTUxZTljZTUyMTg1ZWJiNzY5YWU1', 
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
      name: 'Вино Piccini Collezione Oro Chianti Riserva',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1017106.png-300Wx300H-avif?context=bWFzdGVyfGltYWdlc3wxNzQxMnxpbWFnZS9hdmlmfGltYWdlcy9oMzgvaDc3LzEwMTE2OTQxNDQ3MTk4LmF2aWZ8Y2VjNmNkOTgxNGQwY2Y2ODlhNmI4YzI1ODgzNzRiODI5MTAxOTkzOGIxODQ1MjBiOWQ4YjJmOTEzNWM0NDdhOQ', 
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
      name: 'Вино Masi Modello Bianco',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1018066-2-300Wx300H-avif?context=bWFzdGVyfGltYWdlc3wzMTg5fGltYWdlL2F2aWZ8aW1hZ2VzL2hjMi9oZTkvMTE2MjUwNjQxMzY3MzQuYXZpZnwzODZkMzg2Yzc5YzgzNDhmMjFkZDVjY2ZiYjBjMTk0MWQ2ZjA1Njc1NmFjYTIzZDJiMmYzNDUyZjNlODk1MGM1', 
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
          <img 
            src={SmallBackground} 
            alt="Фон продукта" 
            className="w-full h-auto object-cover"
          />
          
          <div className="p-4">
            <div className='flex justify-center items-center'>
                <h1 className="inline-block mobile-header">{productData[productID].name}</h1>
            </div>
            {/* <h2 className="text-xl text-gray-600 mb-4">{productData.subtitle}</h2> */}
            
            <section className="mobile-stats">

              <div className='mobile-stats-section'>
                <img src={AlcoIcon} className='mobile-stats-section-img'/>

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
              {productData[productId].description.map((paragraph, index) => (
                <p key={index} className="mobile-paragraph">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Горизонтальный режим (десктоп/планшет)
        <div className="flex h-screen">
          <div className="w-1/2 flex items-center">
            <img 
              src={BigBackground} 
              alt="Фон продукта" 
              className="max-h-[80vh] object-contain"
            />
          </div>
          
          <div className="w-1/2 overflow-y-auto p-8">
            <h1 className="text-3xl font-bold">{productData[productID].title}</h1>
            {/* <h2 className="text-2xl text-gray-600 mb-6">{productData.subtitle}</h2> */}
            
            <div className="flex space-x-8 mb-6">
              <div>
                <p className="font-semibold">Алкоголь</p>
                <p>{productData[productID].alcohol}%</p>
              </div>
              <div>
                <p className="font-semibold">Сахар</p>
                <p>{productData[productID].sugar} г/дм³</p>
              </div>
              <div>
                <p className="font-semibold">Температура подачи</p>
                <p>{productData[productID].temperature} °C</p>
              </div>
            </div>
            
            <p className="text-3xl font-bold mb-6">{productData[productID].price} ₽</p>
            
            <h3 className="text-xl font-semibold mb-4">Описание</h3>
            <div className="space-y-3">
              {productData[productID].description.map((paragraph, index) => (
                <p key={index} className="text-gray-700">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;