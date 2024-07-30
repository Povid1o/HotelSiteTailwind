import React, { useEffect, useState } from 'react';
import Card from './cards/Card';
import ExtCard from './cards/ExtCard';
import ExtStandartPlus  from './ExtStandartplus';
import ExtStandart from  './ExtStandart';
import ExtGaleryCard from './cards/ExtGalerycard';
import BlueSwiper from './BlueSwiper';
// import ThSlider from './ThumbSlider';
import ExtHotelExample from './cards/ExtHotelExample';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './hover.css'
import useWindowDimensions from './WindowResizeListener';
import VPlayer from './VideoPlayer';
import './effects/appear.css';
import { entries } from 'mobx';



const StandartCard = () => {
    return(
        <Card
        imgAlt="Image alt text"
        imgSrc="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWxzfGVufDB8fDB8fHww"
        >
            <div className='flex flex-col mx-2 min-w-28 sm:mx-4 md:mx-6 lg:mx-8'>
                <h2 className="font-bold mb-2 text-center text-base sm:text-2xl">Номер Стандарт</h2>
                <p className="text-gray-700 mb-4 text-justify text-xs  sm:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.
                </p>
                <a href='#' className='underlineCard w-min text-nowrap mb-4 mx-2 text-left  font-body font-bold text-main_theme text-base sm:text-lg sm:mb-6 sm:mx-4'>От 10.000₽</a>
            </div>
                            
        </Card>

    )
}

const StandartPlusCard = () => {
    return(
        <Card
        imgAlt="Image alt text"
        imgSrc="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWxzfGVufDB8fDB8fHww"
        >
            <div className='flex flex-col mx-2 min-w-28 sm:mx-4 md:mx-6 lg:mx-8 '>
                <h2 className="font-bold mb-2 text-center text-base sm:text-2xl">Номер Стандарт+</h2>
                <p className="text-gray-700 mb-4 text-justify text-xs  sm:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.
                </p>
                <a href='#' className='underlineCard w-min text-nowrap mb-4 mx-2 text-left  font-body font-bold text-main_theme text-base sm:text-lg sm:mb-6 sm:mx-4'>От 20.000₽</a>
            </div>
                            
        </Card>

    )
}

const GaleryCard = () => {
    return(
        <Card className="bg-[#f0f0f08c] px-2">
            <h1 className='font-bold mb-2 text-center text-base sm:text-2xl'>Больше фото</h1>              
        </Card>

    )
}

const Box = ({ className,imgAlt, imgSrc, children }) => {

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

}



