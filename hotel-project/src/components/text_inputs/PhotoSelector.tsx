import React, { useState, useEffect } from 'react';
import ExtCard from '../cards/ExtCard';
import ImageWithButton from './ImageWithButton';
import BlueSwiperUniversal from '../sliders/BlSwiper';
import { MdOutlinePhotoCamera } from "react-icons/md";
import Bottle from '../assets/wine-bottle.png';

const PhotosLayout = ({content, onImageChange}) => {
    const [images, setImages] = useState(content);

    // Синхронизация с внешним состоянием
    useEffect(() => {
        setImages(content);
    }, [content]);

    const handleImageUpdate = (updatedImage, index) => {
        const newImages = [...images];
        if (updatedImage !== null) {
            if (updatedImage instanceof File) {
                const fileUrl = URL.createObjectURL(updatedImage);
                newImages[index] = {
                    src: fileUrl,
                    alt: updatedImage.name || 'Uploaded image'
                };
            } else if (typeof updatedImage === 'string' && updatedImage.startsWith('blob:')) {
                newImages[index] = {
                    src: updatedImage,
                    alt: 'Uploaded image'
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
        console.log('Updated images:', newImages);
        setImages(newImages);
        // Передаем данные наверх
        if (onImageChange) {
            onImageChange(newImages);
        }
    }

    const handleAddImage = () => {
        const newImages = [...images, Bottle]; 
        setImages(newImages);
        if (onImageChange) {
            onImageChange(newImages);
        }
    };

    return ( 
        <div className=''>
            {images.map((photo, index) => (
                <div key={index} className='mb-4'>
                    <ImageWithButton 
                        image={photo.src || photo}
                        onImageChange={(updatedImage) => handleImageUpdate(updatedImage, index)}
                    />
                </div>
            ))}

            <button
                className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48"
                onClick={handleAddImage}
            >
                Добавить картинку
            </button>
        </div>
    );
}

const PhotoSelectorButton = ({header}) => {
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
}

const PhotoSelector = ({ photos, header, ButtonCard, withSlider = false, onPhotosChange }) => {
    const [currentPhotos, setCurrentPhotos] = useState(photos);
    const [photoUrls, setPhotoUrls] = useState([]);

    // Синхронизация с внешним состоянием
    useEffect(() => {
        setCurrentPhotos(photos);
    }, [photos]);

    useEffect(() => {
        const urls = [];
        
        currentPhotos.forEach(photo => {
            if (photo instanceof File) {
                const url = URL.createObjectURL(photo);
                urls.push(url);
            } else {
                urls.push(photo);
            }
        });

        setPhotoUrls(urls);

        return () => {
            urls.forEach(url => {
                if (typeof url === 'string' && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [currentPhotos]);

    const handlePhotosChange = (updatedPhotos) => {
        setCurrentPhotos(updatedPhotos);
        // Передаем данные наверх
        if (onPhotosChange) {
            onPhotosChange(updatedPhotos);
        }
    }

    const renderCard = () => {
        if (ButtonCard) {
            return <ButtonCard />;
        }
        if (withSlider) {
            console.log(photoUrls);
            return <BlueSwiperUniversal images={photoUrls} />;
        }
        return <PhotoSelectorButton header={header} />;
    }

    const renderContent = () => {
        return <PhotosLayout content={currentPhotos} onImageChange={handlePhotosChange}/>;
    }

    return ( 
        <div className='w-full'>
            <ExtCard
                Card={renderCard}
                ExtContent={renderContent}
            />
        </div>
    );
}

export default PhotoSelector;