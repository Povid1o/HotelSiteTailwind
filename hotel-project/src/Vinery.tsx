// @ts-nocheck
// TASK
// 1)Заменить процесс производства с иконок, существующих сейчас на слайдер по ссылке https://www.reactbits.dev/components/rolling-gallery
// 2)Доделать даты 

// "npm i ogl" - команда, добавить в записи об установке


import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Context } from './index';
import { observer } from 'mobx-react-lite';
import { API_BASE } from './components/http';

import Navbar from "./components/Navbar"
import Footer from "./components/Footer";
// import ProcessCard from './components/cards/ProcessCard';
import CircularGallery from './components/sliders/CircularGallery';
import { FaLongArrowAltRight } from "react-icons/fa";

import "./components/styles/hover.css"
import './components/styles/vinery.css'

import VectorImage from "./components/assets/Vector1.png"
import ThreeBottles from "./components/assets/ThreeBottles.png"
import WineCaps from "./components/assets/WineCaps.png"
import BottleTransparent from "./components/assets/BottleTransparent.png"
import BottleTransparentHorizontal from "./components/assets/BottleTransparentHorizontal.png"
import WineReservour from "./components/assets/WineReservour.png"
import WineBarrel from "./components/assets/WineBarrel.png"
import Grape from "./components/assets/Grape.png"
import BottleProduce from "./components/assets/BottleProduce.png"
import GeografieMobile from "./components/assets/GeografieMobile.svg"
import GeografieTablet from "./components/assets/GeografieTablet.svg"
import GeografieComputer from "./components/assets/GeografieComputer.svg"
import GrapeLines from "./components/assets/GrapeLines.jpg"

const Button = ({text}) => {
    return(
        <Link to='/Shop'>
            <div className="flex justify-start">
                <div className='flex-col inline-block p-2'>
                                        
                    <div className='flex flex-row '>
                        <span className='underlineDesktop text-[#3E4756] text-[18px] leading-[22px] font-semibold mx-2 md:text-2xl'>{text}</span>
                        <FaLongArrowAltRight className='w-[25px] h-[15px] left-[35px] my-auto'/>
                    </div>
                    <hr className="border-gray-400 w-full my-2" />

                </div>
            </div>
        </Link>
    )
}

