import {useEffect, useState, useContext, useMemo} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useWindowDimensions from '../WindowResizeListener';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { API_BASE } from '../http';

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

const ProductPage = observer(() => {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();
  
  // Access Context stores
  const context = useContext(Context);
  if (!context) {
    throw new Error('WinePage must be used within Context Provider');
  }
  const { wine: wineStore } = context;

  // Helper to get image URL
  const getImageUrl = (image: string | File) => {
    if (typeof image === 'string') {
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
      }
      if (!image.startsWith('/')) {
        return image;
      }
      return `${API_BASE}${image}`;
    }
    return '';
  };

  // Find wine by ID from MobX store
  const wine = useMemo(() => {
    const wineId = parseInt(productId || '0', 10);
    
    // First try to get from location state
    const stateWine = (location.state as { wine?: Wine })?.wine;
    if (stateWine && stateWine.id === wineId) {
      return stateWine;
    }

    // Then search in MobX store
    for (const wineType of wineStore.wines) {
      for (const assortment of wineType.assortment) {
        for (const w of assortment.wines) {
          if (w.id === wineId) {
            return {
              id: w.id,
              name: w.name,
              image: getImageUrl(w.images?.[0] || ''),
              type: wineType.type,
              year: w.year,
              sweetness: assortment.sweetness,
              alcohol: w.alcohol,
              sugar: w.sugar,
              temperature: w.temperature,
              price: w.price,
              description: w.description,
            };
          }
        }
      }
    }
    return null;
  }, [productId, wineStore.wines, location.state]);

  const loading = wineStore.isLoading || !wine;
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

  // Show loading or error state
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-2xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (!wine) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-2xl text-gray-600">Вино не найдено</div>
      </div>
    );
  }

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
              src={wine.image}
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
                <h1 className="inline-block mobile-header">{wine.name}</h1>
            </div>
            {/* <h2 className="text-xl text-gray-600 mb-4">{productData.subtitle}</h2> */}
            
            <section className="mobile-stats">

              <div className='mobile-stats-section'>
                <img src={AlcoIcon} className='mobile-stats-section-img pr-1'/>

                <div>
                    <p className="mobile-stats-section-name">Алкоголь</p>
                    <p className='mobile-stats-section-stat'>{wine.alcohol}%</p>
                </div>
              </div>

              <div className='mobile-stats-section'>
                <img src={SugarIcon} className='mobile-stats-section-img'/>

                <div>
                    <p className="mobile-stats-section-name">Сахар</p>
                    <p className='mobile-stats-section-stat'>{wine.sugar} г/дм³</p>
                </div>
              </div>

              <div className='mobile-stats-section col-span-2'>
                <img src={TemperatureIcon} className='mobile-stats-section-img'/>

                <div>
                    <p className="mobile-stats-section-name">Температура подачи</p>
                    <p className='mobile-stats-section-stat'>{wine.temperature} °C</p>
                </div>
              </div>

            </section>
            
            <p className="mobile-header mb-8">{wine.price} ₽</p>
            
            <h3 className="mobile-header mb-2">Описание</h3>
            <div className="space-y-2">
              {wine.description && wine.description.map((paragraph, index) => (
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
              src={wine.image}
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

            <h1 className="desktop-header mb-10">{wine.name}</h1>
            {/* <h2 className="text-2xl text-gray-600 mb-6">{productData.subtitle}</h2> */}
            
            <div className="desktop-stats mb-14">
              <div className='mobile-stats-section'>
                <img src={AlcoIcon} className='desktop-stats-section-img pr-1'/>
                <div>
                    <p className="desktop-stats-section-name">Алкоголь</p>
                    <p className='desktop-stats-section-stat'>{wine.alcohol}%</p>
                </div>
              </div>
              
              <div className='mobile-stats-section'>
                <img src={SugarIcon} className='desktop-stats-section-img pr-1'/>
                <div>
                    <p className="desktop-stats-section-name">Сахар</p>
                    <p className='desktop-stats-section-stat'>{wine.sugar} г/дм³</p>
                </div>
              </div>

              <div className='mobile-stats-section'>
                <img src={TemperatureIcon} className='desktop-stats-section-img pr-1'/>
                <div>
                    <p className="desktop-stats-section-name">Температура подачи</p>
                    <p className='desktop-stats-section-stat'>{wine.temperature} °C</p>
                </div>
              </div>

            </div>
            
            <h2 className="desktop-header-lower mb-14">{wine.price} ₽</h2>
            
            <h2 className="desktop-header-lower mb-4">Описание</h2>
            <div className="space-y-3">
              {wine.description && wine.description.map((paragraph, index) => (
                <p key={index} className="desktop-paragraph">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ProductPage;