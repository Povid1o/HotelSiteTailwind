import React, { useContext, useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import FoodCard from './components/cards/FoodCard';
import ExtDishcard from './components/cards/ExtDishcard';
import ExtCard from './components/cards/ExtCard';
import Footer from "./components/Footer";
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import { fetchClase, fetchProducts } from "./components/http/productAPI";
import { restaurantMenuEmergency } from './emergencyContent/text';

const Restaurant = observer(() => {
  // @ts-ignore
  const { product } = useContext(Context);
  const [nav, setNav] = useState(false);

  useEffect(() => {
    fetchProducts(undefined, undefined).then(data => {
      console.log('Fetched products:', data); // Отладочный лог
      product.setProducts(data.rows); // Используем data.rows вместо data
    }).catch(err => console.error('Error fetching products:', err));

    fetchClase().then(data => {
      console.log('Fetched clases:', data); // Отладочный лог
      product.setClases(data);
    }).catch(err => console.error('Error fetching clases:', err));
  }, [product]);

  if (!product || !Array.isArray(product.products) || !Array.isArray(product.clases)) {
    return <div>Loading...</div>;
  }

  const shouldUseEmergency = product.clases.length === 0 || product.products.length === 0;

  return (
    <>
      <Navbar nav = {nav} setNav = {setNav}/>

      <div className="container mx-auto font-body sm:px-4">
        <h1 className="flex mx-auto justify-center items-center text-3xl font-bold pt-[7rem] mb-8">Меню</h1>
        {!shouldUseEmergency ? (
          product.clases.map((clase) => (
          <div key={clase.id}>
            <h2 className="font-bold pt-2 mb-3 text-lg sm:pt-6 sm:mb-4 sm:text-xl text-center">
              {clase.name}
            </h2>
            <div className='grid gap-0 grid-cols-2 mx-auto max-w-[1000px]'>
              {product.products
                .filter((product) => product.claseId === clase.id)
                .map((filteredProduct) => (
                  <ExtCard
                    Card={() => 
                      <FoodCard
                        key={filteredProduct.id}
                        imgSrc={`${process.env.REACT_APP_API_URL || ''}${filteredProduct.img}`}
                        header={filteredProduct.name}
                        description={""}
                      />
                    }
                    ExtContent={() => 
                      <ExtDishcard
                        imgSrc={`${process.env.REACT_APP_API_URL || ''}${filteredProduct.img}`}
                        header={filteredProduct.name}
                        description={""}
                        price={`${filteredProduct.price} ₽`}
                        weight={""}
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