import React, { useState } from 'react';
import "./styles/shop.css"
import { CiSearch } from 'react-icons/ci';

import RangeSlider from './RangeSlider';
import Sorting from './Sorting';
import CheckboxGroup from './Checkbox';

// Интерфейс для компонента фильтров
interface FiltersProps {
  isMobile: boolean;
  yearRange: [number, number];
  setYearRange: (range: [number, number]) => void;
  onSortChange?: (sortOption: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ isMobile, yearRange, setYearRange, onSortChange = () => {} }) => {
  // Состояния для фильтров
  const [showFilters, setShowFilters] = useState(false);
  const [wineTypes, setWineTypes] = useState({
    dry: false,
    sweet: false,
    semiSweet: false,
    semiDry: false
  });

  // Обработчик изменения типа вина
  const handleWineTypeChange = (type: keyof typeof wineTypes) => {
    setWineTypes({
      ...wineTypes,
      [type]: !wineTypes[type]
    });
  };

  // Обработчик изменения диапазона годов
  const handleYearChange = (startYear: number, endYear: number) => {
    setYearRange([startYear, endYear]);
  };

  // Мобильная версия фильтров
  if (isMobile) {
    return (
      <div className="p-4 border-b">
        <div className="flex justify-between mb-4">
          <button 
            className="flex items-center text-gray-600"
            onClick={() => setShowFilters(!showFilters)}
          >
            Фильтры
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <Sorting isMobile={true} onSortChange={onSortChange}/>
        </div>
        
        {/* Выпадающие фильтры (отображаются при showFilters === true) */}
        {showFilters && (
          <div className="mt-4 border-t pt-4">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Тип вина</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="mobile-dry" 
                    className="mr-2"
                    checked={wineTypes.dry}
                    onChange={() => handleWineTypeChange('dry')}
                  />
                  <label htmlFor="mobile-dry">Сухие</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="mobile-sweet" 
                    className="mr-2"
                    checked={wineTypes.sweet}
                    onChange={() => handleWineTypeChange('sweet')}
                  />
                  <label htmlFor="mobile-sweet">Сладкие</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="mobile-semi-sweet" 
                    className="mr-2"
                    checked={wineTypes.semiSweet}
                    onChange={() => handleWineTypeChange('semiSweet')}
                  />
                  <label htmlFor="mobile-semi-sweet">Полусладкие</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="mobile-semi-dry" 
                    className="mr-2"
                    checked={wineTypes.semiDry}
                    onChange={() => handleWineTypeChange('semiDry')}
                  />
                  <label htmlFor="mobile-semi-dry">Полусухие</label>
                </div>
              </div>
            </div>
            
            <RangeSlider 
            title="Год" 
            minValue={1970} 
            maxValue={2025} 
            initialMin={1970} 
            initialMax={2025} 
            />
          </div>
        )}
      </div>
    );
  }

  // Десктопная версия фильтров (боковая панель)
  return (
    <>
      <div className="mb-4">
        <button className="flex items-center text-wine-primary font-medium">
          Красные
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <CheckboxGroup
        isMobile={false}
        content={[
          { id: '1', label: 'Cухие' },
          { id: '2', label: 'Полусухие' },
          { id: '3', label: 'Полусладкие' },
          { id: '3', label: 'Сладкие' },
        ]}
      />
      
      <div className="mb-6">
        <RangeSlider 
            title="Год" 
            minValue={1970} 
            maxValue={2025} 
            initialMin={1970} 
            initialMax={2025} 
        />
        {/* <div className="mb-2">
          <span className="text-sm">{yearRange[0]} - {yearRange[1]}</span>
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div 
            className="absolute h-2 bg-wine-primary rounded-full"
            style={{ left: '10%', right: '60%' }}
          ></div>
          <div 
            className="absolute h-4 w-4 bg-wine-primary rounded-full -mt-1 cursor-pointer" 
            style={{ left: '10%' }}
            onMouseDown={() => {}}
          ></div>
          <div 
            className="absolute h-4 w-4 bg-wine-primary rounded-full -mt-1 cursor-pointer" 
            style={{ left: '40%' }}
            onMouseDown={() => {}}
          ></div>
        </div> */}
      </div>
    </>
  );
};

export default Filters;