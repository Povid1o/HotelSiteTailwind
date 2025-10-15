import React, {useEffect, useState, memo} from 'react';
import Card from './cards/Card';
import ExtCard from './cards/ExtCard';
import ExtGaleryCard from './cards/ExtGalerycard';
import BlueSwiper from './sliders/BlueSwiper';
import HotelRoom from './cards/HotelRoom';
import TravelLineSearchForm from './TravelLineSearchForm';
import TravelLineScript from "./TravelLineScript.tsx";
// import ThSlider from './sliders/ThumbSlider';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles/hover.css'
import useWindowDimensions from './WindowResizeListener';
import VPlayer from './VideoPlayer';
import './styles/appear.css';
import './styles/base.css';
// import { entries } from 'mobx';

import { standardRoomEmergency, standardPlusRoomEmergency, homeSectionsEmergency, homeServicesEmergency, homeGalleryEmergency } from '../emergencyContent/text';
import { getContentOrEmergency } from '../utils/contentHelpers';

// Removed hardcoded standardRoomData and standardPlusRoomData; use emergency fallback instead
const standardRoomData = getContentOrEmergency(null, standardRoomEmergency);
const standardPlusRoomData = getContentOrEmergency(null, standardPlusRoomEmergency);
const gallery = homeGalleryEmergency;

const GaleryCard = () => {
    return(
        <Card className="bg-[#f0f0f08c] px-2">
            <h1 className='font-bold mb-2 text-center text-base sm:text-2xl'>Больше фото</h1>
        </Card>

    )
}

type BoxProps = { className?: string; imgAlt?: string; imgSrc?: string; children?: React.ReactNode };
const Box = memo(({ className, imgAlt, imgSrc, children }: BoxProps) => {
    const boxClass = `
  ${className}
  items-start
  flex flex-row
  rounded-lg
  shadow-xl
  my-2
  p-4`;

    const imgClasses = `
  w-20 h-20
  rounded-full`;

    return(
        <div className={boxClass}>
            {imgSrc && (
                <img
                    className={imgClasses}
                    src={imgSrc}
                    alt={imgAlt}
                />
            )}
            {children}
        </div>
    )
});



