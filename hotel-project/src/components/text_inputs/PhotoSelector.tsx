import React, { useState, useEffect, useCallback, useRef } from 'react';
import ExtCard from '../cards/ExtCard';
import ImageWithButton from './ImageWithButton';
import BlueSwiper from '../sliders/BlSwiper';
import { MdOutlinePhotoCamera } from "react-icons/md";
import Bottle from '../assets/wine-bottle.png';

const PhotosLayout = ({ content, onImageChange, onSave }) => {
    const [images, setImages] = useState(content);
    const [hasChanges, setHasChanges] = useState(false);
    const [originalImages, setOriginalImages] = useState(content);
    const addImageInputRef = useRef<HTMLInputElement | null>(null);

    // Синхронизируем локальное состояние с пропсами при их изменении
    useEffect(() => {
        console.log('PhotosLayout: content changed', content);
        setImages(content);
        setOriginalImages(content);
        setHasChanges(false);
    }, [content]);

    const handleImageUpdate = useCallback((updatedImage, index) => {
        const newImages = [...images];
        if (updatedImage !== null) {
            if (updatedImage instanceof File) {
                const fileUrl = URL.createObjectURL(updatedImage);
                // Если старый URL был blob-строкой, отзываем его
                if (
                    newImages[index] &&
                    typeof newImages[index].src === 'string' &&
                    newImages[index].src.startsWith('blob:')
                ) {
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
            if (
                newImages[index] &&
                typeof newImages[index].src === 'string' &&
                newImages[index].src.startsWith('blob:')
            ) {
                URL.revokeObjectURL(newImages[index].src);
            }
            newImages.splice(index, 1);
        }
        console.log('PhotosLayout: updating images locally', newImages);
        setImages(newImages);
        setHasChanges(true);
    }, [images]);

    const handleAddImageClick = useCallback(() => {
        console.log('PhotosLayout: opening file selector for new image');
        addImageInputRef.current?.click();
    }, []);

    const handleAddImageFile = useCallback(async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        console.log(`PhotosLayout: adding new file: ${selectedFile.name}`);
        
        try {
            if (!selectedFile.type.startsWith('image/')) {
                throw new Error('Выбранный файл не является изображением');
            }

            // Проверяем, что файл может быть загружен как изображение
            await new Promise<boolean>((resolve, reject) => {
                const img = new Image();
                const testUrl = URL.createObjectURL(selectedFile);
                img.onload = () => {
                    URL.revokeObjectURL(testUrl);
                    resolve(true);
                };
                img.onerror = () => {
                    URL.revokeObjectURL(testUrl);
                    reject(new Error('Image load failed'));
                };
                img.src = testUrl;
            });

            // Создаем новый blob URL
            const newBlobUrl = URL.createObjectURL(selectedFile);
            const newImageObj = {
                src: newBlobUrl,
                alt: selectedFile.name || 'Uploaded image',
                file: selectedFile
            };

            const newImages = [...images, newImageObj];
            console.log('PhotosLayout: adding new image locally', newImages);
            setImages(newImages);
            setHasChanges(true);

            // Очищаем input
            if (addImageInputRef.current) {
                addImageInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Ошибка при загрузке изображения:', error);
            alert('Не удалось загрузить изображение. Пожалуйста, попробуйте другой файл.');
        }
    }, [images]);

    const handleSave = useCallback(() => {
        console.log('PhotosLayout: saving changes', images);
        onSave(images);
        setOriginalImages(images);
        setHasChanges(false);
    }, [images, onSave]);

    const handleCancel = useCallback(() => {
        console.log('PhotosLayout: canceling changes');
        // Очищаем blob URLs для отмененных изменений
        images.forEach(image => {
            const src = image?.src;
            if (typeof src === 'string' && src.startsWith('blob:') && 
                !originalImages.some(orig => orig?.src === src)) {
                URL.revokeObjectURL(src);
            }
        });
        setImages(originalImages);
        setHasChanges(false);
    }, [images, originalImages]);

    return ( 
        <div className=''>
            {images.map((photo, index) => (
                <div key={`${photo.src}-${index}`} className='mb-4'>
                    <ImageWithButton 
                        image={photo.src}
                        onImageChange={(updatedImage) => handleImageUpdate(updatedImage, index)}
                        children={null}
                    />
                </div>
            ))}
            
            <div className="flex gap-4 mt-4">
                <button
                    className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48"
                    onClick={handleAddImageClick}
                >
                    Добавить картинку
                </button>
                
                {/* Скрытый input для выбора файла */}
                <input 
                    ref={addImageInputRef}
                    type="file"
                    onChange={handleAddImageFile}
                    className="hidden"
                    accept="image/*"
                />
                
                {hasChanges && (
                    <>
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl w-32"
                            onClick={handleSave}
                        >
                            Сохранить
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-xl w-32"
                            onClick={handleCancel}
                        >
                            Отменить
                        </button>
                    </>
                )}
            </div>
            
            {hasChanges && (
                <p className="text-orange-600 text-sm mt-2 font-medium">
                    У вас есть несохраненные изменения
                </p>
            )}
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
    const [currentPhotos, setCurrentPhotos] = useState(() => {
        // Безопасная инициализация: приводим вход к массиву
        const inputPhotos = Array.isArray(photos) ? photos : [];
        return inputPhotos.map(photo => {
            if (typeof photo === 'string') {
                return { src: photo, alt: 'Image' };
            } else if (photo instanceof File) {
                const url = URL.createObjectURL(photo);
                return { src: url, alt: photo.name || 'Uploaded image', file: photo };
            } else if (photo && typeof photo === 'object') {
                // Если пришел объект с src=File (из родителя), конвертируем в blob URL для отображения
                const p: any = photo;
                if (p.src instanceof File) {
                    const url = URL.createObjectURL(p.src);
                    return { ...p, src: url, file: p.src };
                }
                return p as any;
            } else {
                return { src: '', alt: 'Image' };
            }
        });
    });

    // Синхронизируем с пропсами только если они реально изменились
    useEffect(() => {
        console.log('PhotoSelector: photos prop changed', photos);
        const inputPhotos = Array.isArray(photos) ? photos : [];
        const normalizedPhotos = inputPhotos.map(photo => {
            if (typeof photo === 'string') {
                return { src: photo, alt: 'Image' };
            } else if (photo instanceof File) {
                const url = URL.createObjectURL(photo);
                return { src: url, alt: photo.name || 'Uploaded image', file: photo };
            } else if (photo && typeof photo === 'object') {
                const p: any = photo;
                if (p.src instanceof File) {
                    const url = URL.createObjectURL(p.src);
                    return { ...p, src: url, file: p.src };
                }
                return p as any;
            } else {
                return { src: '', alt: 'Image' } as any;
            }
        });

        // Проверяем, действительно ли изменились фото
        const photosChanged = JSON.stringify(currentPhotos.map(p => ({ src: p.src, alt: p.alt }))) !== 
                              JSON.stringify(normalizedPhotos.map(p => ({ src: p.src, alt: p.alt })));

        if (photosChanged) {
            console.log('PhotoSelector: updating currentPhotos due to props change');
            setCurrentPhotos(normalizedPhotos);
        }
    }, [photos]); // Убираем currentPhotos из зависимостей, чтобы избежать бесконечного цикла

    const handlePhotosSave = useCallback((updatedPhotos) => {
        console.log('PhotoSelector: photos saved', updatedPhotos);
        setCurrentPhotos(updatedPhotos);
        if (onPhotosChange) {
            const processedPhotos = updatedPhotos
                .map(photo => {
                    // Если фото несет File — отдаем File (backend его загрузит)
                    if (photo && photo.file instanceof File) {
                        return photo.file;
                    }
                    // Если строка (URL) — проверяем, что это не blob
                    if (typeof photo === 'string') {
                        if (photo.startsWith('blob:')) {
                            console.warn('⚠️ PhotoSelector: Skipping blob URL before sending:', photo);
                            return null; // Фильтруем blob URLs
                        }
                        return photo;
                    }
                    // Если объект — обрабатываем src
                    if (photo && typeof photo === 'object') {
                        // Приоритет: file > src
                        if (photo.file instanceof File) {
                            return photo.file;
                        }
                        if (typeof photo.src === 'string') {
                            if (photo.src.startsWith('blob:')) {
                                console.warn('⚠️ PhotoSelector: Skipping blob URL in object.src before sending:', photo.src);
                                return null; // Фильтруем blob URLs
                            }
                            return photo.src;
                        }
                    }
                    return null; // Пропускаем невалидные значения
                })
                .filter(photo => photo !== null && photo !== ''); // Убираем null и пустые строки
            
            console.log('PhotoSelector: calling onPhotosChange with', processedPhotos);
            console.log('📸 Photos count: before =', updatedPhotos.length, 'after filtering =', processedPhotos.length);
            onPhotosChange(processedPhotos);
        }
    }, [onPhotosChange]);

    const renderCard = useCallback(() => {
        if (ButtonCard) {
            return <ButtonCard />;
        }
        if (withSlider) {
            const photoUrls = (Array.isArray(currentPhotos) ? currentPhotos : [])
                .map(photo => photo && photo.src)
                .filter(Boolean) as string[];
            return <BlueSwiper images={photoUrls} />;
        }
        return <PhotoSelectorButton header={header} />;
    }, [ButtonCard, withSlider, currentPhotos, header]);

    const renderContent = useCallback(() => {
        return <PhotosLayout content={currentPhotos} onImageChange={() => {}} onSave={handlePhotosSave} />;
    }, [currentPhotos, handlePhotosSave]);

    // Очистка blob URL при размонтировании
    useEffect(() => {
        return () => {
            currentPhotos.forEach((photo: any) => {
                if (photo && typeof photo.src === 'string' && photo.src.startsWith('blob:')) {
                    URL.revokeObjectURL(photo.src);
                }
            });
        };
    }, []); // Пустой массив зависимостей - выполняется только при размонтировании

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