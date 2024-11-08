import React, { useState } from 'react'

import Navbar from "./components/Navbar.js"
import Footer from "./components/Footer.js";
import VideoTextEffect from './components/effectComponents/VideoTextEffect.js';

import VineImage from "./components/assets/Leonardo_Phoenix_A_highly_detailed_photorealistic_3D_render_of_3-2.png"
import ScreensaverVieo from "./components/assets/HorizonInSonoma.mp4"

function Vinery() {
    const [nav, setNav] = useState(false);
    return (
        <div>

            <Navbar nav = {nav} setNav = {setNav}/>
        
            {/* <div className="flex h-screen items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 flex flex-col px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold mx-auto">Page Under Development</strong>
                    <span className="block sm:inline">This page is currently under development and may not be fully functional.</span>
                </div>
            </div> */}

            

            <section className="w-full h-max bg-white">

                {/* <div className="bg-[url('https://jooinn.com/images/Бельцы-закат-над-рапсовом-поле-balti-apus-de-soare-peste-câmpul-de-rapiță.jpg')] bg-no-repeat bg-cover bg-gray-300 bg-blend-multiply w-full h-screen rounded-xl"/> */}
                
                <div className="bg-[] bg-no-repeat bg-cover bg-blend-multiply w-full h-screen rounded-xl backdrop-filter backdrop-blur-md bg-gray-600 bg-opacity-50">
                    <div className="max-w-[700px] h-screen mx-auto px-16 flex flex-col justify-center content-center text-center xl:max-w-[900px]">
                        <h1 className='text-3xl font-bold font-body py-3 relative text-[#FFFBF0] drop-shadow-2xl isolate md:text-5xl xl:text-7xl'>Добро пожаловать на Винные Террасссы</h1>
                    </div>
                </div>

                {/* <div className="bg-no-repeat bg-cover bg-blend-multiply w-full h-screen rounded-xl backdrop-filter backdrop-blur-md bg-gray-600 bg-opacity-50">
                    <img src={VineImage} className="object-cover h-full w-full" />
                    <div className="max-w-[700px] h-screen mx-auto px-16 flex flex-col justify-center content-center text-center xl:max-w-[900px]">
                        <h1 className='text-3xl font-bold font-body py-3 relative text-white drop-shadow-2xl isolate md:text-5xl xl:text-7xl'>Добро пожаловать на Винные Террасссы</h1>
                    </div>
                </div> */}
            
            </section>

            <section>
                <VideoTextEffect
                    text="Роскошь"
                    video={ScreensaverVieo}
                />
            </section>

            <Footer />

        </div>
     );
}
 
export default Vinery;