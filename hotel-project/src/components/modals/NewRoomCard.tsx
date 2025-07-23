import React, { useState } from 'react';
import PhotoSelector from '../text_inputs/PhotoSelector';
import PriceList from '../text_inputs/PriceList';
import DescriptionInput from '../text_inputs/DescriptionInput';
import MultiInputField from '../text_inputs/MultiInputField';
import Button from '../text_inputs/Button';
import { MdModeEdit } from "react-icons/md";

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

  // Функция для поднятия обновленных данных
  const updateRoomData = (updatedData) => {
    const newData = {
      name: localName,
      photos: localPhotos,
      properties: localProperties,
      conviniences: localConviniences,
      description: localDescription,
      price: localPrices,
      checkStandart: { checkIn: localCheckIn, checkOut: localCheckOut },
      notes: localNotes,
      ...updatedData
    };
    onDataChange(newData);
  };

  // Обработчики для каждого поля
  const handleNameSave = (newName) => {
    setLocalName(newName);
    setChangeNameState(false);
    updateRoomData({ name: newName });
  };

  const handlePhotosChange = (newPhotos) => {
    setLocalPhotos(newPhotos);
    updateRoomData({ photos: newPhotos });
  };

  const handlePropertiesChange = (newProperties) => {
    setLocalProperties(newProperties);
    updateRoomData({ properties: newProperties });
  };

  const handleConviniencesChange = (newConviniences) => {
    setLocalConviniences(newConviniences);
    updateRoomData({ conviniences: newConviniences });
  };

  const handleDescriptionChange = (newDescription) => {
    setLocalDescription(newDescription);
    updateRoomData({ description: newDescription });
  };

  const handlePricesChange = (newPrices) => {
    setLocalPrices(newPrices);
    updateRoomData({ price: newPrices });
  };

  const handleCheckInChange = (newCheckIn) => {
    setLocalCheckIn(newCheckIn);
    updateRoomData({ checkStandart: { checkIn: newCheckIn, checkOut: localCheckOut } });
  };

  const handleCheckOutChange = (newCheckOut) => {
    setLocalCheckOut(newCheckOut);
    updateRoomData({ checkStandart: { checkIn: localCheckIn, checkOut: newCheckOut } });
  };

  const handleNotesChange = (newNotes) => {
    setLocalNotes(newNotes);
    updateRoomData({ notes: newNotes });
  };

  return (
    <div className="relative flex w-full min-h-screen flex-col bg-[#FBF8EF] rounded-lg overflow-x-hidden">
      <header className="flex items-center h-[70px] justify-between whitespace-nowrap border-b border-solid border-b-[#F5EFDB] px-10 py-3">
        <div className="flex items-center gap-4 text-[#201A09]">
          {!changeNameState ? (
            <>
              <h2 className="text-[#201A09] text-lg font-bold leading-tight tracking-[-0.015em]">{localName}</h2>
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
                <h2 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] text-left pb-3 pt-5">Свойства</h2>
                <MultiInputField
                  initialValues={localProperties}
                  onSave={handlePropertiesChange}
                />
              </div>
              <div className='flex flex-col'>
                <h3 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] text-left pb-3 pt-5">Удобства</h3>
                <MultiInputField
                  initialValues={localConviniences}
                  onSave={handleConviniencesChange}
                />
              </div>
            </div>
          </div>

          <h4 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">Описание</h4>
          <DescriptionInput
            text={localDescription}
            onSave={handleDescriptionChange}
          />

          <h1 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">Цены</h1>
          <PriceList
            globalPrices={localPrices}
            onSave={handlePricesChange}
          />

          <h5 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">Правила размещения</h5>
          <div className="flex flex-row flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <p className="text-[#201A09] text-base font-medium mt-2 mb-1 sm:px-6">Заезд</p>
              <DescriptionInput
                inputField={true}
                text={localCheckIn}
                onSave={handleCheckInChange}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <p className="text-[#201A09] text-base font-medium mt-2 mb-1 sm:px-6">Выезд</p>
              <DescriptionInput
                inputField={true}
                text={localCheckOut}
                onSave={handleCheckOutChange}
              />
            </div>
            <div className="flex-1 min-w-[200px] max-w-[350px]">
              <p className="text-[#201A09] text-base font-medium mt-2 mb-1 sm:px-4">Примечания</p>
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