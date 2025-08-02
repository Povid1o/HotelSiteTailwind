import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IoTrashBin } from "react-icons/io5";
import { FaPen } from "react-icons/fa";

const MediaWithButton = ({ 
  media, 
  onMediaChange, 
  acceptTypes = "image/*,video/*", // По умолчанию принимает изображения и видео
  children 
}) => {
  const [showButton, setShowButton] = useState(false);
  const [currentMediaUrl, setCurrentMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState(''); // 'image', 'video', или ''
  const fileInputRef = useRef(null);
  const currentBlobRef = useRef(null);

  // Функция для определения типа медиа
  const getMediaType = useCallback((mediaSource) => {
    if (!mediaSource) return '';
    
    let mimeType = '';
    
    if (mediaSource instanceof File) {
      mimeType = mediaSource.type;
    } else if (typeof mediaSource === 'string') {
      // Пытаемся определить тип по расширению файла или URL
      const lowerUrl = mediaSource.toLowerCase();
      if (lowerUrl.includes('.mp4') || lowerUrl.includes('.webm') || lowerUrl.includes('.ogg') || lowerUrl.includes('youtube') || lowerUrl.includes('vimeo')) {
        return 'video';
      } else if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerUrl.includes('.png') || lowerUrl.includes('.gif') || lowerUrl.includes('.webp')) {
        return 'image';
      }
      // Если не можем определить по URL, считаем изображением по умолчанию
      return 'image';
    }
    
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    
    return 'image'; // По умолчанию
  }, []);

  // Функция для получения display URL из любого типа медиа
  const getDisplayUrl = useCallback((mediaSource) => {
    if (!mediaSource) return '';
    
    if (mediaSource instanceof File) {
      const blobUrl = URL.createObjectURL(mediaSource);
      return blobUrl;
    } else if (typeof mediaSource === 'string') {
      return mediaSource;
    }
    
    return '';
  }, []);

  // Обновляем currentMediaUrl когда media изменяется извне
  useEffect(() => {
    console.log('MediaWithButton: media prop changed', media);
    
    // Очищаем предыдущий blob URL если он был создан нами
    if (currentBlobRef.current && currentBlobRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(currentBlobRef.current);
      currentBlobRef.current = null;
    }

    const newUrl = getDisplayUrl(media);
    const newType = getMediaType(media);
    
    // Если новое медиа - это File, сохраняем ссылку на blob URL для последующей очистки
    if (media instanceof File && newUrl.startsWith('blob:')) {
      currentBlobRef.current = newUrl;
    }
    
    setCurrentMediaUrl(newUrl);
    setMediaType(newType);
  }, [media, getDisplayUrl, getMediaType]);

  // Очистка blob URL при размонтировании компонента
  useEffect(() => {
    return () => {
      if (currentBlobRef.current && currentBlobRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(currentBlobRef.current);
        currentBlobRef.current = null;
      }
    };
  }, []);

  const validateMediaFile = useCallback(async (file) => {
    // Проверяем, что файл соответствует разрешенным типам
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      throw new Error('Выбранный файл должен быть изображением или видео');
    }

    // Дополнительная проверка для изображений
    if (isImage) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const testUrl = URL.createObjectURL(file);
        
        img.onload = () => {
          URL.revokeObjectURL(testUrl);
          resolve(true);
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(testUrl);
          reject(new Error('Файл поврежден или не является корректным изображением'));
        };
        
        img.src = testUrl;
      });
    }

    // Для видео просто проверяем MIME тип (более сложная валидация может быть добавлена позже)
    if (isVideo) {
      return Promise.resolve(true);
    }

    return Promise.resolve(true);
  }, []);

  const selectFile = useCallback(async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    console.log(`MediaWithButton: attempting to load file: ${selectedFile.name}, type: ${selectedFile.type}`);
    
    try {
      // Валидируем файл
      await validateMediaFile(selectedFile);

      console.log('MediaWithButton: file validation passed, calling onMediaChange');
      
      // Вызываем callback с File объектом
      if (onMediaChange) {
        onMediaChange(selectedFile);
      }

      // Очищаем input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('MediaWithButton: validation error:', error);
      alert(`Ошибка загрузки файла: ${error.message}`);
      
      // Очищаем input при ошибке
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [onMediaChange, validateMediaFile]);

  const handleMouseOver = () => setShowButton(true);
  const handleMouseOut = () => setShowButton(false);

  const handleTrashClick = useCallback(() => {
    console.log('MediaWithButton: removing media');
    
    if (onMediaChange) {
      onMediaChange(null);
    }
  }, [onMediaChange]);

  const handleMediaError = useCallback((e) => {
    console.error('MediaWithButton: media load error:', e);
    
    if (onMediaChange) {
      onMediaChange(null);
    }
  }, [onMediaChange]);

  const renderMedia = () => {
    if (!currentMediaUrl) {
      return (
        <div className="w-full h-screen bg-gray-300 flex items-center justify-center text-gray-500 text-xl">
          Нет медиа
        </div>
      );
    }

    if (mediaType === 'video') {
      return (
        <video 
          key={currentMediaUrl}
          className="w-full h-screen object-cover"
          autoPlay={false}
          controls
          onError={handleMediaError}
        >
          <source src={currentMediaUrl} />
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
      );
    } else {
      // По умолчанию рендерим как изображение
      return (
        <div 
          className="w-full h-screen bg-no-repeat bg-cover bg-center bg-gray-300"
          style={{ 
            backgroundImage: `url("${currentMediaUrl}")` 
          }}
        />
      );
    }
  };

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="relative w-full h-screen bg-gray-300 bg-blend-multiply rounded-xl overflow-hidden"
    >
      {renderMedia()}
      
      {/* Кнопки управления */}
      {showButton && (
        <div className="absolute top-5 right-5 space-x-4 flex z-20">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded z-20"
            onClick={() => fileInputRef.current?.click()}
          >
            <FaPen />
          </button>
          {currentMediaUrl && (
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded z-20"
              onClick={handleTrashClick}
            >
              <IoTrashBin />
            </button>
          )}
          <input 
            ref={fileInputRef}
            type="file"
            onChange={selectFile}
            className="hidden"
            accept={acceptTypes}
          />
        </div>
      )}
      
      {/* Контент по центру */}
      {children && (
        <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center text-white">
          {children}
        </div>
      )}
    </div>
  );
};

