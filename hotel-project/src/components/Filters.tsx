import React, { useState, useCallback, useEffect } from 'react';
import "./styles/shop.css"
import { CiSearch } from 'react-icons/ci';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

import RangeSlider from './RangeSlider';
import Sorting from './Sorting';
import CheckboxGroup from './Checkbox';

// Интерфейс для компонента фильтров
interface FiltersProps {
  isMobile: boolean;
  yearRange: [number, number];
  setYearRange: (min: number, max: number) => void;
  onSortChange?: (sortOption: string) => void;
  // Фильтры по типу вина
  selectedTypes?: string[];
  onTypeChange?: (value: string[]) => void;
  // Фильтры по сладости
  selectedSweetness?: string[];
  onSweetnessChange?: (value: string[]) => void;
  // Сброс фильтров
  onResetFilters?: () => void;
  // Минимальный и максимальный год для слайдера
  minYear?: number;
  maxYear?: number;
}

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

const Filters: React.FC<FiltersProps> = ({ 
  isMobile, 
  yearRange, 
  setYearRange, 
  onSortChange = () => {},
  selectedTypes = [],
  onTypeChange = () => {},
  selectedSweetness = [],
  onSweetnessChange = () => {},
  onResetFilters = () => {},
  minYear = 1970,
  maxYear = 2025
}) => {
  // Состояния для фильтров
  const [showFilters, setShowFilters] = useState(false);
  
  // Локальные состояния для временного хранения изменений
  const [localTypes, setLocalTypes] = useState<string[]>(selectedTypes);
  const [localSweetness, setLocalSweetness] = useState<string[]>(selectedSweetness);
  const [localYearRange, setLocalYearRange] = useState<[number, number]>(yearRange);
  
  // Флаг, показывающий, что есть несохраненные изменения
  const [hasChanges, setHasChanges] = useState(false);
  
  // Используем единственное состояние для Accordion, чтобы только один мог быть открыт
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  
  // Синхронизация локальных состояний с пропсами при их изменении
  useEffect(() => {
    setLocalTypes(selectedTypes);
    setLocalSweetness(selectedSweetness);
    setLocalYearRange(yearRange);
    setHasChanges(false);
  }, [selectedTypes, selectedSweetness, yearRange]);
 
  // Обработчик открытия/закрытия Accordion
  const handleOpen = (value: number) => {
    setOpenAccordion(openAccordion === value ? null : value);
  };

  // Обработчики изменения локальных состояний
  const handleLocalTypeChange = useCallback((value: string) => {
    setLocalTypes(prev => {
      const newTypes = prev.includes(value) 
        ? prev.filter(type => type !== value)
        : [...prev, value];
      setHasChanges(true);
      return newTypes;
    });
  }, []);

  const handleLocalSweetnessChange = useCallback((value: string) => {
    setLocalSweetness(prev => {
      const newSweetness = prev.includes(value) 
        ? prev.filter(sweet => sweet !== value)
        : [...prev, value];
      setHasChanges(true);
      return newSweetness;
    });
  }, []);

  const handleLocalYearChange = useCallback((startYear: number, endYear: number) => {
    // Проверяем, что значения валидны
    if (isNaN(startYear) || isNaN(endYear)) return;
    
    setLocalYearRange([Number(startYear), Number(endYear)]);
    setHasChanges(true);
  }, []);

  // Обработчик применения фильтров
  const handleApplyFilters = useCallback(() => {
    // Отправляем все изменения наверх
    onTypeChange(localTypes);
    onSweetnessChange(localSweetness);
    setYearRange(localYearRange[0], localYearRange[1]);
    setHasChanges(false);
    
    // Если мобильная версия, можно автоматически закрыть фильтры
    if (isMobile) {
      setShowFilters(false);
    }
  }, [localTypes, localSweetness, localYearRange, onTypeChange, onSweetnessChange, setYearRange, isMobile]);

  // Обработчик сброса фильтров
  const handleLocalReset = useCallback(() => {
    setLocalTypes([]);
    setLocalSweetness([]);
    setLocalYearRange([minYear, maxYear]);
    setHasChanges(true);
  }, [minYear, maxYear]);

  // Типы вин для фильтрации
  const wineTypes = [
    { id: 'red', label: 'Красное', value: 'Красное' },
    { id: 'white', label: 'Белое', value: 'Белое' },
  ];

  // Сладость вин для фильтрации
  const wineSweetness = [
    { id: 'dry', label: 'Сухое', value: 'Сухое' },
    { id: 'semi-dry', label: 'Полусухое', value: 'Полусухое' },
    { id: 'semi-sweet', label: 'Полусладкое', value: 'Полусладкое' },
    { id: 'sweet', label: 'Сладкое', value: 'Сладкое' },
  ];

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
            <Accordion open={openAccordion === 1} icon={<Icon id={1} open={openAccordion} />}>
              <AccordionHeader onClick={() => handleOpen(1)}>Тип вина</AccordionHeader>
              <AccordionBody>
                <CheckboxGroup
                  isMobile={true}
                  content={wineTypes}
                  selectedValues={localTypes}
                  onChange={handleLocalTypeChange}
                  groupName="type-mobile"
                />
              </AccordionBody>
            </Accordion>
            
            <Accordion open={openAccordion === 2} icon={<Icon id={2} open={openAccordion} />}>
              <AccordionHeader onClick={() => handleOpen(2)}>Сладость</AccordionHeader>
              <AccordionBody>
                <CheckboxGroup
                  isMobile={true}
                  content={wineSweetness}
                  selectedValues={localSweetness}
                  onChange={handleLocalSweetnessChange}
                  groupName="sweetness-mobile"
                />
              </AccordionBody>
            </Accordion>
            
            <div className="mt-4">
              <RangeSlider 
                title="Год" 
                minValue={minYear} 
                maxValue={maxYear} 
                initialMin={localYearRange[0]} 
                initialMax={localYearRange[1]} 
                onChange={handleLocalYearChange}
              />
            </div>
            
            <div className="flex flex-col space-y-3 mt-4">
              {hasChanges && (
                <button 
                  onClick={handleApplyFilters}
                  className="w-full py-2 px-4 bg-[#80143c] text-white rounded hover:bg-[#70042c] transition-colors"
                >
                  Применить фильтры
                </button>
              )}
              
              <button 
                onClick={onResetFilters}
                className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Десктопная версия фильтров (боковая панель)
  return (
    <>
      <Accordion open={openAccordion === 1} icon={<Icon id={1} open={openAccordion} />}>
        <AccordionHeader onClick={() => handleOpen(1)}>Тип вина</AccordionHeader>
        <AccordionBody>
          <CheckboxGroup
            isMobile={false}
            content={wineTypes}
            selectedValues={localTypes}
            onChange={handleLocalTypeChange}
            groupName="type-desktop"
          />
        </AccordionBody>
      </Accordion>
      
      <Accordion open={openAccordion === 2} icon={<Icon id={2} open={openAccordion} />}>
        <AccordionHeader onClick={() => handleOpen(2)}>Сладость</AccordionHeader>
        <AccordionBody>
          <CheckboxGroup
            isMobile={false}
            content={wineSweetness}
            selectedValues={localSweetness}
            onChange={handleLocalSweetnessChange}
            groupName="sweetness-desktop"
          />
        </AccordionBody>
      </Accordion>
      
      <div className="my-6">
        <RangeSlider 
          title="Год" 
          minValue={minYear} 
          maxValue={maxYear} 
          initialMin={localYearRange[0]} 
          initialMax={localYearRange[1]} 
          onChange={handleLocalYearChange}
        />
      </div>
      
      <div className="flex flex-col space-y-3">
        {hasChanges && (
          <button 
            onClick={handleApplyFilters}
            className="w-full py-2 px-4 bg-[#80143c] text-white rounded hover:bg-[#70042c] transition-colors"
          >
            Применить фильтры
          </button>
        )}
        
        <button 
          onClick={onResetFilters}
          className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          Сбросить фильтры
        </button>
        
      </div>
    </>
  );
};

export default Filters;