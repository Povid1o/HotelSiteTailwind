// import WineHotel from "./WineHotel.js";
// import Ivents from "./Ivents.js";
// import Restaurant from "./Restaurant.js";
// import Vinery from "./Vinery.js";
// import Shop from "./Shop.js"
// import EventsList from "./components/EventsList.js";
// import LoadingScreen from './components/LoadingScreen.js';
// import Auth from "./Auth.js"
// import React, {useContext, useState, useEffect} from "react";
// import { createBrowserRouter, RouterProvider, ScrollRestoration, Outlet } from 'react-router-dom';
// import AdminPage from "./AdminPage.js";
// import { observer } from "mobx-react-lite";
// import {Context} from "./index";

import React, { Suspense, lazy, useContext, useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, ScrollRestoration, Outlet } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import LoadingScreen from './components/LoadingScreen';

// Ленивая загрузка компонентов
const WineHotel = lazy(() => import("./WineHotel.js"));
const Ivents = lazy(() => import("./Ivents.js"));
const Restaurant = lazy(() => import("./Restaurant.js"));
const Vinery = lazy(() => import("./Vinery.js"));
const Shop = lazy(() => import("./Shop.js"));
const EventsList = lazy(() => import("./components/EventsList.js"));
const Auth = lazy(() => import("./Auth.js"));
const AdminPage = lazy(() => import("./AdminPage.js"));





const publicrouter = createBrowserRouter([
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
      {
        path: "/login",
        element: <Auth/>
      },
      {
        path: "/Каталог",
        element: <Shop/>
      }
    ],
  }
]);

const hiderouter = createBrowserRouter([
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
      ,
      {
        path: "/Каталог",
        element: <Shop/>
      },
      {
        path: "/login",
        element: <Auth/>
      },
      {
        path: "/registration",
        element: <Auth/>
      },
      {
        path: '/admin-pusttusinadjusi',
        element: <AdminPage/>
      },
    ] 
  }
]);

function Layout() {
  return (
    <div>
      <ScrollRestoration />
      <Suspense fallback={<LoadingScreen />}>
        <Outlet />
      </Suspense>
    </div>
  );
}

const App= observer(() => {
  const { user} = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    // Очистка при размонтировании компонента
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  


  return (
    <>
    {!user.isAuth ? 
      (
      <RouterProvider router={hiderouter}/>
      ) 
      : 
      (
        <div  style={{ position: 'relative', minHeight: '100vh' }}>
          <section
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
          </section>
          <section
            style={{
                    opacity: loading ? 0 : 1,
                    transition: 'opacity 1s ease-in',
                    visibility: loading ? 'hidden' : 'visible',
                  }}
          >
            {!user.isAuth && <RouterProvider router={publicrouter}/>}
            {/* {user.isAuth && <RouterProvider router={hiderouter}/>} */}
            {/* <WineHotel/> */}
          </section>
        </div>
      )
    }
    </>
  );
})

export default App;