export default MediaWithButton;




// Example of usage:
// Замените в HomeEdit.tsx импорт и использование ImageWithButton на:

// import MediaWithButton from '../text_inputs/MediaWithButton';

// // В компоненте HomeEdit, замените:
// // <ImageWithButton 
// //     image={localMainBgUrl}
// //     isBackground={true}
// //     onImageChange={handleMainBackgroundImageChange}
// // >

// // На:
// <MediaWithButton 
//     media={localMainBgUrl}
//     onMediaChange={handleMainBackgroundImageChange}
//     acceptTypes="image/*" // Только изображения для главного фона
// >
//     <div className="max-w-[700px] mx-auto px-16 flex flex-col justify-center content-center text-center">
//         <div className="flex max-w-screen-lg flex-wrap items-end gap-4 px-4 py-3">
//             <TextEditor 
//                 text={pageData.mainBackground.title} 
//                 format="header" 
//                 isShort={true} 
//                 onSave={handleMainBackgroundTitleChange} 
//             />
//         </div>
//     </div>
// </MediaWithButton>

// // Если хотите использовать для видео секции, можете создать отдельный обработчик:
// const handleVideoSectionMediaChange = useCallback((newMedia) => {
//     console.log('HomeEdit: handleVideoSectionMediaChange called with:', newMedia);
    
//     if (newMedia instanceof File) {
//         const blobUrl = URL.createObjectURL(newMedia);
//         onContentChange('videoSection', {
//             ...pageData.videoSection,
//             videoUrl: blobUrl,
//             videoFile: newMedia // Сохраняем файл отдельно если нужно
//         });
//     } else if (typeof newMedia === 'string') {
//         onContentChange('videoSection', {
//             ...pageData.videoSection,
//             videoUrl: newMedia,
//         });
//     } else if (newMedia === null) {
//         onContentChange('videoSection', {
//             ...pageData.videoSection,
//             videoUrl: '',
//             videoFile: null
//         });
//     }
// }, [onContentChange, pageData.videoSection]);

// // И использовать так:
// <MediaWithButton 
//     media={pageData.videoSection.videoUrl}
//     onMediaChange={handleVideoSectionMediaChange}
//     acceptTypes="image/*,video/*" // И изображения и видео
// >
//     <div className="text-center">
//         <h2 className="text-2xl font-bold text-white mb-4">
//             {pageData.videoSection.title}
//         </h2>
//     </div>
// </MediaWithButton>