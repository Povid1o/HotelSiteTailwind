import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import UserStorage from './storage/UserStorage';
import ProductStorage from './storage/ProductStorage';

interface AppContext {
  user: UserStorage;
  product: ProductStorage;
}

export const Context = createContext<AppContext | null>(null);

const userStorage = new UserStorage();
const productStorage = new ProductStorage();

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <Context.Provider
      value={{
        user: userStorage,
        product: productStorage,
      }}
    >
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Context.Provider>
  );
} else {
  console.error('Could not find the root element in the DOM.');
}