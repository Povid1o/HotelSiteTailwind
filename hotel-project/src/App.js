import React, { useState, useEffect } from 'react';
import WineHotel from "./WineHotel.js";
import Ivents from "./Ivents.js";
import Restaurant from "./Restaurant.js";
import Vinery from "./Vinery.js";
import EventsList from "./components/EventsList.js";
import LoadingScreen from './components/LoadingScreen.js';
import { createBrowserRouter, RouterProvider, ScrollRestoration, Outlet } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <WineHotel />,
      },
      {
        path:"/Мероприятия",
        element: <Ivents />,
      },
      {
        path:"/Мероприятия/:categorie",
        element: <EventsList />,
      },
      {
        path:"/Ресторан",
        element: <Restaurant />,
      },
      {
        path:"/Винодельня",
        element: <Vinery />,
      },
    ],
  },
]);

function Layout() {
  return (
    <div>
      <ScrollRestoration />
      <Outlet />
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      // Give a little extra time for everything to settle
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: loading ? 1 : 0,
          visibility: loading ? 'visible' : 'hidden',
          transition: 'opacity 1s ease-out, visibility 1s ease-out',
          zIndex: 1000,
        }}
      >
        <LoadingScreen />
      </div>
      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: 'opacity 1s ease-in',
          visibility: loading ? 'hidden' : 'visible',
        }}
      >
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;