const Home = ({nav}) => {
    const {height, width} = useWindowDimensions();
    const [hotelState, setHotelState] = useState('unShown');

    setTimeout(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')){
              entry.target.classList.add('show');
              entry.target.classList.add('animated');
              if (entry.target.classList.contains('card')) {entry.target.classList.add('show-remove-blur');}
            //   observer.unobserve(entry.target);
            } 
            // else {
            //   entry.target.classList.remove('show');
            // }
          })
        });
      
        const hiddenElements = document.querySelectorAll('.unShown')
        hiddenElements.forEach((element) => observer.observe(element));
      
        window.addEventListener('scroll', () => {
          hiddenElements.forEach((element) => observer.unobserve(element));
          hiddenElements.forEach((element) => observer.observe(element));
        });
      }, 150);

    return ( 
        <div name = 'home' className="w-full h-max bg-white">


            {/*  Intro */}
            <div className=" bg-[url('../public/images/Wine_Background2_AI.png')] bg-no-repeat bg-cover bg-gray-300 bg-blend-multiply w-full h-screen rounded-xl">
                <div className="max-w-[700px] h-screen mx-auto px-16 flex flex-col justify-center content-center text-center xl:max-w-[900px]">
                    {/* <p className='text-5xl font-bold py-3 text-white relative backdrop-blur bg-grey/30 rounded-lg'>Добро пожаловать на Винные Террасссы</p> */}
                    <p className='text-3xl font-bold font-body py-3 relative text-white drop-shadow-2xl isolate md:text-5xl xl:text-7xl'>Добро пожаловать на Винные Террасссы</p>
                </div>
            </div>
            {/*  Intro */}

            {/* Brick */}
            


            {/* Brick 1 */}
            <section className='unShown'>
            <section className='mt-14 mx-auto justify-center flex flex-row xl:container'>

                {/* Text Block */}
                <div className='max-w-[700px] mx-auto bg-white rounded-xl drop-shadow-2xl max-sm:w-5/6 md:w-3/4 lg:max-w-[900px] xl:mx-8'>

                    <div className="w-full flex flex-col p-10 py-5 font-body md:flex-row">
                        <h1 className="font-bold text-4xl text-gray-700 bg-white pt-4 pr-4 lg:text-5xl xl:text-6xl pt-8 pr-16">Кто мы?</h1>
                        <p className="max-w-screen-lg font-light text-left text-gray-700 bg-white text-xs md:text-base lg:text-lg xl:text-2xl pt-8">
                            Отель-винодельня "Винные Террассы" - это уникальное место, сочетающее в себе шарм и гостеприимство с изысканными винами, произведенным нашими виноделами по собственному рецепту. Мы предлагаем гостям возможность насладиться роскошью и комфортом, а также окунуться в удивительный мир виноделия, попробовать уникальные сорта вин и узнать историю их создания.
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
            <section className='mt-14 mx-auto justify-center font-body max-sm:w-5/6 md:w-3/4 xl:container'>
                <p className='text-4xl text-gray-700 font-bold pt-4 text-nowrap lg:text-5xl xl:text-6xl pt-8'>Номерной Фонд</p>

                <div className='flex mobile:flex-col sm:flex-row xl:justify-center'>

                    <ExtCard
                    Card={StandartPlusCard}
                    ExtContent={ExtStandartPlus}
                    /> 

                    <ExtCard
                    Card={StandartCard}
                    ExtContent={ExtStandart}
                    /> 

                </div>
                

            </section>
            </section>
            {/* Brick 2 */}

            {/* Galery */}
            <section className='unShown card'>
                <div className="mx-auto px-2 mt-16 max-sm:w-5/6 md:w-3/4 lg:mt-24 xl:container">
                    <h2 className='text-4xl text-gray-700 font-bold pb-8 flex flex-wrap lg:text-5xl xl:text-6xl '>Отель расположен в самой живописной локации Абрау</h2>
                    <div className="-m-1 flex flex-wrap md:-m-2 ">
                        
                        <div className="flex w-1/3 flex-wrap">
                            <div className="w-full h-full p-1 md:p-2 ">
                                <img
                                alt=""
                                className="block  h-full w-full rounded-xl object-cover object-center max-h-[360px]  "
                                src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/42/0e/53/sant-andrea-9.jpg?w=1200&h=-1&s=1" />
                            </div>
                        </div>

                        <div className="flex w-2/3  flex-wrap ">
                            <div className="w-full h-full p-1 md:p-2">
                                <img
                                alt=""
                                className="block h-full w-full rounded-xl object-cover object-center max-h-[360px]"
                                src="https://flowbite.com/docs/images/carousel/carousel-1.svg" />
                            </div>
                        </div>
                                                
                        <div className=" h-full w-2/3  p-1 md:p-2 ">
                            <img
                            alt=""
                            className="block h-full w-full rounded-xl object-cover object-center max-h-[360px]"
                            src="https://media.admagazine.ru/photos/61409580103eaf1470f8df16/16:9/w_2560%2Cc_limit/Room-9-St-Andrea-(1).jpg" />
                        </div>
                        
                        <div className="flex w-1/3 flex-wrap">
                            <div className="w-full h-full p-1 md:p-2">
                                <img
                                alt=""
                                className="block h-full w-full rounded-xl object-cover object-center max-h-[360px]"
                                src="https://flowbite.com/docs/images/carousel/carousel-1.svg" />
                            </div>
                         </div>
                    </div>
                    <div className='flex mx-auto justify-center items-center w-64 h-22 rounded-xl'>
                        <ExtCard
                        Card={GaleryCard}
                        ExtContent={ExtGaleryCard}
                        /> 
                    </div>
                </div>
            </section>

            <section className='unShown card'>
                <div className='mx-auto mt-16 px-2 max-sm:w-5/6 md:w-3/4 lg:mt-24 xl:container'>
                    <h1 className=' text-4xl text-gray-700 font-bold pb-4 sm:pb-8 text-wrap lg:text-5xl xl:text-6xl'>Посмотрите видео-презентацию</h1>
                    <VPlayer/>
                </div>
            </section>
            

            {/* Brick 3 */}
            <section className='unShown mt-14 mx-8 mx-auto justify-center font-body max-sm:w-5/6 md:w-3/4 xl:container'>

                <p className='text-4xl text-gray-700 font-bold pt-4 lg:text-5xl xl:text-6xl pt-8'>Ваш отдых - наша ответственность</p>

                <ul className='flex flex-wrap flex-row'>
                    <li>
                        <Box
                        imgAlt={"Трансфер"}
                        imgSrc={'https://kursk-kortezh.ru/admin/Data-Gallery/pictures/tuazev8six-uslugi-transfera-v-prage.jpg'}
                        >
                            <p className='mx-10 my-auto text-lg mobile:text-xl md:text-2xl font-semibold'>Трансфер</p>
                        </Box>
                    </li>
                    <li>
                        <Box
                        imgAlt={"Изысканная кухня"}
                        imgSrc={'https://media.istockphoto.com/id/500466008/ru/%D1%84%D0%BE%D1%82%D0%BE/%D0%B3%D0%BE%D0%B2%D1%8F%D0%B4%D0%B8%D0%BD%D1%8B-%D1%81%D1%82%D0%B5%D0%B9%D0%BA.jpg?s=612x612&w=0&k=20&c=RN33VmjFFu06kFNyM_8vRe_A5eDgKlV6u86t1FZnpSM='}
                        >
                            <p className='mx-10 my-auto text-lg mobile:text-xl md:text-2xl font-semibold'>Изысканная кухня</p>
                        </Box>
                    </li>
                    <li>
                        <Box
                        imgAlt={"Современный дизайн"}
                        imgSrc={'https://mykaleidoscope.ru/uploads/posts/2021-03/1616624585_56-p-dizain-modern-interera-58.jpg'}
                        >
                            <p className='mx-10 my-auto text-lg mobile:text-xl md:text-2xl font-semibold'>Современный дизайн</p>
                        </Box>
                    </li>
                    <li>
                        <Box
                        imgAlt={"Сервис"}
                        imgSrc={'https://habrastorage.org/webt/gt/pc/ia/gtpciaxhxff_iswdxx-qhwizuo8.jpeg'}
                        >
                            <p className='mx-10 my-auto text-lg mobile:text-xl md:text-2xl font-semibold'>Сервис</p>
                        </Box>
                    </li>
                    <li>
                        <Box
                        imgAlt={"Качественное вино"}
                        imgSrc={'https://forumsamogon.ru/wp-content/uploads/e/e/e/eeeb1c2d5d567758dbf6327fd1b0d490.jpg'}
                        >
                            <p className='mx-10 my-auto text-lg mobile:text-xl md:text-2xl font-semibold'>Качественное вино</p>
                        </Box>
                    </li>

                </ul>



            </section>

        </div>
     );
}

export default Home;
