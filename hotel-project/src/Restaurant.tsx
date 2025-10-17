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

  // Log data from stores
  useEffect(() => {
    console.log('=== RESTAURANT PAGE DATA ===');
    console.log('All dishes:', dish.dishes);
    console.log('Loading state:', { dish: dish.isLoading });
  }, [dish.dishes]);

  // Show loading if data is still being fetched
  if (dish.isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-2xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

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

  // Use dish.dishes if available, otherwise use emergency
  const shouldUseEmergency = !dish.dishes || dish.dishes.length === 0;

  return (
    <>
      <Navbar nav = {nav} setNav = {setNav}/>

      <div className="container mx-auto font-body sm:px-4">
        <h1 className="flex mx-auto justify-center items-center text-3xl font-bold pt-[7rem] mb-8">Меню</h1>
        {!shouldUseEmergency ? (
          dish.dishes.map((dishCategory, categoryIndex) => (
          <div key={`${dishCategory.category}-${categoryIndex}`}>
            <h2 className="font-bold pt-2 mb-3 text-lg sm:pt-6 sm:mb-4 sm:text-xl text-center">
              {dishCategory.category}
            </h2>
            <div className='grid gap-0 grid-cols-2 mx-auto max-w-[1000px]'>
              {dishCategory.products.map((product) => (
                <ExtCard
                  key={product.id}
                  Card={() => 
                    <FoodCard
                      imgSrc={getImageUrl(product.images[0]) || ''}
                      header={product.name}
                      description={product.description || ''}
                    />
                  }
                  ExtContent={() => 
                    <ExtDishcard
                      imgSrc={getImageUrl(product.images[0]) || ''}
                      header={product.header || product.name}
                      description={product.descriptionFull || product.description || ''}
                      price={`${product.price} ₽`}
                      weight={product.weight || ''}
                    />
                  }
                />
              ))}
            </div>
            <hr className="border-gray-400 my-8" />
          </div>
        ))
        ) : (
          restaurantMenuEmergency.map((section) => (
            <div key={section.category}>
              <h2 className="font-bold pt-2 mb-3 text-lg sm:pt-6 sm:mb-4 sm:text-xl text-center">
                {section.category}
              </h2>
              <div className='grid gap-0 grid-cols-2 mx-auto max-w-[1000px]'>
                {section.products.map((p) => (
                  <ExtCard
                    key={p.name}
                    Card={() => 
                      <FoodCard
                        imgSrc={p.img}
                        header={p.name}
                        description={p.description}
                      />
                    }
                    ExtContent={() => 
                      <ExtDishcard
                        imgSrc={p.img}
                        header={p.header}
                        description={p.descriptionFull}
                        price={`${p.price} ₽`}
                        weight={p.weight}
                      />
                    }
                  />
                ))}
              </div>
              <hr className="border-gray-400 my-8" />
            </div>
          ))
        )}
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
});

export default Restaurant;