const Home = ({nav}) => {
    // eslint-disable-next-line no-unused-vars
    const {height, width} = useWindowDimensions();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !entry.target.classList.contains('animated')){
                        entry.target.classList.add('show');
                        entry.target.classList.add('animated');
                        if (entry.target.classList.contains('card')) {entry.target.classList.add('show-remove-blur');}
                    }
                })
            });

            const hiddenElements = document.querySelectorAll('.unShown')
            hiddenElements.forEach((element) => observer.observe(element));

            const scrollHandler = () => {
                hiddenElements.forEach((element) => observer.unobserve(element));
                hiddenElements.forEach((element) => observer.observe(element));
            };

            window.addEventListener('scroll', scrollHandler);

            // Очистка при размонтировании компонента
            return () => {
                clearTimeout(timeoutId);
                window.removeEventListener('scroll', scrollHandler);
                observer.disconnect();
            };
        }, 150);
    }, []);


    return (
        <div className="w-full h-max bg-white">
            <TravelLineScript />


            {/*  Intro */}
            <section
                className=" bg-[url('../public/images/Wine_Background2_AI.png')] mainBackground-page "
            >
                <div className="max-w-[700px] h-screen mx-auto px-16 flex flex-col justify-center content-center text-center xl:max-w-[900px]">
                    <h1 className='header-page'>{homeSectionsEmergency.introHeader}</h1>
                </div>

                <div className="absolute hidden bottom-10 left-1/2 transform -translate-x-1/2 w-3/4 max-w-4xl lg:flex">
                  <TravelLineSearchForm id={'main'} />
                </div>

                {/* {width > 768 ? (
                    <div className="absolute hidden bottom-10 left-1/2 transform -translate-x-1/2 w-3/4 max-w-4xl md:flex">
                        <TravelLineSearchForm id={'main'} />
                    </div>
                ) : 
                (
                    <div className="mt-4 w-full px-4">  // Отдельная секция снизу
                        <TravelLineSearchForm id={'second'} />
                    </div>
                )
                } */}
            </section>
            {/*  Intro */}

            {/* Brick */}
            {/* <TravelLineSearchForm id={'third'} /> */}

            <section className='my-8 bg-white rounded-xl drop-shadow-2xl unShown max-sm:w-5/6 md:w-3/4 md:px-0 mx-auto justify-center lg:hidden'>
              <TravelLineSearchForm id={'second'} />
            </section>



            {/* Brick 1 */}
            <section className='unShown'>
                <section className='mt-14 mx-auto justify-center flex flex-row xl:container'>

                    {/* Text Block */}
                    <div className='max-w-[700px] mx-auto bg-white rounded-xl drop-shadow-2xl max-sm:w-5/6 md:w-3/4 lg:max-w-[900px] xl:mx-8'>

                        <div className="w-full flex flex-col p-10 py-5 font-body md:flex-row">
                            <h1 className="header-section pr-16">{homeSectionsEmergency.whoWeAreHeader}</h1>
                            <p className="max-w-screen-lg font-light text-left text-gray-700 bg-white text-xs md:text-base lg:text-lg xl:text-2xl pt-8">
                                {homeSectionsEmergency.whoWeAreText}
                            </p>
                        </div>

                    </div>
                    {/* Text Block */}

                    <img src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="" className='hidden xl:flex max-h-[400px] rounded-xl'/>

                </section>

                <section className='mt-8 mx-auto justify-center flex flex-row xl:container'>

                    <div className='hidden xl:flex max-w-[900px] mx-8 rounded-xl max-sm:w-5/6 md:w-3/4'>
                        <img src="https://media.admagazine.ru/photos/61409580103eaf1470f8df16/16:9/w_2560%2Cc_limit/Room-9-St-Andrea-(1).jpg" alt="" className='object-cover rounded-xl'/>

                    </div>

                    <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/42/0e/53/sant-andrea-9.jpg?w=1200&h=-1&s=1" alt="" className='hidden xl:flex max-h-[600px] rounded-xl'/>


                </section>
            </section>
            {/* Brick 1 */}


            {/* Blue Swiper */}
            <section className="mx-auto unShown max-sm:w-5/6 md:w-3/4 xl:hidden show">
                <BlueSwiper />
            </section>


            {/* Brick 1 */}




            {/* Brick 2 */}
            <section className='unShown card'>
                <section className='section-format'>
                    {/* <p className='text-4xl text-gray-700 font-bold pt-4 text-nowrap lg:text-5xl xl:text-6xl pt-8'>Номерной Фонд</p> */}
                    <h2 className='header-section'>{homeSectionsEmergency.fundHeader}</h2>
                    <div className='flex mobile:flex-col sm:flex-row xl:justify-center'>
                        <div className='mb-4 sm:mb-0'>
                            <ExtCard
                                Card={() => <HotelRoom viewType="card" data={standardPlusRoomData} />}
                                ExtContent={() => <HotelRoom viewType="extended" data={standardPlusRoomData} />}
                            />
                        </div>


                        <ExtCard
                            Card={() => <HotelRoom viewType="card" data={standardRoomData} />}
                            ExtContent={() => <HotelRoom viewType="extended" data={standardRoomData} />}
                        />

                    </div>


                </section>
            </section>
            {/* Brick 2 */}

            {/* Galery */}
            <section className='unShown card'>
                {/* <div className="mx-auto px-2 mt-14 max-sm:w-5/6 md:w-3/4 lg:mt-24 xl:container"> */}
                <div className="section-format">
                    {/* <h2 className='text-4xl text-gray-700 font-bold pb-8 flex flex-wrap lg:text-5xl xl:text-6xl '>Отель расположен в самой живописной локации Абрау</h2> */}
                    <h2 className='header-section'>{homeSectionsEmergency.galleryHeader}</h2>
                    <div className="-m-1 flex flex-wrap md:-m-2 ">

                        <div className="flex w-1/3 flex-wrap">
                            <div className="w-full h-full p-1 md:p-2 ">
                                <img
                                    alt=""
                                    className="block  h-full w-full rounded-xl object-cover object-center max-h-[360px]  "
                                    src={gallery[0]?.src} />
                            </div>
                        </div>

                        <div className="flex w-2/3  flex-wrap ">
                            <div className="w-full h-full p-1 md:p-2">
                                <img
                                    alt=""
                                    className="block h-full w-full rounded-xl object-cover object-center max-h-[360px]"
                                    src={gallery[1]?.src} />
                            </div>
                        </div>

                        <div className=" h-full w-2/3  p-1 md:p-2 ">
                            <img
                                alt=""
                                className="block h-full w-full rounded-xl object-cover object-center max-h-[360px]"
                                src={gallery[2]?.src} />
                        </div>

                        <div className="flex w-1/3 flex-wrap">
                            <div className="w-full h-full p-1 md:p-2">
                                <img
                                    alt=""
                                    className="block h-full w-full rounded-xl object-cover object-center max-h-[360px]"
                                    src={gallery[3]?.src} />
                            </div>
                        </div>
                    </div>
                    <div className='flex mx-auto justify-center items-center w-64 h-22 rounded-xl mt-4'>
                        <ExtCard
                            Card={GaleryCard}
                            ExtContent={ExtGaleryCard}
                        />
                    </div>
                </div>
            </section>

            <section className='unShown card'>
                <div className='section-format'>
                    <h1 className='header-section'>{homeSectionsEmergency.videoHeader}</h1>
                    <VPlayer sourceUrl={"https://youtu.be/LOHDnKI1U8A?si=42WUOqixTglw4kl1"}/>
                </div>
            </section>


            {/* Brick 3 */}
            <section className='unShown section-format'>

                <p className='header-section'>{homeSectionsEmergency.responsibilityHeader}</p>

                <ul className='horizontal-list'>
                    {homeServicesEmergency.map((s) => (
                        <li key={s.name}>
                            <Box
                                imgAlt={s.name}
                                imgSrc={s.image}
                            >
                                <p className='horizontal-list-boxElement'>{s.name}</p>
                            </Box>
                        </li>
                    ))}

                </ul>



            </section>

        </div>
    );
}

export default Home;
