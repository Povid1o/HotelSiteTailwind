import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IoTrashBin } from "react-icons/io5";
import { FaPen } from "react-icons/fa";
import { getMediaUrl } from '../../utils/contentHelpers';

interface BackgroundContentEditProps {
  backgroundMedia?: string | File | null;
  onMediaChange?: (media: File | string | null) => void;
  children?: React.ReactNode;
  className?: string;
  acceptedTypes?: string; // например "image/*,video/*" или "image/*"
}

const BackgroundContentEdit: React.FC<BackgroundContentEditProps> = ({ 
  backgroundMedia, 
  onMediaChange, 
  children,
  className = "",
  acceptedTypes = "image/jpeg,image/png,image/webp,video/mp4,video/webm"
}) => {
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [currentMediaUrl, setCurrentMediaUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentBlobRef = useRef<string | null>(null);

  // Функция для определения типа медиа
  const getMediaType = useCallback((mediaSource: string | File): 'image' | 'video' | null => {
    if (mediaSource instanceof File) {
      if (mediaSource.type.startsWith('image/')) return 'image';
      if (mediaSource.type.startsWith('video/')) return 'video';
      return null;
    } else if (typeof mediaSource === 'string') {
      // Простая проверка по расширению файла в URL
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
      
      const lowerUrl = mediaSource.toLowerCase();
      
      if (imageExtensions.some(ext => lowerUrl.includes(ext))) return 'image';
      if (videoExtensions.some(ext => lowerUrl.includes(ext))) return 'video';
      
      // По умолчанию считаем изображением, если не можем определить
      return 'image';
    }
    return null;
  }, []);

  // Функция для получения display URL из любого типа медиа
  const getDisplayUrl = useCallback((mediaSource: string | File | null): string => {
    if (!mediaSource) return '';
    
    if (mediaSource instanceof File) {
      const blobUrl = URL.createObjectURL(mediaSource);
      return blobUrl;
    } else if (typeof mediaSource === 'string') {
      return getMediaUrl(mediaSource);
    }
    
    return '';
  }, []);

  // Обновляем состояние когда backgroundMedia изменяется извне
  useEffect(() => {
    console.log('BackgroundContentEdit: backgroundMedia prop changed', backgroundMedia);
    
    // Очищаем предыдущий blob URL если он был создан нами
    if (currentBlobRef.current && currentBlobRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(currentBlobRef.current);
      currentBlobRef.current = null;
    }

    const newUrl = getDisplayUrl(backgroundMedia);
    const newMediaType = backgroundMedia ? getMediaType(backgroundMedia) : null;
    
    // Если новое медиа - это File, сохраняем ссылку на blob URL для последующей очистки
    if (backgroundMedia instanceof File && newUrl.startsWith('blob:')) {
      currentBlobRef.current = newUrl;
    }
    
    setCurrentMediaUrl(newUrl);
    setMediaType(newMediaType);
  }, [backgroundMedia, getDisplayUrl, getMediaType]);

  // Очистка blob URL при размонтировании компонента
  useEffect(() => {
    return () => {
      if (currentBlobRef.current && currentBlobRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(currentBlobRef.current);
        currentBlobRef.current = null;
      }
    };
  }, []);

  const validateMediaFile = useCallback(async (file: File): Promise<boolean> => {
    const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
    const isVideo = ['video/mp4', 'video/webm'].includes(file.type);
    
    if (!isImage && !isVideo) {
      throw new Error('Выбранный файл не является изображением или видео');
    }

    if (isImage) {
      // Проверяем изображение через создание Image объекта
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
    } else if (isVideo) {
      // Для видео просто проверяем, что это действительно видео файл
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const testUrl = URL.createObjectURL(file);
        
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(testUrl);
          resolve(true);
        };
        
        video.onerror = () => {
          URL.revokeObjectURL(testUrl);
          reject(new Error('Файл поврежден или не является корректным видео'));
        };
        
        video.src = testUrl;
      });
    }
    
    return true;
  }, []);

  const selectFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    console.log(`BackgroundContentEdit: attempting to load file: ${selectedFile.name}, type: ${selectedFile.type}`);
    
    try {
      // Валидируем файл
      await validateMediaFile(selectedFile);

      console.log('BackgroundContentEdit: file validation passed, calling onMediaChange');
      
      // Вызываем callback с File объектом
      if (onMediaChange) {
        onMediaChange(selectedFile);
      }

      // Очищаем input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('BackgroundContentEdit: validation error:', error);
      alert(`Ошибка загрузки файла: ${(error as Error).message}`);
      
      // Очищаем input при ошибке
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [onMediaChange, validateMediaFile]);

  const handleMouseOver = () => setShowButtons(true);
  const handleMouseOut = () => setShowButtons(false);

  const handleTrashClick = useCallback(() => {
    console.log('BackgroundContentEdit: removing media');
    
    if (onMediaChange) {
      onMediaChange(null);
    }
  }, [onMediaChange]);

  const handleMediaError = useCallback((e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>) => {
    console.error('BackgroundContentEdit: media load error:', e);
    
    if (onMediaChange) {
      onMediaChange(null);
    }
  }, [onMediaChange]);

  const renderBackgroundMedia = () => {
    if (!currentMediaUrl) {
      return (
        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-600">
          <span>Нет фонового медиа</span>
        </div>
      );
    }

    if (mediaType === 'video') {
      return (
        <video 
          key={currentMediaUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          onError={handleMediaError}
        >
          <source src={currentMediaUrl} />
          Ваш браузер не поддерживает видео.
        </video>
      );
    } else {
      return (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${currentMediaUrl}")` }}
        />
      );
    }
  };

  return (
    <div
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
      className={`relative w-full h-screen overflow-hidden rounded-xl ${className}`}
    >
      {/* Фоновое медиа */}
      {renderBackgroundMedia()}
      
      {/* Затемняющий оверлей */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      
      {/* Кнопки управления */}
      {showButtons && (
        <div className="absolute top-5 right-5 space-x-4 flex z-20">
          <button
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200"
            onClick={() => fileInputRef.current?.click()}
            title="Изменить фон"
          >
            <FaPen />
          </button>
          {currentMediaUrl && (
            <button
              className="bg-red-500 bg-opacity-90 hover:bg-opacity-100 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200"
              onClick={handleTrashClick}
              title="Удалить фон"
            >
              <IoTrashBin />
            </button>
          )}
          <input 
            ref={fileInputRef}
            type="file"
            onChange={selectFile}
            className="hidden"
            accept={acceptedTypes}
          />
        </div>
      )}
      
      {/* Контент по центру */}
      {children && (
        <div className="absolute inset-0 z-10 flex items-center justify-center text-white px-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default BackgroundContentEdit;