const Timeline = ({ leftDates = [], rightDates = [] }) => {
    return (
        <div className="relative w-full overflow-visible">
            <div className="relative w-full overflow-visible aspect-[16/9]">
                <img
                    src={WineCaps}
                    className="absolute w-full h-full object-cover scale-[1.35] sm:scale-125"
                    alt="История винодельни"
                />
                    
                <div className="absolute inset-0 z-10">
                    {/* Левая колонка дат */}
                    <div className="absolute left-[8%] top-[15%] bottom-[15%] flex flex-col justify-around w-[30%] timeline-column">
                        {leftDates.map((date, index) => (
                            <div key={`left-${index}`} className="timeline-item">
                                <h3 className="date-header">{date.year}</h3>
                                <p className="date-content">{date.description}</p>
                            </div>
                        ))}
                    </div>
                        
                    {/* Правая колонка дат */}
                    <div className="absolute right-[8%] top-[15%] bottom-[15%] flex flex-col justify-around w-[30%] timeline-column right-column">
                        {rightDates.map((date, index) => (
                            <div key={`right-${index}`} className="timeline-item">
                                <h3 className="date-header">{date.year}</h3>
                                <p className="date-content">{date.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Vinery = observer(() => {
    const [nav, setNav] = useState(false);

    // Access Context stores
    const context = useContext(Context);
    if (!context) {
        throw new Error('Vinery must be used within Context Provider');
    }
    const { pageContent } = context;

    // Log data from stores
    useEffect(() => {
        const vineryPage = pageContent.pages.find(p => p.name === "Винодельня");
        console.log('=== VINERY PAGE DATA ===');
        console.log('Винодельня page data:', vineryPage);
        console.log('Loading state:', { pageContent: pageContent.isLoading });
    }, [pageContent.pages]);

    // Show loading if data is still being fetched
    if (pageContent.isLoading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="text-2xl text-gray-600">Загрузка...</div>
            </div>
        );
    }

    // Extract page data with fallbacks
    const vineryPage = pageContent.pages.find(p => p.name === "Винодельня");
    const vineryPageContent = typeof vineryPage?.content === 'object' ? vineryPage.content : {};
    
    const mainBackground = vineryPageContent.mainBackground || { image: '', title: 'Винодельня' };
    const introSection = vineryPageContent.introSection || { 
        title: '', 
        description: 'Откройте для себя мир превосходных вин в нашей винодельне!  Мы предлагаем уникальные и высококачественные сорта вин, созданные с любовью и вниманием к каждой детали. Посетите нашу винодельню и убедитесь в качестве наших вин самостоятельно. Здесь вы сможете насладиться изысканными напитками, отдохнуть и провести время в уютной атмосфере.',
        image: ThreeBottles,
        buttonText: 'Ассортимент вин',
        buttonLink: '/Shop'
    };
    const historySection = vineryPageContent.historySection || { 
        title: 'НАША ИСТОРИЯ',
        leftDates: [
            { year: '1960', description: 'Основание винодельни' },
            { year: '1966', description: 'Первый урожай' },
            { year: '1970', description: 'Выпуск первого вина' }
        ],
        rightDates: [
            { year: '1980', description: 'Расширение производства' },
            { year: '1999', description: 'Международное признание' },
            { year: '2000', description: 'Модернизация производства' }
        ]
    };
    const wineSection = vineryPageContent.wineSection || {
        firstText: 'У нас вы сможете попробовать как классические, так и эксклюзивные вина, созданные по уникальным рецептурам. Наши опытные сомелье помогут вам выбрать вино, которое идеально подойдёт именно для вашего случая.',
        secondText: 'Наш каталог включает более 100 наименований вин, среди которых вы обязательно найдете напиток по своему вкусу. Мы гордимся тем, что наши вина получают высокие оценки от экспертов и ценителей со всего мира.',
        buttonText: 'Наша винотека',
        buttonLink: '/Shop'
    };
    const productionSection = vineryPageContent.productionSection || {
        title: 'ЭТАПЫ НАШЕГО ПРОИЗВОДСТВА',
        stages: [
            { name: "Сбор винограда", image: Grape },
            { name: "Дробление Прессование", image: BottleProduce },
            { name: "Ферментация", image: WineBarrel },
            { name: "Выдержка", image: WineBarrel },
            { name: "Фильтрация", image: WineBarrel },
            { name: "Розлив Созревание", image: WineReservour }
        ]
    };
    const regionSection = vineryPageContent.regionSection || {
        title: 'ВИННЫЙ РЕГИОН',
        firstText: 'Краснодарский край — главный винодельческий регион России с разнообразными сортами винограда и высококачественными винами. Здесь выращивают Каберне Совиньон, Мерло, Шардоне и Ркацители.',
        secondText: 'Регион сочетает культуру, красоту природы и винодельческое искусство.',
        backgroundImage: GrapeLines
    };

    // Helper to get image/video URL
    const getImageUrl = (image: string | File) => {
        if (typeof image === 'string') {
            // Already absolute URL
            if (image.startsWith('http://') || image.startsWith('https://')) {
                console.log('🖼️ Vinery: Image URL (absolute):', image);
                return image;
            }
            // Local file in public folder (starts without /)
            if (!image.startsWith('/')) {
                console.log('🖼️ Vinery: Image URL (local):', image);
                return image;
            }
            // Relative path from backend (starts with /)
            const fullUrl = `${API_BASE}${image}`;
            console.log('🖼️ Vinery: Image URL (relative -> absolute):', fullUrl);
            return fullUrl;
        }
        console.warn('⚠️ Vinery: Image is not a string:', typeof image, image);
        return '';
    };

    // Prepare stages for CircularGallery format
    const preparedStages = productionSection.stages.map(stage => ({
        [stage.name]: getImageUrl(stage.image) || stage.image
    }));
    
    // Debug log для regionSection
    console.log('🍇 Vinery: regionSection.backgroundImage =', regionSection.backgroundImage);
    console.log('🍇 Vinery: getImageUrl(regionSection.backgroundImage) =', getImageUrl(regionSection.backgroundImage));

    return (
        <>
            <Navbar nav = {nav} setNav = {setNav}/>
        
            <main className="w-full h-max overflow-hidden bg-white font-body 3xl:max-w-screen-3xl 3xl:mx-auto">
                {/*  Intro */}
                <header className="flex flex-col relative w-screen h-screen">

                    <div 
                        className="relative header-background"
                        style={{ backgroundImage: `url(${getImageUrl(mainBackground.image) || './components/assets/VineryBackground.png'})` }}
                    >
                        <div className='header-page'>
                            <h1 className="text-[48px] leading-[58px] md:text-[88px] lg:text-[152px] md:leading-[105px] lg:leading-[183px]">
                                    {mainBackground.title}
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
                <section>
                    {/* Brick 1 Tablet&Computer*/}
                    <section className="hidden sm:grid grid-flow-row-dense grid-cols-5 mx-auto mt-8 w-[92%] xl:w-[85%] 2xl:max-w-screen-2xl 2xl:mx-auto">
                        <div className='z-10 col-span-2 flex flex-col'>
                            <p className='max-w-screen-lg text-left text-[#3E4756] pt-8 paragraph-content'>
                                {introSection.description}
                            </p>
                            
                            <button className="flex justify-start">
                                <div className='flex-col inline-block py-8 pr-8 bottom-3'>
                                    <Link to={'/Shop'}>
                                        <div className='flex flex-row'>
                                            <a className='text-[#3E4756] leading-[38px] mx-2 text-lg mobile:text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-semibold'>{introSection.buttonText}</a>
                                            <FaLongArrowAltRight className='w-[25px] h-[15px] xl:w-[30px] xl:h-[20px] 2xl:w-[35px] 2xl:h-[25px] left-[35px] my-auto'/>
                                        </div>
                                        <hr className="border-gray-400 w-full my-2" />
                                    </Link>
                                </div>
                            </button>
                        </div>
                        
                        <img 
                            src={getImageUrl(introSection.image) || ThreeBottles} 
                            alt="" 
                            className='size-[120%] mx-auto col-span-3 transform -translate-y-1/4 xl:size-[110%] 2xl:size-[100%] 2xl:max-w-[1000px] 2xl:object-contain'
                        />
                    </section>
                    {/* Brick 1 Tablet&Computer*/}

                    {/* Brick 1 Mobile*/}
                    <section className="mx-auto mt-12 w-[92%] sm:hidden">
                            <div className='z-10 col-span-2 flex flex-col'>
                                <p className='max-w-screen-lg font-normal text-[12px] leading-[24px] text-left text-[#3E4756]'>
                                {introSection.description}
                                </p>
                                
                                <button className="flex justify-start">
                                    <div className='flex-col inline-block py-8 pr-8 bottom-3'>
                                    <Link to={'/Shop'}>
                                        <div className='flex flex-row '>
                                            <a href="#" className='text-[#3E4756] text-[18px] leading-[22px] font-semibold mx-2'>{introSection.buttonText}</a>
                                            <FaLongArrowAltRight className='w-[25px] h-[15px] left-[35px] my-auto'/>
                                        </div>
                                        <hr className="border-gray-400 w-full my-2" />
                                    </Link>
                                    </div>
                                </button>
                            </div>
                            
                            <img src={getImageUrl(introSection.image) || ThreeBottles} alt="" className='size-[60%] mx-auto col-span-3 transform translate-x-1/3' style={{ "--tw-translate-y": "-35%" }}/>

                    </section>
                    {/* Brick 1 Mobile*/}

                    {/* Brick 1 Mobile Fix*/}

                </section>
                {/* Brick 1*/}

                {/* Brick 2*/}
                <section className="relative w-full overflow-visible pb-16 lg:py-32">
                    
                    <h1 className='section-header ml-4 sm:ml-8 lg:ml-12 xl:ml-16 2xl:ml-20'>{historySection.title}</h1>
                    
                    
                    <Timeline leftDates={historySection.leftDates} rightDates={historySection.rightDates} />
                </section>
                {/* Brick 2*/}


                {/* Brick 3*/}
                <section className='relative w-[92%] mx-auto xl:w-[85%] 2xl:mx-auto'>
                    <div className='hidden md:grid md:grid-flow-row-dense md:grid-cols-4'>
                        <p className='col-span-1 paragraph-content 2xl:my-auto'>
                            {wineSection.firstText}
                        </p>
                        <div className="col-span-2 relative flex justify-center items-center 2xl:scale-125">
                            <img 
                                src={BottleTransparent} 
                                className='mx-auto h-auto transform -translate-y-1/2 scale-110 xl:scale-125 2xl:scale-150'
                            />
                        </div>
                        <div className='col-span-1 2xl:my-auto'>
                            <Button text={wineSection.buttonText} on/>
                            <p className='paragraph-content'>
                                {wineSection.secondText}
                            </p>
                        </div>
                    </div>

                    <div className='w-[92%] mx-auto md:hidden'>
                        <p className='font-normal text-left text-[12px] leading-[24px] mb-2'>{wineSection.firstText}</p>
                        <img src={BottleTransparentHorizontal} className='mx-auto mb-2'/>
                        <p className='font-normal text-right text-[12px] leading-[24px]'>{wineSection.secondText}</p>
                        <div className='w-fit mx-auto'>
                            <Button text={wineSection.buttonText}/>
                        </div>
                        {/* <Button text="Наша винотека"/> */}

                    </div>
                    {/* <img src={BottleTransparent} className='mx-auto col-span-3 transform -translate-y-full'/> */}
                </section>
                {/* Brick 3*/}

                {/* Brick 4*/}
                <section className='overflow-visible mx-auto md:-mt-[30rem] lg:-mt-[25rem] xl:-mt-[15rem] 2xl:-mt-[5rem]'>
                    <div className='w-[92%] mx-auto'>
                        <h1 className='section-header mb-4 sm:mb-8'>{productionSection.title}</h1>
                    </div>

                    <div className='overflow-visible w-screen font-body h-[300px] sm:h-[400px] lg:h-[600px] xl:h-[700px]' style={{ position: 'relative' }}>
                        <CircularGallery 
                            bend={1} 
                            textColor="#3E4756" 
                            font="bold 30px Bitter" 
                            borderRadius={0.05} 
                            content={preparedStages}
                        />
                    </div>

                </section>
                {/* Brick 4*/}

                {/* Brick 5*/}
                <section className='w-[92%] mx-auto mt-8 '>

                    {/* Mobile*/}
                    <div className='sm:hidden'>
                        <h1 className='section-header ml-auto text-right sm:mb-8'>{regionSection.title}</h1>
                        <img src={GeografieMobile} className='overflow-hidden size-[115%] max-w-none' alt="" />
                        <p className='paragraph-content'>{regionSection.firstText}</p>
                        <p className='paragraph-content pt-4'>{regionSection.secondText}</p>
                    </div>
                    {/* Mobile*/}

                    {/*Tablet*/}
                    <div className='hidden sm:flex flex-row overflow-visible pb-5 lg:hidden relative'>
                        <div className='flex flex-col relative' style={{ width: 'calc(100% - 286px)' }}>
                            <div className='w-full pr-5'>
                                <p className='paragraph-content'>{regionSection.firstText}</p>
                                <p className='paragraph-content pt-4'>{regionSection.secondText}</p>
                            </div>
                            
                            <div className="relative overflow-visible" style={{ height: 'auto', position: 'relative' }}>
                                <img 
                                    src={GeografieTablet} 
                                    className='overflow-visible scale-125 max-w-none md:scale-150' 
                                    style={{ 
                                        position: 'relative',
                                        zIndex: 1 
                                    }} 
                                    alt="" 
                                />
                            </div>
                        </div>
                        
                        <div 
                            className="relative w-[286px] h-[354px] min-w-[286px] rounded-[8px] overflow-hidden"
                            style={{ zIndex: 2 }}
                        >
                            <img src={getImageUrl(regionSection.backgroundImage) || GrapeLines} className='object-cover rounded-[8px]' />
                            <div className="absolute inset-0 rounded-[8px] bg-gradient-to-t from-[#C4C4C4]/0 via-transparent to-black" />
                            <h1 className='section-header text-white absolute inset-0 p-4'>{regionSection.title}</h1>
                        </div>
                    </div>
                    {/*Tablet*/}

                    {/*Computer*/}
                    <div className='hidden lg:flex flex-row mb-20'>
                        <div className='flex flex-col relative' style={{ width: 'calc(100% - 286px)' }}>
                            <div className='w-full pr-5'>
                                <p className='paragraph-content'>{regionSection.firstText}</p>
                                <p className='paragraph-content pt-4'>{regionSection.secondText}</p>
                            </div>
                            
                            <div className="relative overflow-visible" style={{ height: 'auto', position: 'relative' }}>
                                <img 
                                    src={GeografieComputer} 
                                    className='overflow-visible scale-125 max-w-none xl:scale-150' 
                                    style={{ 
                                        position: 'relative',
                                        zIndex: 1 
                                    }} 
                                    alt="" 
                                />
                            </div>
                        </div>
                        
                        <div 
                            className="relative w-[696px] h-[682px] min-w-[696px] rounded-[8px] overflow-hidden"
                            style={{ zIndex: 2 }}
                        >
                            <img src={getImageUrl(regionSection.backgroundImage) || GrapeLines} className='object-cover rounded-[8px]' />
                            <div className="absolute inset-0 rounded-[8px] bg-gradient-to-t from-[#C4C4C4]/0 via-transparent to-black" />
                            <h1 className='section-header text-white absolute inset-0 p-4'>{regionSection.title}</h1>
                        </div>
                    </div>
                    {/*Computer*/}



                </section>

                {/* Brick 5*/}

                

            </main>

            

            <Footer />

        </>
     );
});
 
export default Vinery;