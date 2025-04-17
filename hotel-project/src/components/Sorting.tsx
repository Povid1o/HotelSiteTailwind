import React, { useState } from 'react';
import "./styles/shop.css"

// Интерфейс для компонента сортировки
interface SortingProps {
  isMobile: boolean;
  onSortChange?: (sortOption: string) => void;
}

const Sorting: React.FC<SortingProps> = ({ isMobile, onSortChange = () => {} }) => {
  // Состояния для выпадающего меню сортировки
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('По умолчанию');
  
  // Опции сортировки
  const sortOptions = [
    'По умолчанию',
    'По цене (возрастание)',
    'По цене (убывание)',
    'По названию (А-Я)',
    'По названию (Я-А)',
    'По году (новые)',
    'По году (старые)'
  ];
  
  // Обработчик выбора опции сортировки
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSortChange(option);
  };

  // Мобильная версия сортировки
  if (isMobile) {
    return (
      <div className="relative">
        <button 
          className="flex items-center text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          Сортировка
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Выпадающее меню сортировки */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <div className="py-1">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    selectedOption === option ? 'bg-gray-100 text-wine-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Десктопная версия сортировки
  return (
    <div className="relative">
      <button 
        className="flex items-center border p-2 rounded-md hover:border-wine-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Выпадающее меню сортировки */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option}
                className={`block px-4 py-2 text-sm w-full text-left ${
                  selectedOption === option ? 'bg-gray-100 text-wine-primary' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sorting;
