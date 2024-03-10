import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {Autoplay, Navigation, Pagination} from 'swiper/modules';

const BlueSwiper = () => {
  return(
          <Swiper
              className='rounded-lg content-center h-56 w-3/4 max-w-[700px] mt-5 mx-auto z-0 sm:h-80 lg:max-w-[900px] lg:h-96 xl:hidden '
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
                      <img className='rounded-lg absolute top-1/2 left-1/2 block w-full -translate-x-1/2 -translate-y-1/2  ' src="https://media.admagazine.ru/photos/61409580103eaf1470f8df16/16:9/w_2560%2Cc_limit/Room-9-St-Andrea-(1).jpg" alt="..." />
                  </SwiperSlide>
                  <SwiperSlide>
                      <img className='absolute top-1/2 left-1/2 block w-full -translate-x-1/2 -translate-y-1/2 ' src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/42/0e/53/sant-andrea-9.jpg?w=1200&h=-1&s=1" alt="..." />
                  </SwiperSlide>
                  <SwiperSlide>
                      <img className='absolute top-1/2 left-1/2 block w-full -translate-x-1/2 -translate-y-1/2  ' src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
                  </SwiperSlide>
                  <SwiperSlide>
                      <img className='absolute top-1/2 left-1/2 block w-full -translate-x-1/2 -translate-y-1/2 ' src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
                  </SwiperSlide>
                  <SwiperSlide>
                      <img className='absolute top-1/2 left-1/2 block w-full -translate-x-1/2 -translate-y-1/2 ' src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
                  </SwiperSlide>
           
          </Swiper>
          );
}

export default BlueSwiper;