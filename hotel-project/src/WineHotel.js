import Navbar from "./components/Navbar.js"
import Home from './components/Home'
import Footer from "./components/Footer.js";
import { useState } from "react";

function WineHotel() {
  const [nav, setNav] = useState(false);
  return (
    <div>
      <Navbar nav = {nav} setNav = {setNav}/>
      <Home nav = {nav}/>
      <Footer />
    </div>
  );
}

export default WineHotel;
