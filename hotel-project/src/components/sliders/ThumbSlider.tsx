import React, { useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

import '../styles/ThumbSlider.css'

import { FreeMode, Navigation, Thumbs} from 'swiper/modules';

interface GalleryImage {
  src: string;
  alt?: string;
}

interface ThSliderProps {
  images: GalleryImage[];
}

const ThSlider: React.FC<ThSliderProps> = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  // If no images provided, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg">
        <p className="text-gray-500">Изображения не найдены</p>
      </div>
    );
  }

  return (
    <>
      <Swiper
        style={{
          ['--swiper-navigation-color' as any]: '#fff',
          ['--swiper-pagination-color' as any]: '#fff',
        }}
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2 rounded-lg content-center h-56 w-full max-w-[700px] mt-7 mx-auto z-0 sm:h-80 lg:max-w-[900px] lg:h-96"
      >
        {images.map((image, index) => (
          <SwiperSlide key={`main-${index}`}>
            <img 
              className="w-full h-full object-cover" 
              src={image.src} 
              alt={image.alt || `Gallery image ${index + 1}`} 
            /> 
          </SwiperSlide>
        ))}
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
        {images.map((image, index) => (
          <SwiperSlide key={`thumb-${index}`}>
            <img 
              className="rounded-lg w-full h-full object-cover" 
              src={image.src} 
              alt={image.alt || `Thumbnail ${index + 1}`} 
            /> 
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default ThSlider