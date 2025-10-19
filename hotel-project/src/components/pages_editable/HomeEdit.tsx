import { useState, useCallback} from 'react';
import { toJS } from 'mobx';
import PagesPhotoSelector from '../text_inputs/PagesPhotoSelector';
import BackgroundContentEdit from '../text_inputs/BackgroundContentEdit';
import TextEditor from '../text_inputs/TextEditor';
import VideoWithUpload from '../text_inputs/VideoWithUpload';
import BoxEditable from '../text_inputs/BoxEditable';
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import { getMediaUrl } from '../../utils/contentHelpers';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/hover.css'


const HomeEdit = ({ pageData, onContentChange }) => {
    const [bacgroundState, changeBackground] = useState(false)
    const [fsliderState, changeFslider] = useState(false)
    const [ssliderState, changeSslider] = useState(false)
    
    // Состояния для батч-сохранения изменений сервисов
    const [pendingServiceChanges, setPendingServiceChanges] = useState({});
    const [hasUnsavedServiceChanges, setHasUnsavedServiceChanges] = useState(false);
    
    // Состояние для количества добавляемых элементов (храним как строку для удобства ввода)
    const [addServicesCount, setAddServicesCount] = useState('1');

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

    // ✅ ПАТЧ: Универсальный обработчик для галерей
    const handleGalleryImagesChange = useCallback((galleryKey: string, newImages: any) => {
        console.log(`🔵 HomeEdit: ${galleryKey} received`, newImages);

        const formatted = (Array.isArray(newImages) ? newImages : []).map((img: any, i: number) => {
            if (img?.src instanceof File) return { src: img.src, alt: img.alt || `Image ${i + 1}` };
            if (img instanceof File) return { src: img, alt: img.name || `Image ${i + 1}` };
            if (typeof img === 'string') return { src: img, alt: `Image ${i + 1}` };
            if (img && typeof img === 'object' && 'src' in img)
                return { src: img.src || '', alt: img.alt || `Image ${i + 1}` };
            return { src: '', alt: `Image ${i + 1}` };
        });

        console.log(`🔵 HomeEdit: ${galleryKey} formatted images:`, formatted);
        onContentChange(galleryKey, {
            ...pageData[galleryKey],
            images: formatted,
        });
    }, [onContentChange, pageData]);

    const handleSecondGalleryTitleChange = useCallback((newTitle) => {
        onContentChange('secondGallery', { 
            ...pageData.secondGallery,
            title: newTitle 
        });
    }, [onContentChange, pageData.secondGallery]);

    const handleVideoSectionTitleChange = useCallback((newTitle) => {
        onContentChange('videoSection', { 
            ...pageData.videoSection,
            title: newTitle 
        });
    }, [onContentChange, pageData.videoSection]);

    const handleVideoSectionVideoChange = useCallback((videoSource: string | File | null) => {
        console.log('🎥 HomeEdit: handleVideoSectionVideoChange called with:', videoSource);
        
        if (videoSource instanceof File) {
          // ✅ ПАТЧ: Отправляем File объект, а НЕ blob URL!
          // pageAPI.deepProcess загрузит File и заменит его на URL
          console.log('🎥 HomeEdit: Sending File object to backend:', videoSource.name);
          onContentChange('videoSection', {
            ...pageData.videoSection,
            videoUrl: videoSource, // Отправляем File, не blob URL!
          });
        } else if (typeof videoSource === 'string') {
          // Если это строка (URL)
          console.log('🎥 HomeEdit: Sending URL string:', videoSource);
          onContentChange('videoSection', {
            ...pageData.videoSection,
            videoUrl: videoSource,
          });
        } else {
          // Если видео удалено (null)
          console.log('🎥 HomeEdit: Video removed');
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
        
        // Накапливаем изменения вместо немедленной отправки
        setPendingServiceChanges(prev => {
            const currentService = pageData.servicesSection.services[serviceIndex];
            return {
                ...prev,
                [serviceIndex]: {
                    ...currentService,
                    ...prev[serviceIndex],
                    ...newData
                }
            };
        });
        setHasUnsavedServiceChanges(true);
    }, [pageData.servicesSection.services]);
    
    // Функция для сохранения всех накопленных изменений сервисов
    const handleSaveServiceChanges = useCallback(() => {
        const updatedServices = pageData.servicesSection.services.map((service, index) => {
            return pendingServiceChanges[index] || service;
        });
        
        onContentChange('servicesSection', { 
            ...pageData.servicesSection,
            services: updatedServices
        });
        
        setPendingServiceChanges({});
        setHasUnsavedServiceChanges(false);
    }, [pendingServiceChanges, pageData.servicesSection, onContentChange]);
    
    // Функция для отмены изменений сервисов
    const handleCancelServiceChanges = useCallback(() => {
        setPendingServiceChanges({});
        setHasUnsavedServiceChanges(false);
    }, []);

    // Удаление сервиса (как в VineryEdit для стадий)
    const handleServiceRemove = useCallback((serviceIndex) => {
        const updatedServices = pageData.servicesSection.services.filter((_, index) => index !== serviceIndex);
        onContentChange('servicesSection', {
            ...pageData.servicesSection,
            services: updatedServices
        });
    }, [onContentChange, pageData.servicesSection]);

    // Добавление нескольких сервисов за раз
    const handleServiceAdd = useCallback(() => {
        // Валидируем и получаем число из строки
        const count = Math.max(1, Math.min(10, parseInt(addServicesCount) || 1));
        
        // Создаем массив новых сервисов
        const newServices = Array.from({ length: count }, (_, index) => ({
            id: Date.now() + index, // Уникальный ID для каждого
            name: `Новый элемент ${pageData.servicesSection.services.length + index + 1}`,
            image: null
        }));
        
        const updatedServices = [...pageData.servicesSection.services, ...newServices];
        
        onContentChange('servicesSection', {
            ...pageData.servicesSection,
            services: updatedServices
        });
        
        // Показываем уведомление пользователю
        alert(`✅ Добавлено ${count} элементов!\n\n⚠️ Закройте и откройте модальное окно, чтобы увидеть изменения.`);
    }, [onContentChange, pageData.servicesSection, addServicesCount]);
    
    // Функция для создания стабильного URL для отображения (изображения и видео)
    const getDisplayImageSrc = (imageSrc) => {
        if (!imageSrc) return null;
        
        // Разворачиваем MobX Proxy если это он
        const plainSrc = toJS(imageSrc);
        
        // Если это File объект, создаем blob URL
        if (plainSrc instanceof File) {
            return URL.createObjectURL(plainSrc);
        }
        
        // Если это строка, преобразуем относительные пути в полные URL
        if (typeof plainSrc === 'string') {
            return getMediaUrl(plainSrc);
        }
        
        return null;
    };

    // Функция для нормализации видео URL для отображения
    const getDisplayVideoUrl = (videoSrc) => {
        if (!videoSrc) return '';
        
        // Разворачиваем MobX Proxy если это он
        const plainSrc = toJS(videoSrc);
        console.log('🎥 HomeEdit: getDisplayVideoUrl - plainSrc:', plainSrc);
        
        // Если это File объект, возвращаем его как есть (VideoWithUpload создаст blob URL)
        if (plainSrc instanceof File) {
            console.log('🎥 HomeEdit: Video is File object:', plainSrc.name);
            return plainSrc;
        }
        
        // Если это строка, преобразуем относительные пути в полные URL
        if (typeof plainSrc === 'string') {
            const fullUrl = getMediaUrl(plainSrc);
            console.log('🎥 HomeEdit: Video is URL string:', fullUrl);
            return fullUrl;
        }
        
        return '';
    };

    // Нормализация массива фото для корректной работы слайдера (делаем абсолютные URL)
    const normalizePhotosForDisplay = (photosArr) => {
        if (!Array.isArray(photosArr)) return [];
        
        // Разворачиваем MobX Proxy в обычные объекты
        const plainPhotos = toJS(photosArr);
        console.log('🔵 HomeEdit: normalizePhotosForDisplay - plain photos:', plainPhotos);
        
        return plainPhotos.map((p) => {
            // File оставляем как есть, чтобы PhotoSelector мог загрузить его
            if (p instanceof File) return p;
            if (typeof p === 'string') return getMediaUrl(p);
            if (p && typeof p === 'object' && p.src) {
                const normalizedSrc = typeof p.src === 'string' ? getMediaUrl(p.src) : p.src;
                return { ...p, src: normalizedSrc };
            }
            return p;
        });
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
                <PagesPhotoSelector 
                    photos={normalizePhotosForDisplay(pageData.firstGallery.images)} 
                    withSlider={true}
                    onPhotosChange={(newImgs) => handleGalleryImagesChange('firstGallery', newImgs)}
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
                    <PagesPhotoSelector 
                        photos={normalizePhotosForDisplay(pageData.secondGallery.images)} 
                        withSlider={true}
                        onPhotosChange={(newImgs) => handleGalleryImagesChange('secondGallery', newImgs)}
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
                    sourceUrl={getDisplayVideoUrl(pageData.videoSection.videoUrl)}
                    onVideoChange={handleVideoSectionVideoChange}
                />
            </div>

            <div className='mt-14 mx-8 mx-auto justify-center font-body max-sm:w-5/6 md:w-3/4 xl:container'>
                <div className='flex items-center justify-between mb-4 sm:mb-8'>
                    <TextEditor 
                        text={pageData.servicesSection.title} 
                        format="custom"
                        style="text-4xl text-gray-700 font-bold pt-4 lg:text-5xl xl:text-6xl pt-8"
                        isShort={true} 
                        onSave={handleServicesSectionTitleChange} 
                    />
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Количество:</label>
                            <input
                                type="text"
                                value={addServicesCount}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Разрешаем только цифры и пустую строку
                                    if (value === '' || /^\d+$/.test(value)) {
                                        setAddServicesCount(value);
                                    }
                                }}
                                onBlur={(e) => {
                                    // При потере фокуса валидируем значение
                                    const num = parseInt(e.target.value);
                                    if (isNaN(num) || num < 1) {
                                        setAddServicesCount('1');
                                    } else if (num > 10) {
                                        setAddServicesCount('10');
                                    }
                                }}
                                placeholder="1-10"
                                className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
                            />
                        </div>
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 whitespace-nowrap"
                            onClick={handleServiceAdd}
                        >
                            <FaPlus className="w-4 h-4" />
                            Добавить элементы
                        </button>
                    </div>
                </div>
                <ul className='flex flex-wrap flex-row'>
                    {pageData.servicesSection.services.map((service, index) => (
                        <li key={`service-${index}-${service.name}`} className={(pendingServiceChanges[index] ? 'ring-2 ring-orange-400 ' : '') + 'rounded-lg p-1'}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600">Сервис {index + 1}</span>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                                    onClick={() => handleServiceRemove(index)}
                                    title="Удалить сервис"
                                >
                                    <FaTrashAlt className="w-3 h-3" />
                                </button>
                            </div>
                            <BoxEditable
                                name={pendingServiceChanges[index]?.name || service.name}
                                imgSrc={getDisplayImageSrc(pendingServiceChanges[index]?.image || service.image)}
                                onDataChange={(newData) => handleServicesSectionServicesChange(index, newData)}
                            >
                                <p className='mx-10 my-auto text-lg mobile:text-xl md:text-2xl font-semibold'>
                                    {pendingServiceChanges[index]?.name || service.name}
                                </p>
                            </BoxEditable>
                        </li>
                    ))}
                </ul>
                
                {/* Кнопки сохранения/отмены изменений */}
                {hasUnsavedServiceChanges && (
                    <div className="flex gap-4 justify-center mt-6 p-4 bg-yellow-50 rounded-lg">
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2"
                            onClick={handleSaveServiceChanges}
                        >
                            <span>Сохранить изменения</span>
                            {Object.keys(pendingServiceChanges).length > 0 && (
                                <span className="bg-white text-green-600 px-2 py-1 rounded-full text-sm font-bold">
                                    {Object.keys(pendingServiceChanges).length}
                                </span>
                            )}
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl"
                            onClick={handleCancelServiceChanges}
                        >
                            Отменить изменения
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomeEdit;