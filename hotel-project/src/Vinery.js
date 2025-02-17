import React, { useState } from 'react'

import Navbar from "./components/Navbar.js"
import Footer from "./components/Footer.js";
import VectorImage from "./components/assets/Vector1.png"
import ThreeBottles from "./components/assets/ThreeBottles.png"
import WineCaps from "./components/assets/WineCaps.png"
import BottleTransparent from "./components/assets/BottleTransparent.png"
// import ArrowRight from "./components/assets/Arrow.png"
import { FaLongArrowAltRight } from "react-icons/fa";

import "./components/styles/hover.css"
import './components/styles/vinery.css'
// import "./components/styles/"

function Vinery() {
    const [nav, setNav] = useState(false);
    return (
        <>

            <Navbar nav = {nav} setNav = {setNav} isTransparent={true}/>
        
            <main className="w-full h-max bg-white font-body">
                {/*  Intro */}
                <header className="flex flex-col relative w-screen h-screen">

                    <div className="relative bg-[url('./components/assets/VineryBackground.png')] header-background">
                        <div className='header-page'>
                            <h1 className="text-[48px] leading-[58px] md:text-[88px] lg:text-[152px] md:leading-[105px] lg:leading-[183px]">
                                    Винодельня
                            </h1>
                        </div>
                        
                        {/* Векторное изображение */}
                        <img
                        src={VectorImage}
                        alt="Разделительный вектор"
                        className="absolute z-[1] bottom-0 w-screen left-1/2 transform"
                        style={{ transform: 'translateX(-50%) translateY(45%)' }}
                        />
                    </div>
                    
                </header>
                {/*  Intro */}

                {/* Brick 1*/}
                {/* Brick 1 Tablet&Computer*/}
                <section className="hidden sm:grid grid-flow-row-dense grid-cols-5 mx-auto mt-8 w-[92%]">
                {/* <section className="grid grid-flow-row-dense grid-cols-5 mx-auto mt-8 w-[92%]"> */}
                        <div className='z-10 col-span-2 flex flex-col'>
                            <p className='max-w-screen-lg font-light text-left text-[#3E4756] text-xs md:text-base lg:text-lg xl:text-2xl pt-8'>
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
                        
                        <img src={ThreeBottles} alt="" className='size-[120%] mx-auto col-span-3 transform -translate-y-1/4'/>

                </section>
                {/* Brick 1 Tablet&Computer*/}

                {/* Brick 1 Mobile*/}
                <section className="mx-auto mt-12 w-[92%] sm:hidden">
                        <div className='z-10 col-span-2 flex flex-col'>
                            <p className='max-w-screen-lg font-normal text-[12px] leading-[24px] text-left text-[#3E4756]'>
                                Откройте для себя мир превосходных вин в нашей винодельне!  Мы предлагаем уникальные и высококачественные сорта вин, созданные с любовью и вниманием к каждой детали. Посетите нашу винодельню и убедитесь в качестве наших вин самостоятельно. Здесь вы сможете насладиться изысканными напитками, отдохнуть и провести время в уютной атмосфере.
                            </p>
                            
                            <button className="flex justify-start">
                                <div className='flex-col inline-block py-8 pr-8 bottom-3'>
                                    
                                    <div className='flex flex-row '>
                                        <a href="#" className='underlineDesktop text-[#3E4756] text-[18px] leading-[22px] font-semibold mx-2'>Ассортимент вин</a>
                                        <FaLongArrowAltRight className='w-[25px] h-[15px] left-[35px] my-auto'/>
                                    </div>
                                    <hr className="border-gray-400 w-full my-2" />

                                </div>
                            </button>
                        </div>
                        
                        <img src={ThreeBottles} alt="" className='size-[60%] mx-auto col-span-3 transform translate-x-1/3' style={{ "--tw-translate-y": "-45%" }}/>

                </section>
                {/* Brick 1 Mobile*/}
                {/* Brick 1*/}


                <section className="relative w-screen overflow-hidden lg:bottom-72 ">
                    <h1 className='relative top-20 text-[#3E4756] font-bold ml-4 mobile:max-w-[150px] mobile:text-[24px] mobile:leading-[29px] sm:text-[32px] sm:leading-[38px] lg:text-[48px] lg:leading-[58px] lg:ml-12'>НАША ИСТОРИЯ</h1>
                    <img 
                        src={WineCaps} 
                        className="w-[200%] h-auto max-w-none mx-auto relative left-1/2 -translate-x-1/2 mobile:mt-16" 
                        alt="" 
                    />
                </section >


                {/* <section>
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
                </section> */}

                

            </main>

            

            <Footer />

        </>
     );
}
 
export default Vinery;