import Navbar from "./components/Navbar.js"
import Home from './components/Home'
import Footer from "./components/Footer.js";
import { useState } from "react";


function Ivents() {

    const [nav, setNav] = useState(false);
    return (
        <div>
            <Navbar nav = {nav} setNav = {setNav}/>
            <div className="w-full h-[1000px]">
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d2/Robert_Young_Vineyards.jpg" className="flex mx-auto max-w-[700px]"/>

            </div>
            <Footer />
        </div>
    );
}
 
export default Ivents;