import Navbar from "./components/Navbar.js"
import Home from './components/Home'
import Footer from "./components/Footer.js";
import LoadingScreen from "./components/LoadingScreen.js";
import { useState, useEffect } from "react";

function WineHotel() {
  const [nav, setNav] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (document.readyState === 'complete') {
      timeoutId = setTimeout(() => {
        setIsLoaded(true);
      }, 1000); // wait for 1 second before setting isLoaded to true
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        timeoutId = setTimeout(() => {
          setIsLoaded(true);
        }, 1000); // wait for 1 second after DOM is loaded
      });
    }
  
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div>

      {isLoaded ? (
        <div>
          <Navbar nav = {nav} setNav = {setNav}/>
          <Home nav = {nav}/>
          <Footer />
        </div>
      ) : (
        <div><LoadingScreen/></div>
      )}
    </div>

  );
}

export default WineHotel;
