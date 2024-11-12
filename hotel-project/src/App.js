import WineHotel from "./WineHotel.js";
import Ivents from "./Ivents.js";
import Restaurant from "./Restaurant.js";
import Vinery from "./Vinery.js";
import EventsList from "./components/EventsList.js";
import LoadingScreen from './components/LoadingScreen.js';
import Auth from "./Auth.js"
import React, {useContext, useState, useEffect} from "react";
import { createBrowserRouter, RouterProvider, ScrollRestoration, Outlet } from 'react-router-dom';
import AdminPage from "./AdminPage.js";
import { observer } from "mobx-react-lite";
import {Context} from "./index";




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
      {
        path: "/login",
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
      <Outlet />
    </div>
  );
}

const App= observer(() => {
  const { user} = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // задержка в секунду, шоб плебей остыл
    // const handleLoad = () => {
    //   setTimeout(() => {
    //     setLoading(false);
    //   }, 1000);
    // };

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // if (document.readyState === 'complete') {
    //   handleLoad();
    // } else {
    //   window.addEventListener('load', handleLoad);
    //   return () => window.removeEventListener('load', handleLoad);
    // }
  }, []);


  return (
    <>
    {user.isAuth ? 
      (
      <RouterProvider router={hiderouter}/>
      ) 
      : 
      (
        <div  style={{ position: 'relative', minHeight: '100vh' }}>
          <tbody
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
          </tbody>
          <tbody
            style={{
                    opacity: loading ? 0 : 1,
                    transition: 'opacity 1s ease-in',
                    visibility: loading ? 'hidden' : 'visible',
                  }}
          >
            {!user.isAuth && <RouterProvider router={publicrouter}/>}
            {/* {user.isAuth && <RouterProvider router={hiderouter}/>} */}
            {/* <WineHotel/> */}
          </tbody>
        </div>
      )
    }
    </>
  );
})

export default App;
