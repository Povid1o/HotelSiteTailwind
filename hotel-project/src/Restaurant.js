import React, { useContext, useEffect, useState } from 'react'
import Navbar from "./components/Navbar.js"
import ExtDishcard from './components/ExtDishCard.js'
import FoodCard from './components/FoodCard.js';
import ExtCard from './components/ExtCard';
import Footer from "./components/Footer.js";
import { observer } from 'mobx-react-lite';
import { Context } from './index.js';
import {useParams} from 'react-router-dom'
import {fetchOneProduct} from "./components/http/productAPI.js";


const Dish = observer(() => {
    const { product } = useContext(Context);
  
    return (
      <div className="flex flex-wrap -mx-4 md:mx-auto max-w-[750px]">
        {product.products.map((products) => (
          <div className="px-4 mb-8 w-1/2" key={products.id}>
            <img
              src={`${process.env.REACT_APP_API_URL || ''}${products.img}`}
              alt="Spaghetti Carbonara"
              className="w-full h-auto rounded-lg mb-3 sm:mb-4"
            />
            <h3 className="font-bold text-base sm:text-lg sm:mb-2">
              {products.name}
            </h3>
            <p className="text-gray-600">$ {products.price}</p>
          </div>
        ))}
      </div>
    );
  });
  
  const Restaurant = observer(() => {
    const { id } = useParams();
    const { product } = useContext(Context);
  
    if (!product || !product.clases || !product.products) {
      return <div>Loading...</div>;
    }
  
    return (
      <>
        <div>
          <Navbar />
        </div>
  
        <div class="container mx-auto font-body sm:px-4 sm:py-8">
          <h1 className="text-center text-3xl font-bold mb-8">Menu</h1>
          <ExtCard Card={FoodCard} ExtContent={ExtDishcard} />
  
          {product.clases.map((clase) => (
            <>
              <h2
                className="font-bold pt-2 mb-3 text-lg sm:pt-6 sm:mb-4 sm:text-xl text-center"
                key={clase.id}
              >
                {clase.name}
              </h2>
              <Dish />
            </>
          ))}
        </div>
  
        <div>
          <Footer />
        </div>
      </>
    );
  });

export default Restaurant
