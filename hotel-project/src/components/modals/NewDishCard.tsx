import React, { useState, useCallback } from 'react';
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
  descriptionBrief, 
  price, 
  weight,
  onDataChange = () => {}
}) => {
  // Локальные состояния для отслеживания изменений
  const [localName, setLocalName] = useState(dishName);
  const [changeNameState, setChangeNameState] = useState(false);
  const [localPhotos, setLocalPhotos] = useState(photos);
  const [localDescription, setLocalDescription] = useState(description);
  const [localDescriptionBrief, setLocalDescriptionBrief] = useState(descriptionBrief);
  const [localPrice, setLocalPrice] = useState(price);
  const [localWeight, setLocalWeight] = useState(weight);

  // Мемоизированная функция для поднятия обновленных данных
  const updateDishData = useCallback((updatedData) => {
    const newData = {
      name: localName,
      images: localPhotos,
      description: localDescriptionBrief,
      descriptionFull: localDescription,
      price: localPrice,
      weight: localWeight,
      ...updatedData
    };
    onDataChange(newData);
  }, [localName, localPhotos, localDescription, localDescriptionBrief, localPrice, localWeight, onDataChange]);

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
    updateDishData({ descriptionFull: newDescription });
  }, [updateDishData]);

  const handleDescriptionBriefChange = useCallback((newDescriptionBrief) => {
    setLocalDescriptionBrief(newDescriptionBrief);
    updateDishData({ description: newDescriptionBrief });
  }, [updateDishData]);

  const handlePriceChange = useCallback((newPrice) => {
    setLocalPrice(newPrice);
    updateDishData({ price: newPrice });
  }, [updateDishData]);

  const handleWeightChange = useCallback((newWeight) => {
    setLocalWeight(newWeight);
    updateDishData({ weight: newWeight });
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
            header={"Фото Блюда"}
            onPhotosChange={handlePhotosChange}
          />
          
          <h4 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">Описание</h4>
          <DescriptionInput 
            text={localDescription}
            onSave={handleDescriptionChange}
          />

          <h4 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">Краткое описание</h4>
          <DescriptionInput 
            text={localDescriptionBrief}
            onSave={handleDescriptionBriefChange}
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
                <h3 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] text-left pb-3 pt-5">Вес</h3>
                <DescriptionInput 
                  inputField={true} 
                  text={localWeight} 
                  onSave={handleWeightChange}
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