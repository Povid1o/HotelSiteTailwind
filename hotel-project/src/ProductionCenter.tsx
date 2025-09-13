import "./components/styles/hover.css"
import './components/styles/vinery.css'

import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import VectorImage from "./components/assets/Vector1.png";
// import VectorBranch from "./components/assets/vector-branch.svg";
import React from "react";

export default function ProductionCenter() {
    return (
        <>
            <Navbar></Navbar>
            <main className="w-full h-max overflow-hidden bg-white font-body 3xl:max-w-screen-3xl 3xl:mx-auto">
                {/*Заголовок */}
                <header className="flex flex-col relative w-screen h-screen">

                    <div className="relative bg-[url('./components/assets/VineryBackground.png')] header-background">
                        <div className='header-page'>
                            <h3 className='text-[47px] font-medium'>Центр производства локальных продуктов</h3>
                            <h1 className="text-[48px] leading-[58px] md:text-[88px] lg:text-[152px] md:leading-[105px] lg:leading-[183px]">
                                БОЛЬШИЕ ХУТОРА
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

                {/*Опционально лозунг*/}
                <section className='flex justify-center'>
                    <div className='flex flex-col items-center'>
                        <div><h1 className='text-[60px] my-32 font-medium text-main_theme text-center slogan'>Мы пишем красивые слоганы</h1></div>
                        {/*<img src={VectorBranch}*/}
                        {/*     alt="Декоративный вектор"*/}
                        {/*/>*/}
                    </div>
                </section>

                {/*О проекте*/}
                <section className='flex flex-col justify-center items-center text-gray-700 gap-10 p-20'>
                    <h1 className="text-[48px] font-semibold leading-[58px] md:text-[80px] lg:text-[96px] md:leading-[105px] lg:leading-[183px]">
                        О ПРОЕКТЕ
                    </h1>
                    <div className=' mx-auto flex flex-row bg-white rounded-xl drop-shadow-2xl'>
                        <div className="'w-2/3 h-full bg-[url('./components/assets/VineryBackground.png')] bg-no-repeat bg-cover bg-blend-multiply w-full h-screen'">
                        </div>

                        <div className="w-full p-10 font-body">
                            <h1 className="header-section pr-16 text-3xl font-bold ">О ЧЕМ ЦЕНТР ПРОИЗВОДСТВА</h1>
                            <p className="max-w-screen-lg font-light text-left  bg-white text-xs md:text-base lg:text-lg xl:text-2xl pt-8">
                                Отель-винодельня "Винные Террассы" - это уникальное место, сочетающее в себе шарм и гостеприимство с изысканными винами, произведенным нашими виноделами по собственному рецепту. Мы предлагаем гостям возможность насладиться роскошью и комфортом, а также окунуться в удивительный мир виноделия, попробовать уникальные сорта вин и узнать историю их создания.
                            </p>
                        </div>

                    </div>
                    <div className='max-w-[700px] mx-auto bg-white rounded-xl drop-shadow-2xl max-sm:w-5/6 md:w-3/4 lg:max-w-[900px] xl:mx-8'>

                        <div className="w-full p-10 py-5 font-body">
                            <h1 className="header-section pr-16 text-3xl font-bold text-gray-700">О ЧЕМ ЦЕНТР ПРОИЗВОДСТВА</h1>
                            <p className="max-w-screen-lg font-light text-left text-gray-700 bg-white text-xs md:text-base lg:text-lg xl:text-2xl pt-8">
                                Отель-винодельня "Винные Террассы" - это уникальное место, сочетающее в себе шарм и гостеприимство с изысканными винами, произведенным нашими виноделами по собственному рецепту. Мы предлагаем гостям возможность насладиться роскошью и комфортом, а также окунуться в удивительный мир виноделия, попробовать уникальные сорта вин и узнать историю их создания.
                            </p>
                        </div>

                    </div>

                </section>

                {/*Производство (видосы)*/}
                <section></section>

                {/*Продукты*/}
                <section></section>

                {/*Где купить*/}
                <section></section>

                {/*Дополнительные услуги*/}
                <section></section>
            </main>
            <Footer></Footer>
        </>
    )
}