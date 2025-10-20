import React, { useContext, useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import FoodCard from './components/cards/FoodCard';
import ExtDishcard from './components/cards/ExtDishcard';
import ExtCard from './components/cards/ExtCard';
import Footer from "./components/Footer";
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import { API_BASE } from './components/http';
import { restaurantMenuEmergency } from './emergencyContent/text';

const Restaurant = observer(() => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Restaurant must be used within Context Provider');
  }
  const { dish } = context;
  const [nav, setNav] = useState(false);
  
  // ✅ КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Фиксируем данные при первой загрузке
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [displayData, setDisplayData] = useState(
    restaurantMenuEmergency.map(section => ({
      ...section,
      products: section.products.map((product, index) => ({
        ...product,
        id: `emergency-${index}`
      }))
    }))
  );

  // Helper to get image URL
  const getImageUrl = (image: string | File) => {
    if (typeof image === 'string') {
      // Already absolute URL
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
      }
      // Local file in public folder (starts without /)
      if (!image.startsWith('/')) {
        return image;
      }
      // Relative path from backend (starts with /)
      return `${API_BASE}${image}`;
    }
    return '';
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    console.log('=== RESTAURANT PAGE DATA ===');
    console.log('All dishes:', dish.dishes);
    console.log('Loading state:', { dish: dish.isLoading });

    // ✅ Фиксируем данные только один раз после первой загрузки
    if (!initialDataLoaded && !dish.isLoading) {
      if (dish.dishes && dish.dishes.length > 0) {
        // Преобразуем данные из DishStorage в формат для отображения
        const transformedData = dish.dishes.map(cat => ({
          category: cat.category,
          products: cat.products.map((p, index) => ({
            id: String(p.id || `emergency-${index}`),
            name: p.name,
            img: getImageUrl(p.images[0]),
            header: p.header || p.name,
            description: p.description || '',
            descriptionFull: p.descriptionFull || p.description || '',
            price: p.price,
            weight: p.weight || ''
          }))
        }));
        setDisplayData(transformedData);
      }
      setInitialDataLoaded(true);
    }
  }, [dish.dishes, dish.isLoading, initialDataLoaded]);

  // Show loading if data is still being fetched
  if (dish.isLoading && !initialDataLoaded) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-2xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar nav = {nav} setNav = {setNav}/>

      <div className="container mx-auto font-body sm:px-4">
        <h1 className="flex mx-auto justify-center items-center text-3xl font-bold pt-[7rem] mb-8">Меню</h1>
        {displayData.map((section, categoryIndex) => (
          <div key={`${section.category}-${categoryIndex}`}>
            <h2 className="font-bold pt-2 mb-3 text-lg sm:pt-6 sm:mb-4 sm:text-xl text-center">
              {section.category}
            </h2>
            <div className='grid gap-0 grid-cols-2 mx-auto max-w-[1000px]'>
              {section.products.map((product, index) => (
                <ExtCard
                  key={product.id || index}
                  Card={() => 
                    <FoodCard
                      imgSrc={product.img || ''}
                      header={product.name}
                      description={product.description || ''}
                    />
                  }
                  ExtContent={() => 
                    <ExtDishcard
                      imgSrc={product.img || ''}
                      header={product.header}
                      description={product.descriptionFull}
                      price={`${product.price} ₽`}
                      weight={product.weight}
                    />
                  }
                />
              ))}
            </div>
            <hr className="border-gray-400 my-8" />
          </div>
        ))}
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
});

export default Restaurant;