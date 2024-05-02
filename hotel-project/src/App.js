import WineHotel from "./WineHotel.js";
import Ivents from "./Ivents.js";
import Restaurant from "./Restaurant.js";
import Vinery from "./Vinery.js";
import React from "react";
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <WineHotel />,
  },
  {
    path:"/Мероприятия",
    element: <Ivents />,
  },
  {
    path:"/Ресторан",
    element: <Restaurant />,
  },
  {
    path:"/Винодельня",
    element: <Vinery />,
  },
]);

function App() {


  return (
    <div>
      <RouterProvider router={router}/>
      {/* <WineHotel/> */}
    </div>
  );
}

export default App;
