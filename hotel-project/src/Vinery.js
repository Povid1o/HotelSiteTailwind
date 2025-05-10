import React, { useState } from 'react'

import Navbar from "./components/Navbar.js"
import Footer from "./components/Footer.js";
import VectorImage from "./components/assets/Vector1.png"
import ThreeBottles from "./components/assets/ThreeBottles.png"
import WineCaps from "./components/assets/WineCaps.png"
import BottleTransparent from "./components/assets/BottleTransparent.png"
// import ArrowRight from "./components/assets/Arrow.png"
import { FaLongArrowAltRight } from "react-icons/fa";

import "./components/hover.css"

import BackgroundPhoto from './components/assets/VineryBackground.png'
import VineImage from "./components/assets/Leonardo_Phoenix_A_highly_detailed_photorealistic_3D_render_of_3-2.png"
import ScreensaverVieo from "./components/assets/HorizonInSonoma.mp4"

function Vinery() {
    const [nav, setNav] = useState(false);
    return (
        <>

            <Navbar nav = {nav} setNav = {setNav} isTransparent={true}/>
        
            <main className="w-full h-max bg-white font-body">

                <section className="flex flex-col relative w-screen h-screen">

                    <div className="relative bg-[url('./components/assets/VineryBackground.png')] bg-no-repeat bg-cover bg-blend-multiply w-full h-screen rounded-b-xl backdrop-filter backdrop-blur-md bg-gray-600 bg-opacity-50 flex items-center justify-center text-center px-16">
                        <h1 className="text-[152px] leading-[183px] font-bold font-body py-3 relative text-[#FFFBF0] drop-shadow-2xl isolate">
                        Винодельня
                        </h1>
                        {/* Векторное изображение */}
                        <img
                        src={VectorImage}
                        alt="Разделительный вектор"
                        className="absolute bottom-0 w-screen left-1/2 transform"
                        style={{ transform: 'translateX(-50%) translateY(45%)' }}
                        />
                    </div>
                    
                </section>

                <section className="grid grid-flow-row-dense grid-cols-5 mx-auto mt-8 max-sm:w-5/6 md:w-[92%]">
                        <div className='z-10 col-span-2 flex flex-col'>
                            <p className='max-w-screen-lg font-light text-left text-[#3E4756] bg-white text-xs md:text-base lg:text-lg xl:text-2xl pt-8'>
                                Откройте для себя мир превосходных вин в нашей винодельне!  Мы предлагаем уникальные и высококачественные сорта вин, созданные с любовью и вниманием к каждой детали. Посетите нашу винодельню и убедитесь в качестве наших вин самостоятельно. Здесь вы сможете насладиться изысканными напитками, отдохнуть и провести время в уютной атмосфере.
                            </p>
                            
                            <button className="flex justify-start">
                                <div className='flex-col inline-block py-8 pr-8 bottom-3'>
                                    
                                    <div className='flex flex-row '>
                                        <a href="#" className='underlineDesktop text-[#3E4756] leading-[38px] mx-2 text-lg mobile:text-xl md:text-2xl font-semibold'>Ассортимент вин</a>
                                        <FaLongArrowAltRight className='w-[25px] h-[15px] left-[35px] my-auto'/>
                                    </div>
                                    <hr className="border-gray-400 w-full my-2" />

                                </div>
                            </button>
                        </div>
                        {/* <p className='z-10 col-span-2 max-w-screen-lg font-body font-light text-left text-[#3E4756] bg-white text-xs md:text-base lg:text-lg xl:text-2xl pt-8'>
                            Откройте для себя мир превосходных вин в нашей винодельне!  Мы предлагаем уникальные и высококачественные сорта вин, созданные с любовью и вниманием к каждой детали. Посетите нашу винодельню и убедитесь в качестве наших вин самостоятельно. Здесь вы сможете насладиться изысканными напитками, отдохнуть и провести время в уютной атмосфере.
                        </p> */}
                        <img src={ThreeBottles} alt="" className='mx-auto col-span-3 transform -translate-y-1/4'/>

                </section>


                <section className="relative bottom-72 w-screen overflow-hidden">
                    <h1 className='relative top-20 font-bold text-5xl leading-[58px] text-[#3E4756] ml-12'>НАША ИСТОРИЯ</h1>
                    <img 
                        src={WineCaps} 
                        className="w-[2000px] h-auto max-w-none mx-auto relative left-1/2 -translate-x-1/2" 
                        alt="" 
                    />
                    <div>

                    </div>
                </section >

                <section>
                    <div className='w-full grid grid-flow-row-dense grid-cols-4'>

                        <p className='col-span-1 text-2xl leading-[32px]'>
                            У нас вы сможете попробовать как классические, так и эксклюзивные вина, созданные по уникальным рецептурам. Наши опытные сомелье помогут вам выбрать вино, которое идеально подойдёт именно для вашего случая. 
                        </p>
                        <p className='col-span-2'></p>
                        <p className='col-span-1 text-2xl leading-[32px]'>
                            Наш каталог включает более 100 наименований вин, среди которых вы обязательно найдете напиток по своему вкусу. Мы гордимся тем, что наши вина получают высокие оценки
                            от экспертов и ценителей со всего мира.
                        </p>

                    </div>
                    <img src={BottleTransparent} className='mx-auto col-span-3 transform -translate-y-full'/>
                </section>

                

            </main>

            

            <Footer />

        </>
     );
}
 
export default Vinery;