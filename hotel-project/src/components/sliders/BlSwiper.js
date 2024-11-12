import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/Blueswiper.css';

import { Autoplay, Navigation, Pagination } from 'swiper/modules';

const BlueSwiper = ({ images }) => {
    return (
      <Swiper
        className='rounded-lg content-center h-56 w-full max-w-[700px] mt-5 mx-auto z-0 sm:h-80 lg:max-w-[900px] lg:h-96'
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        autoHeight={false}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: true,
        }}
        spaceBetween={30}
        slidesPerView={1}
        modules={[Autoplay, Navigation, Pagination]}
      >
        {images.map((image, index) => {
          // Получаем src из image в зависимости от его типа
          const imageSrc = typeof image === 'string' ? image : image.src;
          return (
            <SwiperSlide key={index}>
              <img 
                className='w-full h-full object-cover'
                src={imageSrc}
                alt={image.alt || 'Slide image'}
                onError={(e) => {
                  console.error('Error loading image:', imageSrc);
                  e.target.src = 'path/to/fallback/image.jpg'; // Опционально: запасное изображение
                }}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    );
  }

export default BlueSwiper;