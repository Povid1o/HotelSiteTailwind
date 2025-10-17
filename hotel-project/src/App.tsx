import React, { Suspense, lazy, useContext, useState, useEffect } from "react";
import { createHashRouter, RouterProvider, ScrollRestoration, Outlet } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import LoadingScreen from './components/LoadingScreen';
import TravelLineScript from "./components/TravelLineScript.tsx";

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
const ModalWindow = lazy(() => import('./components/modals/ModalWindow.tsx'))
const ProductionCenter = lazy(() => import( "./ProductionCenter.tsx"))
const Main = lazy(() => import('./components/Main'))
const NotFound = lazy(() => import('./components/NotFoundPage.tsx'))  // Добавлено




const publicrouter = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      {
        path: "/Hotel",
        element: <WineHotel />,
      },
      {
        path:"/Events",
        element: <Ivents />,
      },
      {
        path:"/Events/:categorie",
        element: <EventsList />,
      },
      {
        path:"/Restaurant",
        element: <Restaurant />,
      },
      {
        path:"/Vinery",
        element: <Vinery />,
      },
      {
        path: "/registration",
        element: <Auth/>
      },
      {
        path: "/Shop",
        element: <Shop/>
      },
      {
        path: "/Shop/:productId",
        element: <WinePage />,
      },
      {
        path: "/ProductionCenter",
        element: <ProductionCenter />,
      },
      {
        path: "*",  // Добавлено
        element: <NotFound />
      },
    ],
  }
]);

const hiderouter = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      {
        path: "/Hotel",
        element: <WineHotel />,
      },
      {
        path:"/Events",
        element: <Ivents />,
      },
      {
        path:"/Events/:categorie",
        element: <EventsList />,
      },
      {
        path:"/Restaurant",
        element: <Restaurant />,
      },
      {
        path:"/Vinery",
        element: <Vinery />,
      },
      {
        path: "/Shop",
        element: <Shop/>
      },
      {
        path: "/Shop/:productId",
        element: <WinePage />,
      },
      {
        path: "/ProductionCenter",
        element: <ProductionCenter />,
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
      {
        path: "*",  // Добавлено
        element: <NotFound />
      },
    ]
  }
]);

function Layout() {
  return (
      <div>
        <TravelLineScript />
        <ScrollRestoration />
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </div>
  );
}

const App= observer(() => {
      const appCtx = useContext(Context);
      const user = appCtx ? appCtx.user : { isAuth: false } as any;
      const [loading, setLoading] = useState(true);
      const [showModal, setShowModal] = useState(false);

      // Загружаем все данные при старте приложения
      useEffect(() => {
        console.log('=== App: Загрузка данных при старте приложения ===');
        if (appCtx) {
          const { dish, hotel, pageContent, wine } = appCtx;
          
          Promise.all([
            dish.loadDishes().catch(err => console.error('Ошибка загрузки блюд:', err)),
            hotel.loadRooms().catch(err => console.error('Ошибка загрузки номеров:', err)),
            pageContent.loadPageContent().catch(err => console.error('Ошибка загрузки страниц:', err)),
            wine.loadWines().catch(err => console.error('Ошибка загрузки вин:', err))
          ]).then(() => {
            console.log('✅ Все данные загружены');
          });
        }
      }, [appCtx]);

      useEffect(() => {
        const timeoutId = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timeoutId);
      }, []);

      useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisited");
        if (hasVisited !== "true") {
          setShowModal(true);
        }
      }, []);


      const handleCloseModal = () => {
        setShowModal(false);
        localStorage.setItem("hasVisited", "true");
      }


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

                      </section>
                      {showModal && <ModalWindow onClose={handleCloseModal}></ModalWindow>}
                    </div>
                )}
          </>
      );
    }
);

export default App;
