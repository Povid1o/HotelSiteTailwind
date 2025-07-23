import React, { useState, useEffect } from 'react';
import PhotoSelector from '../text_inputs/PhotoSelector';
import PriceList from '../text_inputs/PriceList';
import DescriptionInput from '../text_inputs/DescriptionInput';
import MultiInputField from '../text_inputs/MultiInputField';
import Button from '../text_inputs/Button';
import { MdModeEdit } from "react-icons/md";

import "../styles/newRoomCard.css"; // Предполагается, что стили находятся в этом файле

const NewRoomCard = ({
    roomName, 
    photos, 
    properties, 
    conviniences, 
    description, 
    prices, 
    checkIn, 
    checkOut,
    onDataChange // Новый пропс для передачи данных наверх
}) => {
    // Локальное состояние для всех данных
    const [roomData, setRoomData] = useState({
        name: roomName || '',
        photos: photos || [],
        properties: properties || [],
        conviniences: conviniences || [],
        description: description || '',
        prices: prices || [],
        checkIn: checkIn || '',
        checkOut: checkOut || '',
        notes: []
    });

    const [changeNameState, setChangeNameState] = useState(false);

    // Эффект для передачи данных наверх при изменении
    useEffect(() => {
        if (onDataChange) {
            onDataChange(roomData);
        }
    }, [roomData, onDataChange]);

    // Универсальная функция для обновления данных
    const updateRoomData = (field, value) => {
        setRoomData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = (newValue) => {
        updateRoomData('name', newValue);
        setChangeNameState(false);
    };

    return (
        <div className="relative flex w-full min-h-screen flex-col bg-[#FBF8EF] rounded-lg overflow-x-hidden">
            <header className="flex items-center h-[70px] justify-between whitespace-nowrap border-b border-solid border-b-[#F5EFDB] px-10 py-3">
                <div className="flex items-center gap-4 text-[#201A09]">
                    {!changeNameState ? (
                        <>
                            <h1 className="text-[#201A09] text-lg font-bold leading-tight tracking-[-0.015em]">
                                {roomData.name}
                            </h1>
                            <label>
                                <Button 
                                    icon={<MdModeEdit className='h-[20px] w-[20px]'/>} 
                                    func={() => setChangeNameState(true)}
                                />
                            </label>
                        </>
                    ) : (
                        <DescriptionInput 
                            inputField={true} 
                            horizontal={true} 
                            isShort={true}
                            text={roomData.name}
                            onSave={handleSave}
                        />
                    )}
                </div>
            </header>

            <div className="px-20 flex flex-1 justify-center py-5 lg:px-40">
                <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                    
                    {/* PhotoSelector с контролируемыми данными */}
                    <PhotoSelector 
                        photos={roomData.photos} 
                        header={"Фото Номера"}
                        onPhotosChange={(newPhotos) => updateRoomData('photos', newPhotos)}
                    />
                    
                    <div className="flex justify-stretch">
                        <div className="flex flex-1 gap-10 flex-wrap px-4 py-3 justify-around">
                            <div className='flex flex-col'>
                                <h1 className="section-header">
                                    Свойства
                                </h1>
                                <MultiInputField 
                                    initialValues={roomData.properties}
                                    onSave={(newProperties) => updateRoomData('properties', newProperties)}
                                />
                            </div>
                            
                            <div className='flex flex-col'>
                                <h1 className="section-header">
                                    Удобства
                                </h1>
                                <MultiInputField 
                                    initialValues={roomData.conviniences}
                                    onSave={(newConviniences) => updateRoomData('conviniences', newConviniences)}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <h1 className="section-header">
                        Описание
                    </h1>
                    <DescriptionInput 
                        text={roomData.description}
                        isShort={false}
                        onSave={(newDescription) => updateRoomData('description', newDescription)}
                    />
                    
                    <h1 className="section-header">
                        Цены
                    </h1>
                    <PriceList 
                        globalPrices={roomData.prices}
                        onSave={(newPrices) => updateRoomData('prices', newPrices)}
                    />
                    
                    <h1 className="section-header">
                        Правила размещения
                    </h1>
                    <div className="flex flex-row flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <p className="second-header sm:px-6">Заезд</p>
                            <DescriptionInput 
                                inputField={true} 
                                isShort={true}
                                text={roomData.checkIn}
                                onSave={(newCheckIn) => updateRoomData('checkIn', newCheckIn)}
                            />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <p className="second-header sm:px-6">Выезд</p>
                            <DescriptionInput 
                                inputField={true} 
                                isShort={true}
                                text={roomData.checkOut}
                                onSave={(newCheckOut) => updateRoomData('checkOut', newCheckOut)}
                            />
                        </div>
                        <div className="flex-1 min-w-[200px] max-w-[350px]">
                            <p className="second-header sm:px-4">Примечания</p>
                            <MultiInputField 
                                initialValues={roomData.notes}
                                onSave={(newNotes) => updateRoomData('notes', newNotes)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewRoomCard;