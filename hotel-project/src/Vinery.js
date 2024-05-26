import React, { useState } from 'react'

import Navbar from "./components/Navbar.js"
import Footer from "./components/Footer.js";


function Vinery() {
    const [nav, setNav] = useState(false);
    return (
        <div>

            <Navbar nav = {nav} setNav = {setNav}/>
        
            <div className="flex h-screen items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 flex flex-col px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold mx-auto">Page Under Development</strong>
                    <span className="block sm:inline">This page is currently under development and may not be fully functional.</span>
                </div>
            </div>

            <Footer />

        </div>
     );
}
 
export default Vinery;