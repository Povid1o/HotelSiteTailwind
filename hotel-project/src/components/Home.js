import React from 'react';
import { Carousel } from 'flowbite-react';
import { Card } from 'flowbite-react';


const Home = ({nav}) => {
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


            {/* Brick 1 */}
            {/* <div className='w-3/4 max-w-[700px] bg-white rounded-xl drop-shadow-2xl mx-auto mt-5'>
                <div className="w-full flex flex-row items-center justify-center p-10 py-5 font-body md:flex-col">
                    <h1 className="font-bold text-4xl text-gray-700 bg-white p-4">Кто мы?</h1>
                    <p className="max-w-screen-lg font-light text-base text-left text-gray-700 bg-white p-4 pl-20">
                        Отель-винодельня "Винные Террассы" - это уникальное место, сочетающее в себе шарм и гостеприимство с изысканными винами, произведенным нашими виноделами по собственному рецепту. Мы предлагаем гостям возможность насладиться роскошью и комфортом, а также окунуться в удивительный мир виноделия, попробовать уникальные сорта вин и узнать историю их создания.
                    </p>
                </div> */}

                {/*  Images Carousel */}
                {/* <div className= " relative h-56 w-3/4 ml-auto mr-auto pb-5 z-0 sm:h-64 xl:h-80 2xl:h-96">
                    <Carousel pauseOnHover>
                        <img src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="..." />
                        <img src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="..." />
                        <img src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
                        <img src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
                        <img src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
                    </Carousel>
                </div>
            </div> */}
            {/* Brick 1 */}


            {/* Brick 1 */}
            <div className='w-3/4 max-w-[700px] bg-white rounded-xl drop-shadow-2xl mx-auto mt-14 lg:max-w-[900px]'>
                <div className="w-full flex flex-col p-10 py-5 font-body md:flex-row">
                    <h1 className="font-bold text-4xl text-gray-700 bg-white pt-4 pr-4 lg:text-5xl xl:text-6xl pt-8 pr-16">Кто мы?</h1>
                    <p className="max-w-screen-lg font-light text-left text-gray-700 bg-white p-4 text-xs md:text-base lg:text-lg xl:text-2xl pt-8">
                        Отель-винодельня "Винные Террассы" - это уникальное место, сочетающее в себе шарм и гостеприимство с изысканными винами, произведенным нашими виноделами по собственному рецепту. Мы предлагаем гостям возможность насладиться роскошью и комфортом, а также окунуться в удивительный мир виноделия, попробовать уникальные сорта вин и узнать историю их создания.
                    </p>
                </div>
            </div>

            {/*  Images Carousel */}
            <div className= " relative h-56 w-3/4 max-w-[700px] ml-auto mr-auto mt-5 z-0 sm:h-80 lg:max-w-[900px] xl:h-96 2xl:h-112">
                <Carousel pauseOnHover>
                    <img src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="..." />
                    <img src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="..." />
                    <img src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
                    <img src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
                    <img src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
                </Carousel>
            </div>
            {/* Brick 1 */}

            


            {/* Brick 3 */}
            <div className='w-3/4 max-w-[700px] mt-14 ml-auto mr-auto font-body' >
                <div className='w-full flex flex-row items-center'>
                    <p className='text-4xl text-gray-700 font-bold'>Номерной Фонд</p>
                </div>
                
                <Card
                    className="max-w-sm mt-5"
                    imgAlt="Meaningful alt text for an image that is not purely decorative"
                    imgSrc="https://flowbite.com/docs/images/carousel/carousel-1.svg"
                >
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Noteworthy technology acquisitions 2021
                    </h5>
                    <p className="font-light text-gray-700 dark:text-gray-400">
                        Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
                    </p>
                </Card>

                
                


            </div>
            {/* Brick 2 */}
            
                










        </div>
     );
}
 
export default Home;
