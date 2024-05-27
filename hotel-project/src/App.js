import WineHotel from "./WineHotel.js";
import Ivents from "./Ivents.js";
import Restaurant from "./Restaurant.js";
import Vinery from "./Vinery.js";
import Auth from "./Auth.js"
import React, {useContext, useState, useEffect} from "react";
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import AdminPage from "./AdminPage.js";
import { observer } from "mobx-react-lite";
import {Context} from "./index";




const publicrouter = createBrowserRouter([
  
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
  {
    path: "/login",
    element: <Auth/>
  },
]);

const hiderouter = createBrowserRouter([
  
  {
    path: "/",
    element: <WineHotel />,
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
]);


const App= observer(() => {
  const { user} = useContext(Context);


  return (
    <div>
      {!user.isAuth && <RouterProvider router={publicrouter}/>}
      {user.isAuth && <RouterProvider router={hiderouter}/>}
      {/* <WineHotel/> */}
    </div>

  );
})

export default App;
