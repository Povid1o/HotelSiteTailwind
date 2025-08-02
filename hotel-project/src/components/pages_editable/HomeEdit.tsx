import React, { useState, useCallback, useEffect, useRef } from 'react';
import Card from '../cards/Card';
import ExtCard from '../cards/ExtCard';
import ExtGaleryCard from '../cards/ExtGalerycard';
import BlueSwiper from '../sliders/BlueSwiper';
import PhotoSelector from '../text_inputs/PhotoSelector';
import ImageWithButton from '../text_inputs/ImageEdit';
import BackgroundContentEdit from '../text_inputs/BackgroundContentEdit';
import TextEditor from '../text_inputs/TextEditor';
import VideoWithUpload from '../text_inputs/VideoWithUpload';
import BoxEditable from '../text_inputs/BoxEditable';
import ThSlider from '../sliders/ThumbSlider';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/hover.css'


const HomeEdit = ({ pageData, onContentChange }) => {
    const [bacgroundState, changeBackground] = useState(false)
    const [fsliderState, changeFslider] = useState(false)
    const [ssliderState, changeSslider] = useState(false)
    

    const handleMainBackgroundTitleChange = useCallback((newTitle) => {
        onContentChange('mainBackground', { 
            ...pageData.mainBackground,
            title: newTitle 
        });
    }, [onContentChange, pageData.mainBackground]);


    const handleMainBackgroundImageChange = useCallback((newMedia: File | string | null) => {
        console.log('HomeEdit: handleMainBackgroundImageChange called with:', newMedia);
        
        onContentChange('mainBackground', { 
            ...pageData.mainBackground,
            image: newMedia 
        });
    }, [onContentChange, pageData.mainBackground]);

    const handleAboutSectionTitleChange = useCallback((newTitle) => {
        onContentChange('aboutSection', { 
            ...pageData.aboutSection,
            title: newTitle 
        });
    }, [onContentChange, pageData.aboutSection]);

    const handleAboutSectionDescriptionChange = useCallback((newDescription) => {
        onContentChange('aboutSection', { 
            ...pageData.aboutSection,
            description: newDescription 
        });
    }, [onContentChange, pageData.aboutSection]);

    const handleFirstGalleryTitleChange = useCallback((newTitle) => {
        onContentChange('firstGallery', { 
            ...pageData.firstGallery,
            title: newTitle 
        });
    }, [onContentChange, pageData.firstGallery]);

    const handleFirstGalleryImagesChange = useCallback((newImages) => {
        onContentChange('firstGallery', { 
            ...pageData.firstGallery,
            images: newImages 
        });
    }, [onContentChange, pageData.firstGallery]);

    const handleSecondGalleryTitleChange = useCallback((newTitle) => {
        onContentChange('secondGallery', { 
            ...pageData.secondGallery,
            title: newTitle 
        });
    }, [onContentChange, pageData.secondGallery]);

    const handleSecondGalleryImagesChange = useCallback((newImages) => {
        onContentChange('secondGallery', { 
            ...pageData.secondGallery,
            images: newImages 
        });
    }, [onContentChange, pageData.secondGallery]);

    const handleVideoSectionTitleChange = useCallback((newTitle) => {
        onContentChange('videoSection', { 
            ...pageData.videoSection,
            title: newTitle 
        });
    }, [onContentChange, pageData.videoSection]);

    const handleVideoSectionVideoChange = useCallback((videoSource: string | File | null) => {
        if (videoSource instanceof File) {
          // Создаём blob URL из объекта File
          const blobUrl = URL.createObjectURL(videoSource);
          onContentChange('videoSection', {
            ...pageData.videoSection,
            videoUrl: blobUrl,
          });
        } else if (typeof videoSource === 'string') {
          // Если это строка (URL)
          onContentChange('videoSection', {
            ...pageData.videoSection,
            videoUrl: videoSource,
          });
        } else {
          // Если видео удалено (null)
          onContentChange('videoSection', {
            ...pageData.videoSection,
            videoUrl: '',
          });
        }
      }, [onContentChange, pageData.videoSection]);

    const handleServicesSectionTitleChange = useCallback((newTitle) => {
        onContentChange('servicesSection', { 
            ...pageData.servicesSection,
            title: newTitle 
        });
    }, [onContentChange, pageData.servicesSection]);

    const handleServicesSectionServicesChange = useCallback((serviceIndex, newData) => {
        console.log('Updating service at index:', serviceIndex, 'with data:', newData);
        
        // Создаем новый массив сервисов с обновленным элементом
        const updatedServices = pageData.servicesSection.services.map((service, index) => {
            if (index === serviceIndex) {
                const updatedService = {
                    ...service,
                    name: newData.name || service.name,
                    image: newData.image !== undefined ? newData.image : service.image
                };
                console.log('Updated service:', updatedService);
                return updatedService;
            }
            return service;
        });
    
        // Обновляем всю секцию с новым массивом сервисов
        onContentChange('servicesSection', { 
            ...pageData.servicesSection,
            services: updatedServices
        });
    }, [onContentChange, pageData.servicesSection]);
    
    // Функция для создания стабильного URL для отображения
    const getDisplayImageSrc = (imageSrc) => {
        if (!imageSrc) return null;
        
        // Если это File объект, создаем blob URL
        if (imageSrc instanceof File) {
            return URL.createObjectURL(imageSrc);
        }
        
        // Если это строка, используем как есть
        if (typeof imageSrc === 'string') {
            return imageSrc;
        }
        
        return null;
    };

    return ( 
        <div name='home' className="w-full h-max bg-white">
            <BackgroundContentEdit 
            backgroundMedia={pageData.mainBackground.image}
            onMediaChange={handleMainBackgroundImageChange}
            acceptedTypes="image/*,video/*" // Если нужны только изображения, или "image/*,video/*" для изображений и видео
        >
            <div className="max-w-[700px] mx-auto px-16 flex flex-col justify-center content-center text-center">
                <div className="flex max-w-screen-lg flex-wrap items-end gap-4 px-4 py-3">
                    <TextEditor 
                        text={pageData.mainBackground.title} 
                        format="header" 
                        isShort={true} 
                        onSave={handleMainBackgroundTitleChange} 
                    />
                </div>
            </div>
        </BackgroundContentEdit>

            <section className='mt-14 mx-auto justify-center flex flex-row xl:container'>
                <div className='mx-auto bg-white rounded-xl drop-shadow-2xl max-sm:w-5/6 xl:mx-2'>
                    <div className="w-full flex flex-col p-10 py-5 font-body md:flex-row">
                        <TextEditor 
                            text={pageData.aboutSection.title} 
                            format="custom" 
                            style={"font-bold text-4xl text-gray-700 bg-white pt-4 pr-4 lg:text-5xl xl:text-6xl pt-8 pr-16"} 
                            isShort={true} 
                            onSave={handleAboutSectionTitleChange} 
                        />
                        <TextEditor 
                            text={pageData.aboutSection.description} 
                            format="paragraph" 
                            onSave={handleAboutSectionDescriptionChange} 
                        />
                    </div>
                </div>
            </section>

            <div className="mx-auto max-sm:w-5/6">
                <PhotoSelector 
                    photos={pageData.firstGallery.images} 
                    withSlider={true}
                    onPhotosChange={handleFirstGalleryImagesChange}
                />
            </div>
            
            <section className='mt-14 mx-auto justify-center font-body max-sm:w-5/6 md:w-3/4 xl:container'>
                <TextEditor 
                    text={pageData.firstGallery.title} 
                    format="modal" 
                    isShort={true} 
                    onSave={handleFirstGalleryTitleChange} 
                />
                <div className='flex mobile:flex-col sm:flex-row xl:justify-center'></div>
            </section>

            <div className="mx-auto font-body px-2 mt-16 max-sm:w-5/6 md:w-3/4 lg:mt-24 xl:container">
                <TextEditor 
                    text={pageData.secondGallery.title} 
                    format="modal" 
                    isShort={true} 
                    onSave={handleSecondGalleryTitleChange} 
                />
                <div className="mx-auto max-sm:w-5/6">
                    <PhotoSelector 
                        photos={pageData.secondGallery.images} 
                        withSlider={true}
                        onPhotosChange={handleSecondGalleryImagesChange}
                    />
                </div>
            </div>

            <div className='mx-auto mt-16 px-2 font-body max-sm:w-5/6 md:w-3/4 lg:mt-24 xl:container'>
                <TextEditor 
                    text={pageData.videoSection.title} 
                    format="modal" 
                    isShort={true} 
                    onSave={handleVideoSectionTitleChange} 
                />
                <VideoWithUpload 
                    sourceUrl={pageData.videoSection.videoUrl}
                    onVideoChange={handleVideoSectionVideoChange}
                />
            </div>

            <div className='mt-14 mx-8 mx-auto justify-center font-body max-sm:w-5/6 md:w-3/4 xl:container'>
                <TextEditor 
                    text={pageData.servicesSection.title} 
                    format="custom"
                    style="text-4xl text-gray-700 font-bold pt-4 lg:text-5xl xl:text-6xl pt-8"
                    isShort={true} 
                    onSave={handleServicesSectionTitleChange} 
                />
                <ul className='flex flex-wrap flex-row'>
                    {pageData.servicesSection.services.map((service, index) => (
                        <li key={`service-${index}-${service.name}`}>
                            <BoxEditable
                                name={service.name}
                                imgSrc={getDisplayImageSrc(service.image)}
                                onDataChange={(newData) => handleServicesSectionServicesChange(index, newData)}
                            >
                                <p className='mx-10 my-auto text-lg mobile:text-xl md:text-2xl font-semibold'>
                                    {service.name}
                                </p>
                            </BoxEditable>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default HomeEdit;