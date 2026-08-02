import React, {useEffect, useState, memo, useContext} from 'react';
import Card from './cards/Card';
import ExtCard from './cards/ExtCard';
import ThSlider from './sliders/ThumbSlider';
import BlueSwiper from './sliders/BlueSwiper';
import HotelRoom from './cards/HotelRoom';
import TravelLineSearchForm from './TravelLineSearchForm';
import TravelLineScript from "./TravelLineScript.tsx";
import { Context } from '../index';
import { observer } from 'mobx-react-lite';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles/hover.css'
import useWindowDimensions from './WindowResizeListener';
import VPlayer from './VideoPlayer';
import sampleVideo from '../emergencyContent/videos/HotelPageVideos/sample-5s.mp4';
import './styles/appear.css';
import './styles/base.css';
// import { entries } from 'mobx';

import { standardRoomEmergency, standardPlusRoomEmergency, homeSectionsEmergency, homeServicesEmergency, homeGalleryEmergency } from '../emergencyContent/text';
import { getContentOrEmergency, getMediaUrl } from '../utils/contentHelpers';
import { API_BASE, STATIC_BASE } from './http';

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



interface HomeProps {
    nav?: boolean;
}

const Home = observer(({nav}: HomeProps) => {
    // eslint-disable-next-line no-unused-vars
    const {height, width} = useWindowDimensions();

    // Access Context stores
    const context = useContext(Context);
    if (!context) {
        throw new Error('Home must be used within Context Provider');
    }
    const { pageContent, hotel } = context;

    // ✅ ДОБАВЬТЕ: Фиксируем данные при первой загрузке
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);
    const [fixedRooms, setFixedRooms] = useState<any[]>([]);

    // Log data from stores
    useEffect(() => {
        const homePage = pageContent.pages.find(p => p.name === "Главная");
        console.log('=== HOME PAGE DATA ===');
        console.log('Главная page data:', homePage);
        console.log('All rooms:', hotel.rooms);
        console.log('Loading state:', { 
            pageContent: pageContent.isLoading, 
            hotel: hotel.isLoading 
        });
    }, [pageContent.pages, hotel.rooms]);

    // ✅ Фиксируем данные номеров при первой загрузке
    useEffect(() => {
        if (!initialDataLoaded && !pageContent.isLoading && !hotel.isLoading) {
            // Фиксируем данные номеров
            if (hotel.rooms.length > 0) {
                setFixedRooms(hotel.rooms);
            } else {
                // Используем emergency данные
                setFixedRooms([
                    getContentOrEmergency(null, standardRoomEmergency),
                    getContentOrEmergency(null, standardPlusRoomEmergency)
                ]);
            }
            setInitialDataLoaded(true);
        }
    }, [pageContent.isLoading, hotel.isLoading, hotel.rooms, initialDataLoaded]);

    // Show loading only on first load
    if ((pageContent.isLoading || hotel.isLoading) && !initialDataLoaded) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="text-2xl text-gray-600">Загрузка...</div>
            </div>
        );
    }

    // Extract page data with fallbacks
    const homePage = pageContent.pages.find(p => p.name === "Главная");
    const homePageContent = typeof homePage?.content === 'object' ? homePage.content : {};
    
    const mainBackground = homePageContent.mainBackground || { image: '', title: homeSectionsEmergency.introHeader };
    const aboutSection = homePageContent.aboutSection || { title: homeSectionsEmergency.whoWeAreHeader, description: homeSectionsEmergency.whoWeAreText };
    const firstGallery = homePageContent.firstGallery || { title: homeSectionsEmergency.fundHeader, images: [] };
    const secondGallery = homePageContent.secondGallery || { title: homeSectionsEmergency.galleryHeader, images: homeGalleryEmergency };
    const videoSection = homePageContent.videoSection || { title: homeSectionsEmergency.videoHeader, videoUrl: sampleVideo };
    const servicesSection = homePageContent.servicesSection || { title: homeSectionsEmergency.responsibilityHeader, services: homeServicesEmergency };

    // Helper to get image/video URL
    const getImageUrl = (image: string | File) => {
        if (image instanceof File) {
            return URL.createObjectURL(image);
        }
        if (typeof image === 'string') {
            // Already absolute URL
            if (image.startsWith('http://') || image.startsWith('https://')) {
                return image;
            }
            // Local file in public folder (starts without /)
            if (!image.startsWith('/')) {
                return image;
            }
            // Relative path from backend (starts with /)
            return `${API_BASE}${image}`;
        }
        return '';
    };

    // Helper to transform HotelRoom to HotelRoomData format
    const transformRoomData = (room: any) => {
        if (!room) return null;
        
        // If it's already in the correct format (emergency data), return as is
        if (room.title && room.images && Array.isArray(room.images) && room.images[0]?.src) {
            return room;
        }

        // Transform from HotelStorage format to HotelRoomData format
        return {
            id: room.id,
            title: room.name,
            description: room.description,
            prices: room.price?.[0] ? { night: parseFloat(room.price[0].price) } : {},
            features: room.properties || [],
            amenities: room.conviniences || [],
            rules: room.notes || [],
            checkInOut: {
                checkIn: room.checkStandart?.checkIn,
                checkOut: room.checkStandart?.checkOut,
            },
            restrictions: [],
            images: room.images?.map((img: string | File) => 
                typeof img === 'string' ? { src: getImageUrl(img), alt: '' } : { src: '', alt: '' }
            ) || [],
        };
    };

    // Extract rooms data with fallbacks
    const rooms = fixedRooms.length > 0 ? fixedRooms : [
        getContentOrEmergency(null, standardRoomEmergency),
        getContentOrEmergency(null, standardPlusRoomEmergency)
    ];
    const standardPlusRoomData = transformRoomData(rooms[0]) || getContentOrEmergency(null, standardPlusRoomEmergency);
    const standardRoomData = transformRoomData(rooms[1]) || getContentOrEmergency(null, standardRoomEmergency);

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
                className="mainBackground-page"
                style={{ backgroundImage: `url(${getImageUrl(mainBackground.image) || '../public/images/Wine_Background2_AI.png'})` }}
            >
                <div className="max-w-[700px] h-screen mx-auto px-16 flex flex-col justify-center content-center text-center xl:max-w-[900px]">
                    <h1 className='header-page'>{mainBackground.title}</h1>
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
                            <h1 className="header-section pr-16">{aboutSection.title}</h1>
                            <p className="max-w-screen-lg font-light text-left text-gray-700 bg-white text-xs md:text-base lg:text-lg xl:text-2xl pt-8">
                                {aboutSection.description}
                            </p>
                        </div>

                    </div>
                    {/* Text Block */}

                    {firstGallery.images[0] && (
                        <img src={getImageUrl(firstGallery.images[0].src)} alt={firstGallery.images[0].alt || ""} className='hidden xl:flex max-h-[400px] rounded-xl'/>
                    )}

                </section>

                <section className='mt-8 mx-auto justify-center flex flex-row xl:container'>

                    <div className='hidden xl:flex max-w-[900px] mx-8 rounded-xl max-sm:w-5/6 md:w-3/4'>
                        {firstGallery.images[1] && (
                            <img src={getImageUrl(firstGallery.images[1].src)} alt={firstGallery.images[1].alt || ""} className='object-cover rounded-xl'/>
                        )}
                    </div>

                    {firstGallery.images[2] && (
                        <img src={getImageUrl(firstGallery.images[2].src)} alt={firstGallery.images[2].alt || ""} className='hidden xl:flex max-h-[600px] rounded-xl'/>
                    )}

                </section>
            </section>
            {/* Brick 1 */}


            {/* Blue Swiper */}
            <section className="mx-auto unShown max-sm:w-5/6 md:w-3/4 xl:hidden show">
                <BlueSwiper 
                    images={firstGallery.images.map(img => ({
                        src: getImageUrl(img.src),
                        alt: img.alt || ''
                    }))}
                />
            </section>


            {/* Brick 1 */}




            {/* Brick 2 */}
            <section className='unShown card'>
                <section className='section-format'>
                    {/* <p className='text-4xl text-gray-700 font-bold pt-4 text-nowrap lg:text-5xl xl:text-6xl pt-8'>Номерной Фонд</p> */}
                    <h2 className='header-section'>{firstGallery.title}</h2>
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
                    <h2 className='header-section'>{secondGallery.title}</h2>
                    <div className="-m-1 flex flex-wrap md:-m-2 ">

                        <div className="flex w-1/3 flex-wrap">
                            <div className="w-full h-full p-1 md:p-2 ">
                                {secondGallery.images[0] && (
                                    <img
                                        alt={secondGallery.images[0].alt || ""}
                                        className="block  h-full w-full rounded-xl object-cover object-center max-h-[360px]  "
                                        src={getImageUrl(secondGallery.images[0].src)} />
                                )}
                            </div>
                        </div>

                        <div className="flex w-2/3  flex-wrap ">
                            <div className="w-full h-full p-1 md:p-2">
                                {secondGallery.images[1] && (
                                    <img
                                        alt={secondGallery.images[1].alt || ""}
                                        className="block h-full w-full rounded-xl object-cover object-center max-h-[360px]"
                                        src={getImageUrl(secondGallery.images[1].src)} />
                                )}
                            </div>
                        </div>

                        <div className=" h-full w-2/3  p-1 md:p-2 ">
                            {secondGallery.images[2] && (
                                <img
                                    alt={secondGallery.images[2].alt || ""}
                                    className="block h-full w-full rounded-xl object-cover object-center max-h-[360px]"
                                    src={getImageUrl(secondGallery.images[2].src)} />
                            )}
                        </div>

                        <div className="flex w-1/3 flex-wrap">
                            <div className="w-full h-full p-1 md:p-2">
                                {secondGallery.images[3] && (
                                    <img
                                        alt={secondGallery.images[3].alt || ""}
                                        className="block h-full w-full rounded-xl object-cover object-center max-h-[360px]"
                                        src={getImageUrl(secondGallery.images[3].src)} />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='flex mx-auto justify-center items-center w-64 h-22 rounded-xl mt-4'>
                        <ExtCard
                            Card={GaleryCard}
                            ExtContent={() => (
                                <ThSlider 
                                    images={secondGallery.images.map(img => ({
                                        src: getImageUrl(img.src),
                                        alt: img.alt || ''
                                    }))}
                                />
                            )}
                        />
                    </div>
                </div>
            </section>

            <section className='unShown card'>
                <div className='section-format'>
                    <h1 className='header-section'>{videoSection.title}</h1>
                    <VPlayer sourceUrl={(() => {
                        const url = getMediaUrl(videoSection.videoUrl) || sampleVideo;
                        console.log('🎥 Home: videoSection.videoUrl:', videoSection.videoUrl);
                        console.log('🎥 Home: getMediaUrl result:', url);
                        return url;
                    })()}/>
                </div>
            </section>


            {/* Brick 3 */}
            <section className='unShown section-format'>

                <p className='header-section'>{servicesSection.title}</p>

                <ul className='horizontal-list'>
                    {servicesSection.services.map((s, index) => (
                        <li key={s.name || index}>
                            <Box
                                imgAlt={s.name}
                                imgSrc={getImageUrl(s.image)}
                            >
                                <p className='horizontal-list-boxElement'>{s.name}</p>
                            </Box>
                        </li>
                    ))}

                </ul>



            </section>

        </div>
    );
});

export default Home;
