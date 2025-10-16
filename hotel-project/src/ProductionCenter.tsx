import React, {useCallback, useState} from "react";
import { Link } from 'react-router-dom';

import "./components/styles/hover.css"
import './components/styles/vinery.css'
import './components/styles/productionCenter.css'

// @ts-ignore
import Navbar from "./components/Navbar.tsx";
// @ts-ignore
import Footer from "./components/Footer.tsx";
// @ts-ignore
import ProductionCard from "./components/cards/ProductionCard.tsx";
// @ts-ignore
import ProductionDesc from "./components/cards/ProductionDesc.tsx";
// @ts-ignore
import Search from "./components/Search.tsx";
// @ts-ignore
import WineCard from "./components/cards/WineCard.tsx";


import VectorImage from "./components/assets/Vector1.png";
import VectorBranch from "./components/assets/VectorBranch.svg"
import VinogradTransparentBg from "./components/assets/VinogradTransparentBg.png"
import GrapePlant from './components/assets/GrapePlant.png'
import { productionSectionsEmergency, productionStoreEmergency, productionVideosEmergency } from './emergencyContent/text';

interface Store {
    id?: number,
    name?: string,
    description?: string,
    image?: string,
}
const store: Store[] = productionStoreEmergency;


interface ProductionCenterProps {
    title?: string,
    description?:string,
    position?: string,
}

