import React, { useState } from 'react';
import Card from '../cards/Card';
import ExtCard from '../cards/ExtCard';
import ExtGaleryCard from '../cards/ExtGalerycard';
import BlueSwiper from '../sliders/BlueSwiper';
import PhotoSelector from '../text_inputs/PhotoSelector';
import ImageWithButton from '../text_inputs/ImageEdit';
import BackgroundImage from '../../images/Wine_Background2_AI.png';
import TextEditor from '../text_inputs/TextEditor';
import ThSlider from '../sliders/ThumbSlider';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/hover.css'
// import VPlayer from './components/VideoPlayer';

// const BackgroundImage = require('../../images/Wine_Background2_AI.png').default;


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



const HomeEdit = () => {

    const [bacgroundState, changeBackground] = useState(false)
    const [fsliderState, changeFslider] = useState(false)
    const [ssliderState, changeSslider] = useState(false)

    const handleMouseOver = (target = "mainBackground" || "firstSlider" || "secondSlider" ) => {
        switch (target) {
            case "mainBackground":
                changeBackground(true)
                break;

            case "firstSlider":
                changeFslider(true)
                break;

            case "secondSlider":
                changeSslider(true)
                break;

            default:
                break;
        }
    };
    
    const handleMouseOut = ( target = "mainBackground" || "firstSlider" || "secondSlider" ) => {
        switch (target) {
            case "mainBackground":
                changeBackground(false)
                break;

            case "firstSlider":
                changeFslider(false)
                break;

            case "secondSlider":
                changeSslider(false)
                break;

            default:
                break;
        }
    };

    const imageArray = [
        { src: "https://media.admagazine.ru/photos/61409580103eaf1470f8df16/16:9/w_2560%2Cc_limit/Room-9-St-Andrea-(1).jpg", alt: "Room 9 St Andrea" },
        { src: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/42/0e/53/sant-andrea-9.jpg?w=1200&h=-1&s=1", alt: "Sant Andrea" },
        { src: "https://flowbite.com/docs/images/carousel/carousel-3.svg", alt: "Carousel Image 3" },
        { src: "https://flowbite.com/docs/images/carousel/carousel-4.svg", alt: "Carousel Image 4" },
        { src: "https://flowbite.com/docs/images/carousel/carousel-5.svg", alt: "Carousel Image 5" },
      ];

    return ( 
        <tbody name = 'home' className="w-full h-max bg-white">


           {/* <div className=" bg-[url('../public/images/Wine_Background2_AI.png')] bg-no-repeat bg-cover bg-gray-300 bg-blend-multiply w-full h-screen rounded-xl">
                
                <div className="max-w-[700px] h-screen mx-auto px-16 flex flex-col justify-center content-center text-center xl:max-w-[900px]">
                    <p className='text-3xl font-bold font-body py-3 relative text-white drop-shadow-2xl isolate md:text-5xl xl:text-7xl'>Добро пожаловать на Винные Террасссы</p>
                </div>
            </div> */}

            <ImageWithButton image={BackgroundImage} isBackground={true}>
                <div className="max-w-[700px] mx-auto px-16 flex flex-col justify-center content-center text-center">
                    <div className="flex max-w-screen-lg flex-wrap items-end gap-4 px-4 py-3">
                        <TextEditor text="Добро пожаловать на Винные Терассы" format="header" isShort={true} onSave={(newText) => console.log(newText)} />
                    </div>
                </div>
            </ImageWithButton>

            
            


            {/* Brick 1 */}
            <section className='mt-14 mx-auto justify-center flex flex-row xl:container'>

                {/* Text Block */}
                <div className='mx-auto bg-white rounded-xl drop-shadow-2xl max-sm:w-5/6  xl:mx-2'>

                    <div className="w-full flex flex-col p-10 py-5 font-body md:flex-row">
                        {/* <h1 className="font-bold text-4xl text-gray-700 bg-white pt-4 pr-4 lg:text-5xl xl:text-6xl pt-8 pr-16">Кто мы?</h1> */}
                        <TextEditor text="Кто мы?" format="custom" style={"font-bold text-4xl text-gray-700 bg-white pt-4 pr-4 lg:text-5xl xl:text-6xl pt-8 pr-16"} isShort={true} onSave={(newText) => console.log(newText)} />
                        <TextEditor text='Отель-винодельня "Винные Террассы" - это уникальное место, сочетающее в себе шарм и гостеприимство с изысканными винами, произведенным нашими виноделами по собственному рецепту. Мы предлагаем гостям возможность насладиться роскошью и комфортом, а также окунуться в удивительный мир виноделия, попробовать уникальные сорта вин и узнать историю их создания.' format="paragraph" onSave={(newText) => console.log(newText)} />
                        {/* <p className="max-w-screen-lg font-light text-left text-gray-700 bg-white text-xs md:text-base lg:text-lg xl:text-2xl pt-8">
                            Отель-винодельня "Винные Террассы" - это уникальное место, сочетающее в себе шарм и гостеприимство с изысканными винами, произведенным нашими виноделами по собственному рецепту. Мы предлагаем гостям возможность насладиться роскошью и комфортом, а также окунуться в удивительный мир виноделия, попробовать уникальные сорта вин и узнать историю их создания.
                        </p> */}
                    </div>

                </div>
                
            </section>


            {/* Blue Swiper */}
            {/* <div className="mx-auto max-sm:w-5/6 md:w-3/4 xl:hidden ">
                <BlueSwiper />
            </div> */}

            <div className="mx-auto max-sm:w-5/6">
                <PhotoSelector photos={imageArray} withSlider={true}/>
            </div>
            
            
            {/* Brick 1 */}

            


            {/* Brick 2 */}
            <section className='mt-14 mx-auto justify-center font-body max-sm:w-5/6 md:w-3/4 xl:container' >
                {/* <h2 className='text-4xl text-gray-700 font-bold pt-4 text-nowrap lg:text-5xl xl:text-6xl pt-8'>Номерной Фонд</h2> */}
                <TextEditor text="Номерной Фонд" format="modal" isShort={true} onSave={(newText) => console.log(newText)} />
                <div className='flex mobile:flex-col sm:flex-row xl:justify-center'>
                    

                </div>
                

            </section>
            {/* Brick 2 */}

            {/* Galery */}
                <div className="mx-auto font-body px-2 mt-16 max-sm:w-5/6 md:w-3/4 lg:mt-24 xl:container">
                    {/* <h2 className='text-4xl text-gray-700 font-bold pb-8 flex flex-wrap lg:text-5xl xl:text-6xl '>Отель расположен в самой живописной локации Абрау</h2> */}
                    <TextEditor text="Отель расположен в самой живописной локации Абрау" format="modal" isShort={true} onSave={(newText) => console.log(newText)} />
                    
                    <div className="mx-auto max-sm:w-5/6">
                        <PhotoSelector photos={imageArray} withSlider={true}/>
                    </div>
                    
                    
                    
                </div>
            <div className='mx-auto mt-16 px-2 font-body max-sm:w-5/6 md:w-3/4 lg:mt-24 xl:container'>
                {/* <h1 className=' text-4xl text-gray-700 font-bold pb-4 sm:pb-8 text-wrap lg:text-5xl xl:text-6xl'>Посмотрите видео-презентацию</h1> */}
                <TextEditor text="Посмотрите видео-презентацию" format="modal" isShort={true} onSave={(newText) => console.log(newText)} />
                
                {/* <VPlayer/> */}
            </div>
            

            {/* Brick 3 */}
            <div className='mt-14 mx-8 mx-auto justify-center font-body max-sm:w-5/6 md:w-3/4 xl:container'>

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



            </div>

        </tbody>
     );
}

export default HomeEdit;
