import React, { Suspense, lazy, useContext, useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, ScrollRestoration, Outlet } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import LoadingScreen from './components/LoadingScreen';
import TravelLineScript from "./components/TravelLineScript.tsx";
import ErrorBoundary from './components/ErrorBoundary';

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




const publicrouter = createBrowserRouter([
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
        element: (
          <ErrorBoundary>
            <WineHotel />
          </ErrorBoundary>
        ),
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
        path: "/login",
        element: <Auth/>
      },
      {
        path: "/registration",
        element: <Auth/>
      },
      {
        path: "*",  // Добавлено
        element: <NotFound />
      },
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
        element: <Main />,
      },
      {
        path: "/Hotel",
        element: (
          <ErrorBoundary>
            <WineHotel />
          </ErrorBoundary>
        ),
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
      // ✅ НЕ вызываем checkAuth() автоматически - флаг isAuth уже установлен из localStorage
      useEffect(() => {
        console.log('=== App: Загрузка данных при старте приложения ===');
        let canceled = false;
        const bootstrap = async () => {
          if (!appCtx) {
            setLoading(false);
            return;
          }
          const { dish, hotel, pageContent, wine, events } = appCtx;
          try {
            // Загружаем данные без проверки токена на backend
            await Promise.all([
              dish.loadDishes().catch(err => console.error('Ошибка загрузки блюд:', err)),
              hotel.loadRooms().catch(err => console.error('Ошибка загрузки номеров:', err)),
              pageContent.loadPageContent().catch(err => console.error('Ошибка загрузки страниц:', err)),
              wine.loadWines().catch(err => console.error('Ошибка загрузки вин:', err)),
              events.refreshAll().catch(err => console.error('Ошибка загрузки мероприятий:', err))
            ]);
            if (!canceled) {
              console.log('✅ Все данные загружены. Статус авторизации из localStorage:', user.isAuth);
              setLoading(false);
            }
          } catch (e) {
            console.error('❌ Ошибка при инициализации приложения:', e);
            if (!canceled) setLoading(false);
          }
        };
        bootstrap();
        return () => { canceled = true; };
      }, [appCtx]);

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
            <div style={{ position: 'relative', minHeight: '100vh' }}>
              {/* Loading screen - показываем ДЛЯ ВСЕХ во время загрузки контента */}
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
              
              {/* Main content */}
              <section
                  style={{
                    opacity: loading ? 0 : 1,
                    transition: 'opacity 1s ease-in',
                    visibility: loading ? 'hidden' : 'visible',
                  }}
              >
                {/* ErrorBoundary для ловли ошибок рендера */}
                <ErrorBoundary>
                  <RouterProvider router={user.isAuth ? hiderouter : publicrouter} />
                </ErrorBoundary>
              </section>
              
              {/* Modal - показываем только для авторизованных */}
              {user.isAuth && showModal && <ModalWindow onClose={handleCloseModal} />}
            </div>
          </>
      );
    }
);

export default App;
