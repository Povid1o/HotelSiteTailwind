import React, { useState, useCallback, useEffect, useRef } from 'react';
import PhotoSelector from '../text_inputs/PhotoSelector';
import ImageWithButton from '../text_inputs/ImageEdit';
import BackgroundContentEdit from '../text_inputs/BackgroundContentEdit';
import TextEditor from '../text_inputs/TextEditor';
import VideoWithUpload from '../text_inputs/VideoWithUpload';
import BoxEditable from '../text_inputs/BoxEditable';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/hover.css'


const VineryEdit = ({ pageData, onContentChange }) => {

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

    const handleIntroSectionDescriptionChange = useCallback((newDescription) => {
        onContentChange('aboutSection', { 
            ...pageData.introSection,
            description: newDescription 
        });
    }, [onContentChange, pageData.aboutSection]);

    const handleIntroSectionImageChange = useCallback((newImage: File | string | null) => {
        console.log('HomeEdit: handleIntroSectionImageChange called with:', newImage);
        onContentChange('aboutSection', {
            ...pageData.introSection,
            image: newImage 
        });
    }, [onContentChange, pageData.introSection]);
    
    
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
                acceptedTypes="image/*,video/*"
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

            <section className="max-w-screen-lg mx-auto px-16 py-8">
                <div className="flex flex-col items-center justify-center">
                    <ImageWithButton 
                        imageSrc={getDisplayImageSrc(pageData.introSection.image)} 
                        onImageChange={handleIntroSectionDescriptionChange} 
                        acceptedTypes="image/*,video/*"
                    />
                    <TextEditor 
                        text={pageData.introSection.title} 
                        format="modal" 
                        isShort={false} 
                        onSave={handleIntroSectionImageChange}
                    />
                </div>
            </section>


        </div>

        
    );
}

export default VineryEdit;