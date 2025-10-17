import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import UserStorage from './storage/UserStorage';
import ProductStorage from './storage/ProductStorage';
// Импорты новых хранилищ
import DishStorage from './storage/DishStorage';
import HotelStorage from './storage/HotelStorage';
import PageContentStorage from './storage/PageContentStorage';
import WineStorage from './storage/WineStorage';
import { ThemeProvider } from "@material-tailwind/react";
import EventStorage from './storage/EventStorage';

interface AppContext {
  user: UserStorage;
  product: ProductStorage; // Сохраняем для обратной совместимости
  // Новые хранилища
  dish: DishStorage;
  hotel: HotelStorage;
  pageContent: PageContentStorage;
  wine: WineStorage;
  events: EventStorage;
}

export const Context = createContext<AppContext | null>(null);

const userStorage = new UserStorage();
const productStorage = new ProductStorage();
// Создание экземпляров новых хранилищ
const dishStorage = new DishStorage();
const hotelStorage = new HotelStorage();
const pageContentStorage = new PageContentStorage();
const wineStorage = new WineStorage();
const eventStorage = new EventStorage();

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <Context.Provider
      value={{
        user: userStorage,
        product: productStorage, // Оставляем для совместимости
        dish: dishStorage,
        hotel: hotelStorage,
        pageContent: pageContentStorage,
        wine: wineStorage,
        events: eventStorage,
      }}
    >
      <React.StrictMode>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </React.StrictMode>
    </Context.Provider>
  );
} else {
  console.error('Could not find the root element in the DOM.');
}