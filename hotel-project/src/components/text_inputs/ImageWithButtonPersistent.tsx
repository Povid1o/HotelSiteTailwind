import React, { useRef, useEffect, useCallback, useState } from 'react';
import { IoTrashBin } from "react-icons/io5";
import { FaPen } from "react-icons/fa";
import { getMediaUrl } from '../../utils/contentHelpers';

const ImageWithButtonPersistent = ({ 
  image, 
  onImageChange, 
  isBackground = false, 
  children 
}) => {
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const fileInputRef = useRef(null);
  const currentBlobRef = useRef(null);

  // Функция для получения display URL из любого типа изображения
  const getDisplayUrl = useCallback((imageSource) => {
    if (!imageSource) return '';
    
    if (imageSource instanceof File) {
      // Если это File объект, создаем blob URL
      const blobUrl = URL.createObjectURL(imageSource);
      return blobUrl;
    } else if (typeof imageSource === 'string') {
      // Если это строка (URL), преобразуем относительные пути в полные URL
      return getMediaUrl(imageSource);
    }
    
    return '';
  }, []);

  // Обновляем currentImageUrl когда image изменяется извне
  useEffect(() => {
    console.log('ImageWithButtonPersistent: image prop changed', image);
    
    // Очищаем предыдущий blob URL если он был создан нами
    if (currentBlobRef.current && currentBlobRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(currentBlobRef.current);
      currentBlobRef.current = null;
    }

    const newUrl = getDisplayUrl(image);
    
    // Если новое изображение - это File, сохраняем ссылку на blob URL для последующей очистки
    if (image instanceof File && newUrl.startsWith('blob:')) {
      currentBlobRef.current = newUrl;
    }
    
    setCurrentImageUrl(newUrl);
  }, [image, getDisplayUrl]);

  // Очистка blob URL при размонтировании компонента
  useEffect(() => {
    return () => {
      if (currentBlobRef.current && currentBlobRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(currentBlobRef.current);
        currentBlobRef.current = null;
      }
    };
  }, []);

  const validateImageFile = useCallback(async (file) => {
    // Проверяем MIME тип
    if (!file.type.startsWith('image/')) {
      throw new Error('Выбранный файл не является изображением');
    }

    // Дополнительная проверка через создание Image объекта
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
  }, []);

  const selectFile = useCallback(async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    console.log(`ImageWithButtonPersistent: attempting to load file: ${selectedFile.name}, type: ${selectedFile.type}`);
    
    try {
      // Валидируем файл
      await validateImageFile(selectedFile);

      console.log('ImageWithButtonPersistent: file validation passed, calling onImageChange');
      
      // Вызываем callback с File объектом
      if (onImageChange) {
        onImageChange(selectedFile);
      }

      // Очищаем input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('ImageWithButtonPersistent: validation error:', error);
      alert(`Ошибка загрузки изображения: ${error.message}`);
      
      // Очищаем input при ошибке
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [onImageChange, validateImageFile]);

  const handleTrashClick = useCallback(() => {
    console.log('ImageWithButtonPersistent: removing image');
    
    if (onImageChange) {
      onImageChange(null);
    }
  }, [onImageChange]);

  const handleImageError = useCallback((e) => {
    console.error('ImageWithButtonPersistent: image load error:', e);
    // Не удаляем изображение автоматически при ошибке загрузки
    // Просто логируем ошибку, а компонент покажет placeholder
  }, []);

  if (isBackground) {
    return (
      <div
        className="relative w-full h-screen bg-no-repeat bg-cover bg-gray-300 bg-blend-multiply rounded-xl"
        style={{ 
          backgroundImage: currentImageUrl ? `url("${currentImageUrl}")` : 'none' 
        }}
      >
        {/* Кнопки всегда видимы */}
        <div className="absolute top-5 right-5 space-x-4 flex z-20">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded z-20 shadow-lg"
            onClick={() => fileInputRef.current?.click()}
            title="Изменить изображение"
          >
            <FaPen />
          </button>
          {currentImageUrl && (
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded z-20 shadow-lg"
              onClick={handleTrashClick}
              title="Удалить изображение"
            >
              <IoTrashBin />
            </button>
          )}
          <input 
            ref={fileInputRef}
            type="file"
            onChange={selectFile}
            className="hidden"
            accept="image/*"
          />
        </div>
        {children && (
          <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center text-white">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-[95%] mx-auto">
      {currentImageUrl ? (
        <img 
          key={currentImageUrl} // Ключ для принудительного перерендера
          src={currentImageUrl} 
          className="w-full h-full object-cover rounded-lg"
          alt="dynamic"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
          No Image
        </div>
      )}
      {/* Кнопки всегда видимы, позиционированы в правом верхнем углу */}
      <div className="absolute top-2 right-2 flex space-x-2 z-10">
        <button
          className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 font-bold p-2 rounded-full shadow-lg transition-all duration-200"
          onClick={() => fileInputRef.current?.click()}
          title="Изменить изображение"
        >
          <FaPen className="w-4 h-4" />
        </button>
        {currentImageUrl && (
          <button
            className="bg-red-500 bg-opacity-90 hover:bg-opacity-100 text-white font-bold p-2 rounded-full shadow-lg transition-all duration-200"
            onClick={handleTrashClick}
            title="Удалить изображение"
          >
            <IoTrashBin className="w-4 h-4" />
          </button>
        )}
        <input 
          ref={fileInputRef}
          type="file"
          onChange={selectFile}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default ImageWithButtonPersistent;

