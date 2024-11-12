import React, {useEffect, useState} from 'react';
import Card from './cards/Card';
import ExtCard from './cards/ExtCard';
import ExtGaleryCard from './cards/ExtGalerycard';
import BlueSwiper from './sliders/BlueSwiper';
import HotelRoom from './cards/HotelRoom';
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

const standardRoomData = {
    title: "Номер Стандарт",
    description: "Аппартаменты расположены в 160 м. От моря, красивой набережной и открытыми пляжами. Разнообразие кофеин, ресторанов на любой вкус и бюджет. Велодорожка вдоль всей набережной, протяжённостью 12 км.",
    // Массив изображений может содержать как строки URL, так и объекты с src и alt
    images: [
      {
        src: "https://media.admagazine.ru/photos/61409580103eaf1470f8df16/16:9/w_2560%2Cc_limit/Room-9-St-Andrea-(1).jpg",
        alt: "Вид спальни"
      },
      {
        src: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/42/0e/53/sant-andrea-9.jpg?w=1200&h=-1&s=1",
        alt: "Вид ванной"
      },
      {
        src: "https://flowbite.com/docs/images/carousel/carousel-3.svg",
        alt: "Вид балкона"
      }
    ],
    prices: {
      night: "10000",
      week: "50000"
    },
    features: [
      "3 человека",
      "2 кровати",
      "2 спальни",
      "160 м до моря",
      "Свой мангал"
    ],
    amenities: [
      "Бассейн",
      "Автостоянка",
      "Wi-Fi",
      "Свой двор",
      "Спутник/кабель ТВ",
      "Холодильник",
      "Душ",
      "Сейф"
    ],
    checkInOut: {
      checkIn: "С 13:00",
      checkOut: "до 22:00",
      minStay: "С 14:00 до 22:00"
    },
    restrictions: [
      "18+",
      "Нельзя с животными",
      "Не больше указанного количества человек на дом"
    ]
  };


