import { useCallback, useState, useEffect, useRef } from "react";

import Box from "../cards/Box";
import ExtCard from "../cards/ExtCard";
import ImageWithButton from "./ImageWithButton";
import DescriptionInput from "./DescriptionInput";

const BoxEditable = ({ name, imgSrc, children, onDataChange = () => {} }) => {
    const [localName, setLocalName] = useState(name);
    const [localPhotoFile, setLocalPhotoFile] = useState(null); // Храним File объект
    const [localPhotoUrl, setLocalPhotoUrl] = useState(imgSrc); // Храним URL для отображения
    const blobUrlRef = useRef(null);

    // Синхронизация с внешними пропсами при их изменении
    useEffect(() => {
        setLocalName(name);
    }, [name]);

    useEffect(() => {
        // Если imgSrc изменился извне и это не наш blob URL
        if (imgSrc !== localPhotoUrl && imgSrc !== blobUrlRef.current) {
            // Очищаем предыдущий blob URL
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
            }
            
            setLocalPhotoUrl(imgSrc);
            setLocalPhotoFile(null); // Сбрасываем File объект при внешнем изменении
        }
    }, [imgSrc, localPhotoUrl]);

    // Очистка blob URL при размонтировании
    useEffect(() => {
        return () => {
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
            }
        };
    }, []);

    // Мемоизированная функция для поднятия обновленных данных
    const updateBoxData = useCallback((updatedData) => {
        const newData = {
            name: localName,
            image: localPhotoFile || localPhotoUrl, // Отправляем File или URL
            ...updatedData
        };
        onDataChange(newData);
    }, [localName, localPhotoFile, localPhotoUrl, onDataChange]);

    // Мемоизированные обработчики для каждого поля
    const handleNameSave = useCallback((newName) => {
        setLocalName(newName);
        updateBoxData({ name: newName });
    }, [updateBoxData]);
    
    const handlePhotoChange = useCallback((newPhoto) => {
        if (newPhoto instanceof File) {
            // Очищаем предыдущий blob URL
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
            }
            
            // Создаем новый blob URL для отображения
            const newBlobUrl = URL.createObjectURL(newPhoto);
            blobUrlRef.current = newBlobUrl;
            
            // Сохраняем File объект и URL отдельно
            setLocalPhotoFile(newPhoto);
            setLocalPhotoUrl(newBlobUrl);
            updateBoxData({ image: newPhoto }); // Отправляем File объект наверх
        } else if (typeof newPhoto === 'string') {
            // Если это строка (URL), используем как есть
            setLocalPhotoFile(null);
            setLocalPhotoUrl(newPhoto);
            updateBoxData({ image: newPhoto });
        } else if (newPhoto === null) {
            // Если изображение удаляется
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
            }
            setLocalPhotoFile(null);
            setLocalPhotoUrl(null);
            updateBoxData({ image: null });
        }
    }, [updateBoxData]);

    const BoxExtContent = ({ name, imgSrc, handlePhotoChangeFunction, handleNameSaveFunction }) => {
        return (
            <div className="flex flex-col items-start space-y-4">
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Изображение:
                    </label>
                    <ImageWithButton
                        image={imgSrc}
                        onImageChange={handlePhotoChangeFunction}
                    />
                </div>
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Название:
                    </label>
                    <DescriptionInput
                        text={name}
                        inputField={true}
                        horizontal={false}
                        onSave={handleNameSaveFunction}
                    />
                </div>
            </div>
        );
    }

    return (
        <ExtCard
            Card={() => (
                <Box
                    imgSrc={localPhotoUrl} // Используем URL для отображения
                    imgAlt={localName}
                >
                    <p className='mx-10 my-auto text-lg mobile:text-xl md:text-2xl font-semibold'>
                        {localName}
                    </p>
                </Box>
            )}
            ExtContent={() => (
                <BoxExtContent 
                    name={localName} 
                    imgSrc={localPhotoUrl} // Используем URL для отображения
                    handleNameSaveFunction={handleNameSave} 
                    handlePhotoChangeFunction={handlePhotoChange}
                />
            )}
        />
    );
}

export default BoxEditable;