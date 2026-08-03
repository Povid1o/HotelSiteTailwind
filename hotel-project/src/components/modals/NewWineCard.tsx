import React, { useState, useCallback, useEffect, useRef } from 'react';
import PhotoSelector from '../text_inputs/PhotoSelector';
import PriceList from '../text_inputs/PriceList';
import DescriptionInput from '../text_inputs/DescriptionInput';
import MultiInputField from '../text_inputs/MultiInputField';
import Button from '../text_inputs/Button';
import { MdModeEdit } from "react-icons/md";

const NewDishCard = ({
  dishName, 
  photos, 
  description, 
  sugar,
  price, 
  alcohol,
  temperature,
  year,
  onDataChange = () => {}
}) => {
  // Локальные состояния для отслеживания изменений
  const [localName, setLocalName] = useState(dishName);
  const [changeNameState, setChangeNameState] = useState(false);
  const [localPhotos, setLocalPhotos] = useState(photos);
  const [localDescription, setLocalDescription] = useState(description);
  const [localSugar, setLocalSugar] = useState(sugar);
  const [localPrice, setLocalPrice] = useState(price);
  const [localAlcohol, setLocalAlcohol] = useState(alcohol);
  const [localTemperature, setLocalTemperature] = useState(temperature);
  const [localYear, setLocalYear] = useState(year);

  // ✅ КРИТИЧНО: Синхронизируем локальное состояние с props после обновлений из backend
  useEffect(() => {
    console.log('NewWineCard: syncing photos from props', photos);
    setLocalPhotos(photos);
  }, [photos]);

  useEffect(() => {
    setLocalName(dishName);
  }, [dishName]);

  useEffect(() => {
    setLocalDescription(description);
  }, [description]);

  useEffect(() => {
    setLocalSugar(sugar);
  }, [sugar]);

  useEffect(() => {
    setLocalPrice(price);
  }, [price]);

  useEffect(() => {
    setLocalAlcohol(alcohol);
  }, [alcohol]);

  useEffect(() => {
    setLocalTemperature(temperature);
  }, [temperature]);

  useEffect(() => {
    setLocalYear(year);
  }, [year]);

  // ✅ Debounce timer для батчинга изменений
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingChangesRef = useRef<any>({});
  const onDataChangeRef = useRef(onDataChange);
  const latestDataRef = useRef<any>({});
  onDataChangeRef.current = onDataChange;
  latestDataRef.current = {
    name: localName,
    images: localPhotos,
    description: localDescription,
    sugar: localSugar,
    price: localPrice,
    alcohol: localAlcohol,
    temperature: localTemperature,
    year: localYear,
  };

  // Do not lose the final edit when the modal is closed immediately.
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        onDataChangeRef.current({ ...latestDataRef.current, ...pendingChangesRef.current });
        pendingChangesRef.current = {};
        debounceTimerRef.current = null;
      }
    };
  }, []);

  // ✅ Мемоизированная функция для батчинга изменений
  const updateDishData = useCallback((updatedData) => {
    // Накапливаем изменения
    pendingChangesRef.current = {
      ...pendingChangesRef.current,
      ...updatedData
    };

    // Очищаем предыдущий таймер
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Устанавливаем новый таймер (500ms debounce)
    debounceTimerRef.current = setTimeout(() => {
      const newData = {
        name: localName,
        images: localPhotos,
        description: localDescription,
        sugar: localSugar,
        price: localPrice,
        alcohol: localAlcohol,
        temperature: localTemperature,
        year: localYear,
        ...pendingChangesRef.current // ✅ Применяем накопленные изменения
      };
      
      console.log('🔄 NewWineCard: Sending batched changes:', Object.keys(pendingChangesRef.current));
      onDataChange(newData);
      
      // Очищаем накопленные изменения
      pendingChangesRef.current = {};
      debounceTimerRef.current = null;
    }, 500); // ✅ 500ms задержка для батчинга
  }, [localName, localPhotos, localDescription, localSugar, localPrice, localAlcohol, localTemperature, localYear, onDataChange]);

  // Мемоизированные обработчики для каждого поля
  const handleNameSave = useCallback((newName) => {
    setLocalName(newName);
    setChangeNameState(false);
    updateDishData({ name: newName });
  }, [updateDishData]);

  const handlePhotosChange = useCallback((newPhotos) => {
    setLocalPhotos(newPhotos);
    updateDishData({ images: newPhotos });
  }, [updateDishData]);

  const handleDescriptionChange = useCallback((newDescription) => {
    setLocalDescription(newDescription);
    updateDishData({ description: newDescription });
  }, [updateDishData]);

  const handleSugarChange = useCallback((newSugar) => {
    setLocalSugar(newSugar);
    updateDishData({ sugar: newSugar });
  }, [updateDishData]);

  const handlePriceChange = useCallback((newPrice) => {
    setLocalPrice(newPrice);
    updateDishData({ price: newPrice });
  }, [updateDishData]);

  const handleYearChange = useCallback((newYear) => {
    setLocalYear(newYear);
    updateDishData({ year: newYear });
  }, [updateDishData]);

  const handleAlcoholChange = useCallback((newAlcohol) => {
    setLocalAlcohol(newAlcohol);
    updateDishData({ alcohol: newAlcohol });
  }, [updateDishData]);

  const handleTemperatureChange = useCallback((newTemperature) => {
    setLocalTemperature(newTemperature);
    updateDishData({ temperature: newTemperature });
  }, [updateDishData]);

  return (
    <section className="relative flex w-full flex-col bg-[#FBF8EF] rounded-lg overflow-x-hidden">
      <header className="flex items-center h-[70px] justify-between whitespace-nowrap border-b border-solid border-b-[#F5EFDB] px-10 py-3">
        <div className="flex items-center gap-4 text-[#201A09]">
          {!changeNameState ? (
            <>
              <h2 className="text-[#201A09] text-lg font-bold leading-tight tracking-[-0.015em]">{localName}</h2>
              <label>
                <Button icon={<MdModeEdit className='h-[20px] w-[20px]'/>} func={() => setChangeNameState(true)}/>
              </label>
            </>
          ) : (
            <DescriptionInput 
              inputField={true} 
              horizontal={true} 
              text={localName}
              onSave={handleNameSave}
            />
          )}
        </div>
      </header>

      <div className="px-20 flex flex-1 justify-center py-5 lg:px-40">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <PhotoSelector 
            photos={localPhotos} 
            header={"Фото Бутылки Вина"}
            onPhotosChange={handlePhotosChange}
            withSlider={true}
          />
          
          <h4 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">Описание</h4>
          <MultiInputField
            initialValues={localDescription}
            onSave={handleDescriptionChange}
          />
          
          <div className="flex justify-stretch">
            <div className="flex flex-1 gap-10 flex-wrap px-4 py-3 justify-around">
              <div className='flex flex-col'>
                <h2 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] text-left pb-3 pt-5">Цена</h2>
                <DescriptionInput 
                  inputField={true} 
                  text={localPrice} 
                  onSave={handlePriceChange}
                />
              </div>

              <div className='flex flex-col'>
                <h2 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] text-left pb-3 pt-5">Год</h2>
                <DescriptionInput 
                  inputField={true} 
                  text={localYear}
                  onSave={handleYearChange} 
                />
              </div>
              
              <div className='flex flex-col'>
                <h3 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] text-left pb-3 pt-5">Алкоголь</h3>
                <DescriptionInput 
                  inputField={true} 
                  text={localAlcohol} 
                  onSave={handleAlcoholChange}
                />
              </div>

              <div className='flex flex-col'>
                <h3 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] text-left pb-3 pt-5">Сахар</h3>
                <DescriptionInput 
                  inputField={true} 
                  text={localSugar} 
                  onSave={handleSugarChange}
                />
              </div>

              <div className='flex flex-col'>
                <h3 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] text-left pb-3 pt-5">Температура подачи</h3>
                <DescriptionInput 
                  inputField={true} 
                  text={localTemperature} 
                  onSave={handleTemperatureChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
 
export default NewDishCard;