const standardPlusRoomData = {
  title: "Номер Стандарт+",
  description: "Аппартаменты расположены в 160 м. От моря, красивой набережной и открытыми пляжами. Разнообразие кофеин, ресторанов на любой вкус и бюджет. Велодорожка вдоль всей набережной, протяжённостью 12 км.",
  images: [
    {
      src: "https://media.admagazine.ru/photos/61409580103eaf1470f8df16/16:9/w_2560%2Cc_limit/Room-9-St-Andrea-(1).jpg",
      alt: "Вид спальни"
    },
    {
      src: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/42/0e/53/sant-andrea-9.jpg?w=1200&h=-1&s=1",
      alt: "Вид ванной"
    },
    {
      src: "https://flowbite.com/docs/images/carousel/carousel-3.svg",
      alt: "Вид балкона"
    }
  ],
  prices: {
    night: "20000",
    week: "100000"
  },
  features: [
    "3 человека",
    "2 кровати",
    "2 спальни",
    "160 м до моря",
    "Свой мангал"
  ],
  amenities: [
    "Бассейн",
    "Автостоянка",
    "Wi-Fi",
    "Свой двор",
    "Спутник/кабель ТВ",
    "Холодильник",
    "Душ",
    "Сейф"
  ],
  checkInOut: {
    checkIn: "С 13:00",
    checkOut: "до 22:00",
    minStay: "С 14:00 до 22:00"
  },
  restrictions: [
    "18+",
    "Нельзя с животными",
    "Не больше указанного количества человек на дом"
  ]
};


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
    // eslint-disable-next-line no-unused-vars
    const {height, width} = useWindowDimensions();
    // const [blur, setBlur] = useState(0);

    // const handleScroll = (entries) => {
    //   entries.forEach(entry => {
    //     // Если элемент полностью виден
    //     if (entry.isIntersecting) {
    //       setBlur(0);
    //     } else {
    //       // Если элемент не виден, вычисляем его видимость
    //       const rect = entry.boundingClientRect;
    //       const percentageVisible = Math.max(0, rect.bottom / window.innerHeight);
    //       const newBlur = Math.min(30, (1 - percentageVisible) * 30); // Максимальное размытие 30
    //       setBlur(newBlur);
    //     }
    //   });
    // };
  
    // useEffect(() => {
    //   const observer = new IntersectionObserver(handleScroll, {
    //     threshold: [0, 0.1, 0.9, 1], // Настройка порогов для отслеживания
    //   });
  
    //   const section = document.getElementById('welcome-section');
    //   if (section) {
    //     observer.observe(section);
    //   }
  
    //   return () => {
    //     if (section) {
    //       observer.unobserve(section);
    //     }
    //   };
    // }, []);

    setTimeout(() => {
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
      
        window.addEventListener('scroll', () => {
          hiddenElements.forEach((element) => observer.unobserve(element));
          hiddenElements.forEach((element) => observer.observe(element));
        });
      }, 150);

    return ( 
        <tbody name = 'home' className="w-full h-max bg-white">


            {/*  Intro */}
            <section 
              className=" bg-[url('../public/images/Wine_Background2_AI.png')] mainBackground-page "
              // style={{ filter: `blur(${blur}px)`, transition: 'filter 0.1s ease' }}
            >
                <div className="pic__masked"></div>
                <div className="max-w-[700px] h-screen mx-auto px-16 flex flex-col justify-center content-center text-center xl:max-w-[900px]">
                    <h1 className='header-page'>Добро пожаловать на Винные Террасы</h1>
                </div>
            </section>
            {/*  Intro */}

            {/* Brick */}
            


            {/* Brick 1 */}
            <section className='unShown'>
              <section className='mt-14 mx-auto justify-center flex flex-row xl:container'>

                  {/* Text Block */}
                  <div className='max-w-[700px] mx-auto bg-white rounded-xl drop-shadow-2xl max-sm:w-5/6 md:w-3/4 lg:max-w-[900px] xl:mx-8'>

                      <div className="w-full flex flex-col p-10 py-5 font-body md:flex-row">
                          <h1 className="header-section pr-16">Кто мы?</h1>
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
            <section className='section-format'>
                {/* <p className='text-4xl text-gray-700 font-bold pt-4 text-nowrap lg:text-5xl xl:text-6xl pt-8'>Номерной Фонд</p> */}
                <h2 className='header-section'>Номерной Фонд</h2>
                <div className='flex mobile:flex-col sm:flex-row xl:justify-center'>

                    <ExtCard
                    Card={() => <HotelRoom viewType="card" data={standardPlusRoomData} />}
                    ExtContent={() => <HotelRoom viewType="extended" data={standardPlusRoomData} />}
                    /> 

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
                    <h2 className='header-section'>Отель расположен в самой живописной локации Абрау</h2>
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
                <div className='section-format'>
                    <h1 className='header-section'>Посмотрите видео-презентацию</h1>
                    <VPlayer/>
                </div>
            </section>
            

            {/* Brick 3 */}
            <section className='unShown section-format'>

                <p className='header-section'>Ваш отдых - наша ответственность</p>

                <ul className='horizontal-list'>
                    <li>
                        <Box
                        imgAlt={"Трансфер"}
                        imgSrc={'https://kursk-kortezh.ru/admin/Data-Gallery/pictures/tuazev8six-uslugi-transfera-v-prage.jpg'}
                        >
                            <p className='horizontal-list-boxElement'>Трансфер</p>
                        </Box>
                    </li>
                    <li>
                        <Box
                        imgAlt={"Изысканная кухня"}
                        imgSrc={'https://media.istockphoto.com/id/500466008/ru/%D1%84%D0%BE%D1%82%D0%BE/%D0%B3%D0%BE%D0%B2%D1%8F%D0%B4%D0%B8%D0%BD%D1%8B-%D1%81%D1%82%D0%B5%D0%B9%D0%BA.jpg?s=612x612&w=0&k=20&c=RN33VmjFFu06kFNyM_8vRe_A5eDgKlV6u86t1FZnpSM='}
                        >
                            <p className='horizontal-list-boxElement'>Изысканная кухня</p>
                        </Box>
                    </li>
                    <li>
                        <Box
                        imgAlt={"Современный дизайн"}
                        imgSrc={'https://mykaleidoscope.ru/uploads/posts/2021-03/1616624585_56-p-dizain-modern-interera-58.jpg'}
                        >
                            <p className='horizontal-list-boxElement'>Современный дизайн</p>
                        </Box>
                    </li>
                    <li>
                        <Box
                        imgAlt={"Сервис"}
                        imgSrc={'https://habrastorage.org/webt/gt/pc/ia/gtpciaxhxff_iswdxx-qhwizuo8.jpeg'}
                        >
                            <p className='horizontal-list-boxElement'>Сервис</p>
                        </Box>
                    </li>
                    <li>
                        <Box
                        imgAlt={"Качественное вино"}
                        imgSrc={'https://forumsamogon.ru/wp-content/uploads/e/e/e/eeeb1c2d5d567758dbf6327fd1b0d490.jpg'}
                        >
                            <p className='horizontal-list-boxElement'>Качественное вино</p>
                        </Box>
                    </li>

                </ul>



            </section>

        </tbody>
     );
}

export default Home;
