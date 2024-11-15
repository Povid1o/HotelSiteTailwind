import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/Blueswiper.css';

import {Autoplay, Navigation, Pagination} from 'swiper/modules';

const BlueSwiper = () => {
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
          );
}

export default BlueSwiper;