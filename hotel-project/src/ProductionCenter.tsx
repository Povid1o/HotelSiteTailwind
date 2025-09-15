import "./components/styles/hover.css"
import './components/styles/vinery.css'
import './components/styles/productionCenter.css'

import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import VectorImage from "./components/assets/Vector1.png";
import VectorBranch from "./components/assets/VectorBranch.svg"
import VinogradTransparentBg from "./components/assets/VinogradTransparentBg.png"
import GrapePlant from './components/assets/GrapePlant.png'
import React from "react";
import ProductionCard from "./components/cards/ProductionCard.tsx";
import ProductionDesc from "./components/cards/ProductionDesc.tsx";

interface ProductionCenterProps {
    title?: string,
    description?:string,
    position?: string,
}

export default function ProductionCenter({title}: ProductionCenterProps) {
    return (
        <>
            <Navbar></Navbar>
            <main className="w-full h-max overflow-hidden bg-white font-body 3xl:max-w-screen-3xl 3xl:mx-auto">
                {/*Заголовок */}
                <header className="flex flex-col relative w-screen h-screen">

                    <div className="relative bg-[url('./components/assets/VineryBackground.png')] header-background">
                        <div className='header-page'>
                            <h3 className='text-[47px] font-medium'>Центр производства локальных продуктов</h3>
                            <h1 className="section-title font-bold">
                                БОЛЬШИЕ ХУТОРА
                            </h1>
                        </div>

                        {/* Векторное изображение */}
                        <img
                            src={VectorImage}
                            alt="Разделительный вектор"
                            className="absolute z-[1] bottom-0 w-screen left-1/2 transform"
                            style={{transform: 'translateX(-50%) translateY(45%)'}}
                        />
                    </div>


                </header>

                {/*Опционально лозунг*/}
                <section className='flex justify-center'>

                    <div className='flex flex-col items-center'>
                        <div><h1 className='text-[60px] my-32 font-medium text-main_theme text-center slogan'>Мы пишем
                            красивые слоганы</h1></div>
                        <img src={VectorBranch}
                             alt="Декоративный вектор"
                        />
                    </div>
                </section>

                {/*О проекте*/}
                <section className='w-full flex flex-col justify-center items-center text-[#3E4756] gap-10 p-20 pb-52'>
                    <h1 className="section-title my-24">
                        О ПРОЕКТЕ
                    </h1>

                    <ProductionCard
                        imageStyle='w-[700px]'
                        spesialDesc={'text-xs md:text-xl lg:text-2xl xl:text-3xl'}
                        title={"О ЧЕМ ЦЕНТР ПРОИЗВОДСТВА"}
                        description={'Не очень много текста. Может 2-3 предложения. С этим размером шрифта всё понятнее'}/>
                    <ProductionCard
                        imageStyle='w-[700px]'
                        spesialDesc={'text-xs md:text-xl lg:text-2xl xl:text-3xl'}
                        title={"НАША ФИЛОСОФИЯ"}
                        description={'Не очень много текста. Может 2-3 предложения. С этим размером шрифта всё понятнее'}/>

                </section>

                {/*Производство (видосы)*/}
                <section className='relative z-[0]'>
                    <img
                            src={VectorImage}
                            alt="Разделительный вектор"
                            className="absolute z-[1] top-[-280px] w-screen left-1/2 transform"
                            style={{transform: 'translateX(-50%) translateY(45%)'}}
                        />

                    <div className='bg-main_theme flex flex-col w-full gap-20 py-40 px-20'>
                        <img
                            src={GrapePlant}
                            alt='ветка винограда'
                            className='z-[2] absolute top-[-100px] right-0 w-5/6'
                        />
                        <ProductionDesc position={''} title={'Преимущества свежих местных продуктов'} description={'Описание. 2-3 предложения'}></ProductionDesc>
                        <ProductionDesc position={'justify-end'} title={'Связь с основной деятельностью винодельни'} description={'Описание. 2-3 предложения'}></ProductionDesc>

                    </div>
                    <div className='flex flex-col gap-10 py-40 px-10 bg-[url("./components/assets/ProductionBg.png")] text-gray-700'>
                        <ProductionCard title={'Название видео'} description={'Описание видео. 2-3 предложения'}></ProductionCard>
                        <ProductionCard title={'Название видео'} description={'Описание видео. 2-3 предложения'}></ProductionCard>
                    </div>
                    <img src={VinogradTransparentBg}
                         alt="гроздь винограда"
                         className='z-[2] absolute bottom-1/3 size-2/5'
                    />
                    <img
                            src={VectorImage}
                            alt="Разделительный вектор"
                            className="absolute z-[1] bottom-0 w-screen left-1/2 transform"
                            style={{transform: 'translateX(-50%) translateY(45%)'}}
                        />
                </section>

                {/*Продукты*/}
                <section className='w-full flex flex-col justify-center items-center text-[#3E4756] gap-10 p-20'>
                    <h1 className="section-title text-[#3E4756]">
                        Продукты
                    </h1>
                </section>

                {/*Где купить*/}
                <section className='bg-main_theme text-white w-full flex flex-col justify-center items-center gap-10 p-20 relative'>
                    <h1 className="section-title z-[2]">
                        где купить
                    </h1>
                    <img src={VectorBranch}
                         alt="Декоративный вектор"
                         className='absolute z-[1] right-[-200px] rotate-[45deg]'
                    />
                    <div className='w-full'>
                        <ul className='text-3xl font-light'>
                            <li><span className='font-bold'>Основной магазин на территории винодельни: </span>Адрес</li>
                            <li><span className='font-bold'>Партнерские точки продаж: </span>Адрес</li>
                            <li><span className='font-bold'>Возможность заказа/доставки: </span>Адрес</li>
                            <li><span className='font-bold'>Контактная информация для оптовых покупателей: </span>Адрес</li>
                        </ul>
                    </div>
                </section>

                {/*Дополнительные услуги*/}
                <section className='text-[#3E4756] text-center w-full flex flex-col justify-center items-center gap-10 p-20'>
                    <h1 className="text-[48px]  leading-[58px] md:text-[88px] lg:text-[140px] md:leading-[105px] lg:leading-[183px] font-semibold uppercase">
                        дополнительные услуги
                    </h1>
                    <div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <img src={VectorBranch}
                         alt="Декоративный вектор"
                         className='absolute'
                    />
                    <img src={VectorBranch}
                         alt="Декоративный вектор"
                         className='absolute'
                    />
                </section>
            </main>
            <Footer></Footer>
        </>
    )
}