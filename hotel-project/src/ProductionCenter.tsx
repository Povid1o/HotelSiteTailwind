import React, {useCallback, useState, useEffect} from "react";
import { fetchProducts, Product } from './components/http/productAPI';
import { fetchVideos, Video } from './components/http/videoAPI';
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

// Для удобной работы с продуктами и услугами
// interface products {
//     id?: number,
//     name?: string,
//     description?: string,
//     image?: string,
// }
// const products: products[] = [
//     {
//         id: 1,
//         name: 'Название продукта1',
//         description: 'Описание продукта',
//         image: '/images/Wine_Background.png',
//     },
//     {
//         id: 2,
//         name: 'Название продукта2',
//         description: 'Описание продукта',
//         image: '/images/Wine_Background.png',
//     },
//     {
//         id: 3,
//         name: 'Название продукта3',
//         description: 'Описание продукта',
//         image: '/images/Wine_Background.png',
//     }
// ]

// Для более удобной работы с видео и картинками
interface ImagesVideos {
    title?:string;
    description?:string;
    spesialTitle?:string;
    spesialDesc?:string;
    imageStyle?:string;
    bgImg?:string;
    flexReverse?:boolean;
    specialStyle?:string;
    extraBlock ?:boolean;
    videoUrl?:string;
}

const images : ImagesVideos[] = [
    {
        title:"О ЧЕМ ЦЕНТР ПРОИЗВОДСТВА",
        description:'Не очень много текста. Может 2-3 предложения. С этим размером шрифта всё понятнее',
        spesialTitle:'text-[30px] sm:text-[45px] md:text-[50px] lg:text-[64px] font-bold',
        imageStyle:'sm:w-[50px] md:w-[100px] lg:w-[1000px]',
        specialStyle:'lg:h-[500px]',
        bgImg:'/images/VineryBackground.png',
    },
    {
        title:"НАША ФИЛОСОФИЯ",
        description:'Не очень много текста. Может 2-3 предложения. С этим размером шрифта всё понятнее',
        spesialTitle:'text-[30px] sm:text-[45px] md:text-[50px] lg:text-[64px] font-bold',
        imageStyle:'sm:w-[50px] md:w-[100px] lg:w-[1000px]',
        specialStyle:'lg:h-[500px]',
        bgImg:'/images/VineryBackground.png',
        flexReverse: true,
    }
]

// интерфейс для пропсов
interface ProductionCenterProps {
    title?: string,
    description?:string,
    position?: string,
}

export default function ProductionCenter({title}: ProductionCenterProps) {
    const [searchQuery, setSearchQuery] = useState('');
    // Состояние для текущей страницы пагинации
    const [currentPage, setCurrentPage] = useState(1);

    //Состояния продуктов и видео
    const [products, setProducts] = useState<Product[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingVideos, setLoadingVideos] = useState(false);


    useEffect(() => {
        const loadProducts = async () => {
            setLoadingProducts(true);
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (e) {
                console.error('Ошибка загрузки продуктов:', e);
            } finally {
                setLoadingProducts(false);
            }
        };

        const loadVideos = async () => {
            setLoadingVideos(true);
            try {
                const data = await fetchVideos();
                setVideos(data);
            } catch (e) {
                console.error('Ошибка загрузки видео:', e);
            } finally {
                setLoadingVideos(false);
            }
        };

        loadProducts();
        loadVideos();
    }, []);


    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Сбрасываем на первую страницу при изменении поиска
    }, []);
    return (
        <>
            <Navbar></Navbar>
            <main className="w-full h-max overflow-hidden bg-white font-body 3xl:max-w-screen-3xl 3xl:mx-auto">

                {/*Заголовок */}
                <header className="flex flex-col relative w-screen h-screen mb-20">
                    <div className="relative bg-[url('./components/assets/Wine_Bg_ProductionCenter.png')] header-background">
                        <div className='header-page'>
                            <h3 className='text-[25px] md:text-[35px] lg:text-[47px] font-medium'>Центр производства локальных продуктов</h3>
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
                        <div><h1 className='text-[20px] md:text-[40px] lg:text-[60px] lg:my-32 md:my-32 my-10 font-medium text-main_theme text-center slogan'>Мы пишем
                            красивые слоганы</h1></div>
                        <img src={VectorBranch}
                             alt="Декоративный вектор"
                        />
                    </div>
                </section>

                {/*О проекте*/}
                <section className='w-full flex flex-col justify-center items-center text-[#3E4756] gap-6 md:gap-10 lg:gap-10 p-2 md:p-20 lg:p-20 pb-10 lg:pb-52 md:pb-52 sm:pb-20'>
                    <h1 className="section-title my-6 md:my-24 lg:my-24">
                        О ПРОЕКТЕ
                    </h1>

                    {images.map((value) => (
                        <ProductionCard
                            imageStyle={value.imageStyle}
                            specialStyle={value.specialStyle}
                            bgImg={value.bgImg}
                            spesialTitle={value.spesialTitle}
                            title={value.title}
                            description={value.description}
                            flexReverse={value.flexReverse}
                        />)
                    )}

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
                        {videos.map((value) => (
                            <ProductionCard
                                title={value.title}
                                description={value.description}
                                spesialTitle={value.spesialTitle}
                                imageStyle={value.imageStyle}
                                specialStyle={value.specialStyle}
                                extraBlock={value.extraBlock}
                                videoUrl={value.videoUrl}
                            ></ProductionCard>
                        ))}
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
                        Продукты
                    </h1>
                    <Search
                        isMobile={false}
                        onSearch={handleSearch}
                        suggestionsList={products.map(p => p.name)}
                    />
                    <div className="flex justify-center gap-6 flex-wrap w-full items-center mt-4">
                        {products.map((value) => (
                            <WineCard
                                key={value.id}
                                header={value.name}
                                imgSrc={value.image}
                                to={`/Каталог/${value.id}`}
                                state={{value}}
                            ></WineCard>
                        ))}
                    </div>
                </section>

                {/*Где купить*/}
                <section className='bg-main_theme text-white w-full flex flex-col justify-center items-center gap-10 md:gap-20 lg:gap-40 p-5 md:p-20 lg:p-40 md:pb-60 lg:pb-60 relative'>
                    <h1 className="section-title z-[2]">
                        где купить
                    </h1>

                    <img src={VectorBranch}
                         alt="Декоративный вектор"
                         className='absolute z-[1] invisible md:visible lg:visible md:right-[-300px] md:top-[180px] lg:right-[-200px] lg:top-[150px] rotate-[45deg]'
                    />
                    <div className='w-full'>
                        <ul className='text-xl md:text-2xl lg:text-3xl font-light '>
                            <li className='z-[2] mb-10'><span className='font-bold '>Основной магазин на территории винодельни: </span>Адрес</li>
                            <li className='z-[2] mb-10'><span className='font-bold '>Партнерские точки продаж: </span>Адрес</li>
                            <li className='z-[2] mb-10'><span className='font-bold '>Возможность заказа/доставки: </span>Адрес</li>
                            <li className='z-[2] mb-10'><span className='font-bold '>Контактная информация для оптовых покупателей: </span>Адрес</li>
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
                        дополнительные услуги
                    </h1>
                    <div className="w-full flex justify-center gap-6 flex-wrap">
                        {products.map((value) => {
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