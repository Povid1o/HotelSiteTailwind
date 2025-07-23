import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IoTrashBin } from "react-icons/io5";
import { FaPen } from "react-icons/fa";

const ImageWithButton = ({ 
  image, 
  onImageChange, 
  isBackground = false, 
  children 
}) => {
  const [showButton, setShowButton] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(image);
  const fileInputRef = useRef(null);
  const currentBlobRef = useRef(null);

  // Обновляем currentImageUrl когда image изменяется извне
  useEffect(() => {
    if (image !== currentImageUrl) {
      setCurrentImageUrl(image);
    }
  }, [image]);

  // Очистка blob URL только при размонтировании компонента
  useEffect(() => {
    return () => {
      if (currentBlobRef.current && currentBlobRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(currentBlobRef.current);
        currentBlobRef.current = null;
      }
    };
  }, []);

  const selectFile = useCallback(async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    console.log(`Replacing with file: ${selectedFile.name}`);
    
    try {
      if (!selectedFile.type.startsWith('image/')) {
        throw new Error('Выбранный файл не является изображением');
      }

      // Проверяем, что файл может быть загружен как изображение
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        const testUrl = URL.createObjectURL(selectedFile);
        img.src = testUrl;
        // Освобождаем тестовый URL после проверки
        img.onload = () => {
          URL.revokeObjectURL(testUrl);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(testUrl);
          reject();
        };
      });

      // Очищаем предыдущий blob URL если он есть
      if (currentBlobRef.current && currentBlobRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(currentBlobRef.current);
      }

      // Создаем новый blob URL
      const newBlobUrl = URL.createObjectURL(selectedFile);
      currentBlobRef.current = newBlobUrl;
      setCurrentImageUrl(newBlobUrl);

      if (onImageChange) {
        onImageChange(selectedFile);
      }

      // Очищаем input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      alert('Не удалось загрузить изображение. Пожалуйста, попробуйте другой файл.');
    }
  }, [onImageChange]);

  const handleMouseOver = () => setShowButton(true);
  const handleMouseOut = () => setShowButton(false);

  const handleTrashClick = useCallback(() => {
    // Очищаем blob URL перед удалением
    if (currentBlobRef.current && currentBlobRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(currentBlobRef.current);
      currentBlobRef.current = null;
    }
    
    setCurrentImageUrl(null);
    
    if (onImageChange) {
      onImageChange(null);
    }
  }, [onImageChange]);

  const handleImageError = useCallback((e) => {
    console.error('Ошибка загрузки изображения:', e);
    
    // Очищаем проблемный blob URL
    if (currentBlobRef.current && currentBlobRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(currentBlobRef.current);
      currentBlobRef.current = null;
    }
    
    setCurrentImageUrl(null);
    
    if (onImageChange) {
      onImageChange(null);
    }
  }, [onImageChange]);

  if (isBackground) {
    return (
      <div
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        className="relative w-full h-screen bg-no-repeat bg-cover bg-gray-300 bg-blend-multiply rounded-xl"
        style={{ 
          backgroundImage: currentImageUrl ? `url("${currentImageUrl}")` : 'none' 
        }}
      >
        {showButton && (
          <div className="absolute top-5 right-5 space-x-4 flex z-20">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded z-20"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaPen />
            </button>
            <input 
              ref={fileInputRef}
              type="file"
              onChange={selectFile}
              className="hidden"
              accept="image/*"
            />
          </div>
        )}
        {children && (
          <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center text-white">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="relative w-[95%] mx-auto"
    >
      {currentImageUrl ? (
        <img 
          key={currentImageUrl} // Ключ для принудительного перерендера
          src={currentImageUrl} 
          className="bg-cover hover:backdrop-blur-sm backdrop-brightness-75 transition duration-300 w-full h-full object-cover"
          alt="dynamic"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}
      {showButton && (
        <div className="absolute inset-0 flex items-center justify-center space-x-4">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => fileInputRef.current?.click()}
          >
            <FaPen />
          </button>
          {currentImageUrl && (
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
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
            accept="image/*"
          />
        </div>
      )}
    </div>
  );
};

export default ImageWithButton;