import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import UserStorage from './storage/UserStorage';
import ProductStorage from './storage/ProductStorage';

export const Context = createContext(null);

const userStorage = new UserStorage();
const productStorage = new ProductStorage();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value={{
    user: userStorage,
    product: productStorage,
  }}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Context.Provider>
);