export default function ProductionCenter({title}: ProductionCenterProps) {
    const [searchQuery, setSearchQuery] = useState('');
    // Состояние для текущей страницы пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const [nav, setNav] = useState(false);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Сбрасываем на первую страницу при изменении поиска
    }, []);
    return (
        <>
            <Navbar nav = {nav} setNav = {setNav}/>
            <main className="w-full h-max overflow-hidden bg-white font-body 3xl:max-w-screen-3xl 3xl:mx-auto">
                {/*Заголовок */}
                <header className="flex flex-col relative w-screen h-screen mb-20">
                    <div className="relative bg-[url('./components/assets/Wine_Bg_ProductionCenter.png')] header-background">
                        <div className='header-page'>
                            <h3 className='text-[25px] md:text-[35px] lg:text-[47px] font-medium'>{productionSectionsEmergency.headerTitle}</h3>
                            <h1 className="section-title font-bold">
                                {productionSectionsEmergency.headerSubtitle}
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
                        <div><h1 className='text-[20px] md:text[40px] lg:text-[60px] lg:my-32 md:my-32 my-10 font-medium text-main_theme text-center slogan'>{productionSectionsEmergency.slogan}</h1></div>
                        <img src={VectorBranch}
                             alt="Декоративный вектор"
                        />
                    </div>
                </section>

                {/*О проекте*/}
                <section className='w-full flex flex-col justify-center items-center text-[#3E4756] gap-6 md:gap-10 lg:gap-10 p-2 md:p-20 lg:p-20 pb-10 lg:pb-52 md:pb-52 sm:pb-20'>
                    <h1 className="section-title my-6 md:my-24 lg:my-24">
                        {productionSectionsEmergency.aboutTitle}
                    </h1>

                    <ProductionCard
                        imageStyle='sm:w-[50px] md:w-[100px] lg:w-[1000px]'
                        specialStyle={'lg:h-[500px]'}
                        bgImg={'/images/VineryBackground.png'}
                        spesialTitle={'text-[30px] sm:text-[45px] md:text-[50px] lg:text-[64px] font-bold'}
                        title={productionSectionsEmergency.about1Title}
                        description={productionSectionsEmergency.about1Desc}/>
                    <ProductionCard
                        imageStyle='sm:w-[50px] md:w-[100px] lg:w-[1000px]'
                        specialStyle={'lg:h-[500px]'}
                        bgImg={'/images/VineryBackground.png'}
                        flexReverse={true}
                        spesialTitle={'text-[30px] sm:text-[45px] md:text-[50px] lg:text-[64px] font-bold'}
                        spesialDesc={''}
                        title={productionSectionsEmergency.about2Title}
                        description={productionSectionsEmergency.about2Desc}/>

                </section>

                {/*Производство (видосы)*/}
                <section className='relative z-[0]'>

                    <div className='relative bg-main_theme flex flex-col w-full gap-20 '>
                        <div className='relative bg-white py-[5%]'>
                            <img
                                src={GrapePlant}
                                alt='ветка винограда'
                                className='z-[2] absolute top-0 right-0 w-5/6'
                            />
                            <img
                                src={VectorImage}
                                alt="Разделительный вектор"
                                className="absolute z-[1] bottom-0 w-screen left-1/2 transform"
                                style={{transform: 'translateX(-50%) translateY(45%)'}}
                            />
                        </div>
                        <div className='relative bg-main_theme flex flex-col w-full gap-20 py-10 md:py-20 lg:py-40 md:px-20 lg:px-20 px-2'>
                            <ProductionDesc position={''} title={'Преимущества свежих местных продуктов'} description={'Описание. 2-3 предложения'}></ProductionDesc>
                            <ProductionDesc position={'justify-end'} title={'Связь с основной деятельностью винодельни'} description={'Описание. 2-3 предложения'}></ProductionDesc>
                            <img src={VinogradTransparentBg}
                                 alt="гроздь винограда"
                                 className='z-[2] absolute bottom-[-20%] right-0 lg:left-0 w-2/5'
                            />
                        </div>

                    </div>
                    <div className='flex flex-col gap-10 py-40 px-5 md:px-20 lg:px-20 bg-[url("./components/assets/ProductionBg.png")] text-gray-700'>
                        <ProductionCard
                            spesialTitle={'text-[30px] sm:text-[45px] md:text-[50px] lg:text-[64px] font-bold'}
                            imageStyle={'w-[650px] rounded-xl flex items-center'}
                            specialStyle={'flex-wrap justify-center p-5'}
                            title={productionVideosEmergency[0].title}
                            extraBlock={true}
                            extraImage={productionVideosEmergency[0].src}
                            description={'Описание видео. 2-3 предложения'}
                        ></ProductionCard>
                        <ProductionCard
                            spesialTitle={'text-[30px] sm:text-[45px] md:text-[50px] lg:text-[64px] font-bold'}
                            imageStyle={'w-[650px] rounded-xl flex items-center'}
                            specialStyle={'flex-wrap justify-center p-5'}
                            title={productionVideosEmergency[1].title}
                            description={'Описание видео. 2-3 предложения'}
                            extraBlock={true}
                            extraImage={productionVideosEmergency[1].src}
                        ></ProductionCard>
                    </div>

                    <img
                            src={VectorImage}
                            alt="Разделительный вектор"
                            className="absolute z-[1] bottom-0 w-screen left-1/2 transform"
                            style={{transform: 'translateX(-50%) translateY(45%)'}}
                        />
                </section>

                {/*Продукты*/}
                <section className='w-full flex flex-col justify-center items-center text-[#3E4756] gap-10 p-5 md:p-20 lg:p-20'>
                    <h1 className="section-title text-[#3E4756]">
                        {productionSectionsEmergency.productsTitle}
                    </h1>
                    <Search
                        isMobile={false}
                        onSearch={handleSearch}
                        suggestionsList={store.map(p => p.name)}
                    />
                    <div className="flex justify-center gap-6 flex-wrap w-full items-center mt-4">
                        {store.map((value) => (
                            <WineCard
                                key={value.id}
                                header={value.name}
                                imgSrc={value.image}
                                to={`/Shop/${value.id}`}
                                state={{value}}
                            ></WineCard>
                        ))}
                    </div>
                </section>

                {/*Где купить*/}
                <section className='bg-main_theme text-white w-full flex flex-col justify-center items-center gap-10 md:gap-20 lg:gap-40 p-5 md:p-20 lg:p-40 md:pb-60 lg:pb-60 relative'>
                    <h1 className="section-title z-[2]">
                        {productionSectionsEmergency.whereToBuyTitle}
                    </h1>

                    <img src={VectorBranch}
                         alt="Декоративный вектор"
                         className='absolute z-[1] invisible md:visible lg:visible md:right-[-300px] md:top-[180px] lg:right-[-200px] lg:top-[150px] rotate-[45deg]'
                    />
                    <div className='w-full'>
                        <ul className='text-xl md:text-2xl lg:text-3xl font-light '>
                            {productionSectionsEmergency.addresses.map((line) => (
                                <li className='z-[2] mb-10' key={line}><span className='font-bold '>{line.split(':')[0]}: </span>{line.split(':')[1]?.trim()}</li>
                            ))}
                        </ul>
                    </div>
                    <img
                        src={VectorImage}
                        alt="Разделительный вектор"
                        className="absolute z-[1] bottom-0 w-screen left-1/2 transform"
                        style={{transform: 'translateX(-50%) translateY(45%)'}}
                    />
                </section>

                {/*Дополнительные услуги*/}
                <section className='relative text-[#3E4756] text-center w-full flex flex-col justify-center items-center gap-10 lg:px-20 lg:py-40 p-10 md:p-20 '>
                    <h1 className="text-[30px] sm:text-[48px] leading-[58px] text-center md:text-[70px] lg:text-[105px] md:leading-[105px] lg:leading-[183px] font-semibold uppercase z-[2]">
                        {productionSectionsEmergency.extraServicesTitle}
                    </h1>
                    <div className="w-full flex justify-center gap-6 flex-wrap">
                        {store.map((value) => {
                            return(
                                <div className='z-[2]'>
                                    <Link to='/Мероприятия'>
                                        <div className={` cursor-pointer w-80 h-80 bg-[url('./components/assets/ProductionBg.png')] flex items-end justify-start p-5  rounded-xl`}>
                                            <div className="text-2xl text-bold text-white">{value.name}</div>
                                        </div>
                                    </Link>
                                </div>

                            )
                        })}
                    </div>
                    <img src={VectorBranch}
                         alt="Декоративный вектор"
                         className='absolute z-[1] top-1/3  left-0 rotate-[-160deg]'
                    />
                    <img src={VectorBranch}
                         alt="Декоративный вектор"
                         className='absolute z-[1] bottom-0 right-0 rotate-[30deg]'
                    />
                </section>
            </main>
            <Footer></Footer>
        </>
    )
}