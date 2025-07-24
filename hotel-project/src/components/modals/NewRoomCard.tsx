import React, { useState, useCallback } from 'react';
import PhotoSelector from '../text_inputs/PhotoSelector';
import PriceList from '../text_inputs/PriceList';
import DescriptionInput from '../text_inputs/DescriptionInput';
import MultiInputField from '../text_inputs/MultiInputField';
import Button from '../text_inputs/Button';
import { MdModeEdit } from "react-icons/md";

import "../styles/newRoomCard.css"; 

const NewRoomCard = ({
  roomName,
  photos,
  properties,
  conviniences,
  description,
  prices,
  checkIn,
  checkOut,
  notes,
  onDataChange = () => {}
}) => {
  // Локальные состояния для отслеживания изменений
  const [localName, setLocalName] = useState(roomName);
  const [changeNameState, setChangeNameState] = useState(false);
  const [localPhotos, setLocalPhotos] = useState(photos);
  const [localProperties, setLocalProperties] = useState(properties);
  const [localConviniences, setLocalConviniences] = useState(conviniences);
  const [localDescription, setLocalDescription] = useState(description);
  const [localPrices, setLocalPrices] = useState(prices);
  const [localCheckIn, setLocalCheckIn] = useState(checkIn);
  const [localCheckOut, setLocalCheckOut] = useState(checkOut);
  const [localNotes, setLocalNotes] = useState(notes);

  // Мемоизированная функция для поднятия обновленных данных
  const updateRoomData = useCallback((updatedData) => {
    const newData = {
      name: localName,
      images: localPhotos, // Изменено с photos на images для соответствия структуре
      properties: localProperties,
      conviniences: localConviniences,
      description: localDescription,
      price: localPrices,
      checkIn: localCheckIn,
      checkOut: localCheckOut,
      notes: localNotes,
      ...updatedData
    };
    onDataChange(newData);
  }, [localName, localPhotos, localProperties, localConviniences, localDescription, localPrices, localCheckIn, localCheckOut, localNotes, onDataChange]);

  // Мемоизированные обработчики для каждого поля
  const handleNameSave = useCallback((newName) => {
    setLocalName(newName);
    setChangeNameState(false);
    updateRoomData({ name: newName });
  }, [updateRoomData]);

  const handlePhotosChange = useCallback((newPhotos) => {
    console.log('Photos changed in NewRoomCard:', newPhotos);
    setLocalPhotos(newPhotos);
    updateRoomData({ images: newPhotos });
  }, [updateRoomData]);

  const handlePropertiesChange = useCallback((newProperties) => {
    setLocalProperties(newProperties);
    updateRoomData({ properties: newProperties });
  }, [updateRoomData]);

  const handleConviniencesChange = useCallback((newConviniences) => {
    setLocalConviniences(newConviniences);
    updateRoomData({ conviniences: newConviniences });
  }, [updateRoomData]);

  const handleDescriptionChange = useCallback((newDescription) => {
    setLocalDescription(newDescription);
    updateRoomData({ description: newDescription });
  }, [updateRoomData]);

  const handlePricesChange = useCallback((newPrices) => {
    setLocalPrices(newPrices);
    updateRoomData({ price: newPrices });
  }, [updateRoomData]);

  const handleCheckInChange = useCallback((newCheckIn) => {
    setLocalCheckIn(newCheckIn);
    updateRoomData({ checkIn: newCheckIn });
  }, [updateRoomData]);

  const handleCheckOutChange = useCallback((newCheckOut) => {
    setLocalCheckOut(newCheckOut);
    updateRoomData({ checkOut: newCheckOut });
  }, [updateRoomData]);

  const handleNotesChange = useCallback((newNotes) => {
    setLocalNotes(newNotes);
    updateRoomData({ notes: newNotes });
  }, [updateRoomData]);

  return (
    <div className="relative flex w-full min-h-screen flex-col bg-[#FBF8EF] rounded-lg overflow-x-hidden">
      <header className="flex items-center h-[70px] justify-between whitespace-nowrap border-b border-solid border-b-[#F5EFDB] px-10 py-3">
        <div className="flex items-center gap-4 text-[#201A09]">
          {!changeNameState ? (
            <>
              <h1 className="text-[#201A09] text-lg font-bold leading-tight tracking-[-0.015em]">{localName}</h1>
              <label>
                <Button
                  icon={<MdModeEdit className='h-[20px] w-[20px]' />}
                  func={() => setChangeNameState(true)}
                />
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
            header={"Фото Номера"}
            onPhotosChange={handlePhotosChange}
          />
          
          <div className="flex justify-stretch">
            <div className="flex flex-1 gap-10 flex-wrap px-4 py-3 justify-around">
              <div className='flex flex-col'>
                <h1 className="first-header">Свойства</h1>
                <MultiInputField
                  initialValues={localProperties}
                  onSave={handlePropertiesChange}
                />
              </div>
              <div className='flex flex-col'>
                <h1 className="first-header">Удобства</h1>
                <MultiInputField
                  initialValues={localConviniences}
                  onSave={handleConviniencesChange}
                />
              </div>
            </div>
          </div>

          <h1 className="first-header">Описание</h1>
          <DescriptionInput
            text={localDescription}
            onSave={handleDescriptionChange}
          />

          <h1 className="first-header">Цены</h1>
          <PriceList
            globalPrices={localPrices}
            onSave={handlePricesChange}
          />

          <h1 className="first-header px-4">Правила размещения</h1>
          <div className="flex flex-row flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <h2 className="second-header sm:px-6">Заезд</h2>
              <DescriptionInput
                inputField={true}
                text={localCheckIn}
                onSave={handleCheckInChange}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <h2 className="second-header sm:px-6">Выезд</h2>
              <DescriptionInput
                inputField={true}
                text={localCheckOut}
                onSave={handleCheckOutChange}
              />
            </div>
            <div className="flex-1 min-w-[200px] max-w-[350px]">
              <h2 className="second-header sm:px-4">Примечания</h2>
              <MultiInputField
                initialValues={localNotes}
                onSave={handleNotesChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoomCard;