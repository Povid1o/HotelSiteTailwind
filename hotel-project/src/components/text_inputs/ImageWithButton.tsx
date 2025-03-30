import React, { useState, useRef, useEffect } from 'react';
import { IoTrashBin } from "react-icons/io5";
import { FaPen } from "react-icons/fa";

const ImageWithButton = ({ 
  image, 
  onImageChange, 
  isBackground = false, 
  children 
}) => {
  const [showButton, setShowButton] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!image) {
      setCurrentImage(null);
      return;
    }

    const setImageSrc = async () => {
      try {
        // Если image это File или Blob
        if (image instanceof File || image instanceof Blob) {
          const imageUrl = URL.createObjectURL(image);
          setCurrentImage(imageUrl);
        }
        // Если image это импортированное изображение (webpack)
        else if (typeof image === 'object' && 'default' in image) {
          setCurrentImage(image.default);
        }
        // Если image это строка (URL или base64)
        else if (typeof image === 'string') {
          setCurrentImage(image);
        }
        // Если image это объект с src
        else if (image && image.src) {
          setCurrentImage(image.src);
        }
        else {
          console.warn('Неподдерживаемый формат изображения:', image);
          setCurrentImage(null);
        }
      } catch (error) {
        console.error('Ошибка при установке изображения:', error);
        setCurrentImage(null);
      }
    };

    setImageSrc();

    // Очистка
    return () => {
      if (currentImage && typeof currentImage === 'string' && currentImage.startsWith('blob:')) {
        URL.revokeObjectURL(currentImage);
      }
    };
  }, [image]);

  const selectFile = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        // Проверяем, что файл действительно является изображением
        if (!selectedFile.type.startsWith('image/')) {
          throw new Error('Выбранный файл не является изображением');
        }

        const fileUrl = URL.createObjectURL(selectedFile);
        
        // Проверяем, что изображение загружается корректно
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = fileUrl;
        });

        setCurrentImage(fileUrl);
        
        if (onImageChange) {
          onImageChange(selectedFile);
        }
      } catch (error) {
        console.error('Ошибка при загрузке изображения:', error);
        alert('Не удалось загрузить изображение. Пожалуйста, попробуйте другой файл.');
      }
    }
  };

  const handleMouseOver = () => setShowButton(true);
  const handleMouseOut = () => setShowButton(false);

  const handleTrashClick = () => {
    if (currentImage && currentImage.startsWith('blob:')) {
      URL.revokeObjectURL(currentImage);
    }
    setCurrentImage(null);
    if (onImageChange) {
      onImageChange(null);
    }
  };

  // Background image version
  if (isBackground) {
    return (
      <div
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        className="relative w-full h-screen bg-no-repeat bg-cover bg-gray-300 bg-blend-multiply rounded-xl"
        style={{ 
          backgroundImage: currentImage ? `url("${currentImage}")` : 'none' 
        }}
      >
        {showButton && (
          <div className="absolute top-5 right-5 space-x-4 flex z-20">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded z-20"
              onClick={() => fileInputRef.current.click()}
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

  // Regular image version
  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="relative w-[95%] mx-auto"
    >
      {currentImage ? (
        <img 
          src={currentImage} 
          className="bg-cover hover:backdrop-blur-sm backdrop-brightness-75 transition duration-300 w-full h-full object-cover"
          alt="dynamic"
          onError={(e) => {
            console.error('Ошибка загрузки изображения:', e);
            setCurrentImage(null);
          }}
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
            onClick={() => fileInputRef.current.click()}
          >
            <FaPen />
          </button>

          {currentImage && (
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