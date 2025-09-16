import React, { Suspense, lazy, useContext, useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, ScrollRestoration, Outlet } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import LoadingScreen from './components/LoadingScreen';

// Ленивая загрузка компонентов
const WineHotel = lazy(() => import("./WineHotel.tsx"));
const Ivents = lazy(() => import("./Ivents.tsx"));
const Restaurant = lazy(() => import("./Restaurant.tsx"));
const Vinery = lazy(() => import("./Vinery.tsx"));
const Shop = lazy(() => import("./Shop.tsx"));
const EventsList = lazy(() => import("./components/EventsList.tsx"));
const Auth = lazy(() => import("./Auth.tsx"));
const AdminPage = lazy(() => import("./AdminPage.tsx"));
const WinePage = lazy(() => import("./components/cards/WinePage.tsx"));





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
        path: "/registration",
        element: <Auth/>
      },
      {
        path: "/Каталог",
        element: <Shop/>
      },
      {
        path: "/Каталог/:productId",
        element: <WinePage />,
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
        path: "/Каталог/:productId",
        element: <WinePage />,
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
        path: '/admin',
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
            {user.isAuth && <RouterProvider router={hiderouter}/>}
            {/* <WineHotel/> */}
          </section>
        </div>
      )
    }
    </>
  );
})

export default App;
