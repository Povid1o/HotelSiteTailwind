import React, { Suspense, lazy, useContext, useState, useEffect } from "react";
import { createBrowserRouter, Navigate, RouterProvider, ScrollRestoration, Outlet } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import LoadingScreen from './components/LoadingScreen';
import TravelLineScript from "./components/TravelLineScript.tsx";
import ErrorBoundary from './components/ErrorBoundary';
import SiteMeta from './components/SiteMeta';
import AgeGate from './components/AgeGate';
import RouteDataLoader from './components/RouteDataLoader';

// Ленивая загрузка компонентов
const HotelPage = lazy(() => import("./HotelPage.tsx"));
const InfoPages = lazy(() => import("./InfoPages.tsx"));
const Ivents = lazy(() => import("./Ivents.tsx"));
const Restaurant = lazy(() => import("./Restaurant.tsx"));
const Vinery = lazy(() => import("./Vinery.tsx"));
const Shop = lazy(() => import("./Shop.tsx"));
const Auth = lazy(() => import("./Auth.tsx"));
const AdminPage = lazy(() => import("./AdminPage.tsx"));
const WinePage = lazy(() => import("./components/cards/WinePage.tsx"));
const ModalWindow = lazy(() => import('./components/modals/ModalWindow.tsx'))
const Main = lazy(() => import('./components/Main'))
const NotFound = lazy(() => import('./components/NotFoundPage.tsx'))  // Добавлено




const RequireAdmin = observer(() => {
  const context = useContext(Context);
  return context?.user.isAuth ? <AdminPage /> : <Navigate replace to="/login" />;
});

const router = createBrowserRouter([
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
            <HotelPage />
          </ErrorBoundary>
        ),
      },
      {
        path:"/Events",
        element: <Ivents />,
      },
      {
        path:"/Events/:categorie",
        element: <Ivents />,
      },
      {
        path:"/Ivents",
        element: <Ivents />,
      },
      {
        path:"/Ivents/:categorie",
        element: <Ivents />,
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
      { path: "/Contacts", element: <InfoPages /> },
      { path: "/Privacy", element: <InfoPages /> },
      {
        path: "/login",
        element: <Auth/>
      },
      {
        path: '/admin',
        element: <RequireAdmin/>
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
        <SiteMeta />
        <TravelLineScript />
        <ScrollRestoration />
        <RouteDataLoader />
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
      const [showAgeGate, setShowAgeGate] = useState(false);

      // Проверяем только сессию до первого рендера. Контент публичных страниц
      // загружается самими маршрутами: это не даёт медленному API скрывать сайт.
      useEffect(() => {
        let canceled = false;
        const verifySession = async () => {
          if (!appCtx) {
            setLoading(false);
            return;
          }
          try {
            await appCtx.user.checkAuth();
          } finally {
            if (!canceled) setLoading(false);
          }
        };
        void verifySession();
        return () => { canceled = true; };
      }, [appCtx]);

      useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisited");
        if (hasVisited !== "true") {
          setShowModal(true);
        }
      }, []);

      useEffect(() => {
        setShowAgeGate(localStorage.getItem('ageConfirmed') !== 'true');
      }, []);

      const confirmAge = () => {
        localStorage.setItem('ageConfirmed', 'true');
        setShowAgeGate(false);
      };


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
                  <RouterProvider router={router} />
                </ErrorBoundary>
              </section>
              
              {/* Modal - показываем только для авторизованных */}
              {user.isAuth && showModal && <ModalWindow onClose={handleCloseModal} />}
              {showAgeGate && <AgeGate onConfirm={confirmAge} />}
            </div>
          </>
      );
    }
);

export default App;
