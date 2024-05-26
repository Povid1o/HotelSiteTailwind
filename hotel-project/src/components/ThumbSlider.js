import React, { useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

import './ThumbSlider.css'

import { FreeMode, Navigation, Thumbs} from 'swiper/modules';

const ThSlider=() => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2 rounded-lg content-center h-56 w-full max-w-[700px] mt-7 mx-auto z-0 sm:h-80 lg:max-w-[900px] lg:h-96"
      >
        <SwiperSlide>
            <img className='' src="https://media.admagazine.ru/photos/61409580103eaf1470f8df16/16:9/w_2560%2Cc_limit/Room-9-St-Andrea-(1).jpg" alt="..." /> 
        </SwiperSlide>
        <SwiperSlide>
            <img className='' src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/42/0e/53/sant-andrea-9.jpg?w=1200&h=-1&s=1" alt="..." />
        </SwiperSlide>
        <SwiperSlide>
            <img className='' src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
        </SwiperSlide>
        <SwiperSlide>
            <img className='' src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
        </SwiperSlide>
        <SwiperSlide>
            <img className='' src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
        </SwiperSlide>
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper rounded-lg content-center h-24 w-full max-w-[700px] mt-7 mx-auto z-0 sm:h-32 lg:max-w-[900px] lg:h-40"
      >
        <SwiperSlide>
            <img className='rounded-lg' src="https://media.admagazine.ru/photos/61409580103eaf1470f8df16/16:9/w_2560%2Cc_limit/Room-9-St-Andrea-(1).jpg" alt="..." /> 
        </SwiperSlide>
        <SwiperSlide>
            <img className='rounded-lg' src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/42/0e/53/sant-andrea-9.jpg?w=1200&h=-1&s=1" alt="..." />
        </SwiperSlide>
        <SwiperSlide>
            <img className='rounded-lg' src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
        </SwiperSlide>
        <SwiperSlide>
            <img className='rounded-lg' src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
        </SwiperSlide>
        <SwiperSlide>
            <img className='rounded-lg' src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export default ThSlider