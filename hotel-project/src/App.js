import WineHotel from "./WineHotel.js";
import Ivents from "./Ivents.js";
import Restaurant from "./Restaurant.js";
import Vinery from "./Vinery.js";
import React from "react";
import EventsList from "./components/EventsList.js";
import { createBrowserRouter, RouterProvider, ScrollRestoration, Outlet } from 'react-router-dom'

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
  return (
    <RouterProvider router={router} />
  );
}

export default App;