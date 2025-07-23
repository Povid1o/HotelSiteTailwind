import React, { useState, useEffect } from 'react';
import ExtCard from '../cards/ExtCard';
import ImageWithButton from './ImageWithButton';
import BlueSwiperUniversal from '../sliders/BlSwiper';
import { MdOutlinePhotoCamera } from "react-icons/md";
import Bottle from '../assets/wine-bottle.png';

const PhotosLayout = ({ content, onImageChange }) => {
    const [images, setImages] = useState(content);

    const handleImageUpdate = (updatedImage, index) => {
        const newImages = [...images];
        if (updatedImage !== null) {
            if (updatedImage instanceof File) {
                const fileUrl = URL.createObjectURL(updatedImage);
                // Если старый URL был blob, отзываем его
                if (newImages[index]?.src?.startsWith('blob:')) {
                    URL.revokeObjectURL(newImages[index].src);
                }
                newImages[index] = {
                    src: fileUrl,
                    alt: updatedImage.name || 'Uploaded image',
                    file: updatedImage
                };
            } else {
                newImages[index] = updatedImage;
            }
        } else {
            if (newImages[index]?.src?.startsWith('blob:')) {
                URL.revokeObjectURL(newImages[index].src);
            }
            newImages.splice(index, 1);
        }
        setImages(newImages);
        onImageChange(newImages);
    };

    return ( 
        <div className=''>
            {images.map((photo, index) => (
                <div key={index} className='mb-4'>
                    <ImageWithButton 
                        image={photo.src}
                        onImageChange={(updatedImage) => handleImageUpdate(updatedImage, index)}
                    />
                </div>
            ))}
            <button
                className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48"
                onClick={() => {
                    const newImages = [...images, { src: Bottle, alt: 'Default image' }];
                    setImages(newImages);
                    onImageChange(newImages);
                }}
            >
                Добавить картинку
            </button>
        </div>
    );
};

const PhotoSelectorButton = ({ header }) => {
    return ( 
        <div className="@container w-full">
            <div className="sm:px-4 sm:py-3 ">
                <div
                    className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-[#FBF8EF] sm:rounded-xl min-h-80 " 
                    style={{
                        backgroundImage:
                            'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("https://cdn.usegalileo.ai/sdxl10/5362d63b-c3ad-40ed-94a9-a4597902cbc7.png")',
                    }}
                >
                    <div className="flex p-4">
                        <p className="text-white tracking-light text-[28px] font-bold leading-tight">{header}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PhotoSelector = ({ photos, header, ButtonCard, withSlider = false, onPhotosChange }) => {
    const [currentPhotos, setCurrentPhotos] = useState(
        photos.map(photo => {
            if (typeof photo === 'string') {
                return { src: photo, alt: 'Image' };
            } else if (photo instanceof File) {
                const url = URL.createObjectURL(photo);
                return { src: url, alt: photo.name || 'Uploaded image', file: photo };
            } else {
                return photo; // Если уже объект { src, alt, file? }
            }
        })
    );

    const handlePhotosChange = (updatedPhotos) => {
        setCurrentPhotos(updatedPhotos);
        if (onPhotosChange) {
            onPhotosChange(updatedPhotos.map(photo => photo.file || photo.src));
        }
    };

    const renderCard = () => {
        if (ButtonCard) {
            return <ButtonCard />;
        }
        if (withSlider) {
            const photoUrls = currentPhotos.map(photo => photo.src);
            return <BlueSwiperUniversal images={photoUrls} />;
        }
        return <PhotoSelectorButton header={header} />;
    };

    const renderContent = () => {
        return <PhotosLayout content={currentPhotos} onImageChange={handlePhotosChange} />;
    };

    // Очистка blob URL при размонтировании
    useEffect(() => {
        return () => {
            currentPhotos.forEach(photo => {
                if (photo.src?.startsWith('blob:')) {
                    URL.revokeObjectURL(photo.src);
                }
            });
        };
    }, []);

    return ( 
        <div className='w-full'>
            <ExtCard
                Card={renderCard}
                ExtContent={renderContent}
            />
        </div>
    );
};
 
export default PhotoSelector;