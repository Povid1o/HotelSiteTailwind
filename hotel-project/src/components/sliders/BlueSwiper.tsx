import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/Blueswiper.css';

import {Autoplay, Navigation, Pagination} from 'swiper/modules';

interface ImageData {
  src: string;
  alt?: string;
}

interface BlueSwiperProps {
  images: ImageData[];
}

const BlueSwiper = ({ images }: BlueSwiperProps) => {
  return(
          <Swiper
            className='rounded-lg content-center h-56 w-full max-w-[700px] mt-5 mx-auto z-0 sm:h-80 lg:max-w-[900px] lg:h-96  '//Создать w-full(а по хорошему другой className) для карточки(В виде тернара)
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
              // height={460}
              modules={[Autoplay, Navigation, Pagination]}>
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      className='w-full h-full object-cover' 
                      src={image.src} 
                      alt={image.alt || `Изображение ${index + 1}`} 
                    /> 
                  </SwiperSlide>
                ))}
           
          </Swiper>
          );
}

export default BlueSwiper;