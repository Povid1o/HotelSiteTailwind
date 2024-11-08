import React, { useState, useRef } from 'react';
import { IoTrashBin } from "react-icons/io5";
import { FaPen } from "react-icons/fa";

const ImageWithButton = ({ image, isBackground = false, children }) => {
  const [showButton, setShowButton] = useState(false);
  const [file, setFile] = useState(image.src || image);
  const fileInputRef = useRef(null);

  const selectFile = (e) => {
    const selectedFile = URL.createObjectURL(e.target.files[0]);
    setFile(selectedFile);
  };

  const handleMouseOver = () => {
    setShowButton(true);
  };

  const handleMouseOut = () => {
    setShowButton(false);
  };

  const handleTrashClick = () => {
    setFile(null);
  };

  // Когда isBackground true, мы используем фоновое изображение
  if (isBackground) {
    return (
      <div
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        className="relative w-full h-screen bg-no-repeat bg-cover bg-gray-300 bg-blend-multiply rounded-xl"
        style={{ backgroundImage: `url(${file})` }}
      >
        {/* Показываем кнопки редактирования, если наведено */}
        {showButton && (
          <div className="absolute top-5 right-5 space-x-4 flex z-20">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded z-20"
              onClick={() => fileInputRef.current.click()}
            >
              <FaPen />
            </button>

            {/* <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              onClick={handleTrashClick}
            >
              <IoTrashBin />
            </button> */}

            <input 
              ref={fileInputRef}
              type="file"
              onChange={selectFile}
              className="hidden"
            />
          </div>
        )}
        
        {/* Контент, который передается через children */}
        {children && (
          <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center text-white">
            {children}
          </div>
        )}
      </div>
    );
  }

  // Если isBackground false (или не передан), отображаем обычное изображение
  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="relative w-[95%] mx-auto"
    >
      <img 
        src={file} 
        className="bg-cover hover:backdrop-blur-sm backdrop-brightness-75 transition duration-300 w-full h-full object-cover"
        alt="dynamic"
      />
      
      {showButton && (
        <div className="mx-auto my-auto">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => fileInputRef.current.click()}
          >
            <FaPen />
          </button>

          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={handleTrashClick}
          >
            <IoTrashBin />
          </button>

          <input 
            ref={fileInputRef}
            type="file"
            onChange={selectFile}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ImageWithButton;
