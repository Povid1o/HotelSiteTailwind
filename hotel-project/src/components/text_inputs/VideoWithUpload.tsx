import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FileInput, HelperText, Label } from "flowbite-react";
import VideoPlayer from '../VideoPlayer';
import DescriptionInput from './DescriptionInput';
import Button from './Button';

interface VideoWithUploadProps {
  sourceUrl?: string; // Начальная ссылка на видео
  onVideoChange?: (videoSource: string | File | null) => void; // Callback для поднятия состояния
}

const VideoWithUpload: React.FC<VideoWithUploadProps> = ({ 
  sourceUrl = '', 
  onVideoChange 
}) => {
  // Инициализируем состояние правильно - всегда строкой для VideoPlayer
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(() => {
    if (typeof sourceUrl === 'string') {
      return sourceUrl;
    }
    return ''; // Если sourceUrl не строка, используем пустую строку
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUrlInputMode, setIsUrlInputMode] = useState(false);
  const [tempVideoFile, setTempVideoFile] = useState<File | null>(null);
  const [tempVideoUrl, setTempVideoUrl] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentBlobRef = useRef<string | null>(null);
  const savedBlobRef = useRef<string | null>(null); // Для сохранения blob URL основного видео

  // Обновляем currentVideoUrl когда sourceUrl изменяется извне
  useEffect(() => {
    if (typeof sourceUrl === 'string' && sourceUrl !== currentVideoUrl) {
      setCurrentVideoUrl(sourceUrl);
    }
  }, [sourceUrl, currentVideoUrl]);

  // Очистка blob URL при размонтировании компонента
  useEffect(() => {
    return () => {
      if (currentBlobRef.current && currentBlobRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(currentBlobRef.current);
        currentBlobRef.current = null;
      }
      if (savedBlobRef.current && savedBlobRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(savedBlobRef.current);
        savedBlobRef.current = null;
      }
    };
  }, []);

  // Обработчик выбора файла
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    console.log(`Selected video file: ${selectedFile.name}`);
    
    try {
      if (!selectedFile.type.startsWith('video/')) {
        throw new Error('Выбранный файл не является видео');
      }

      // Очищаем предыдущий blob URL если он есть
      if (currentBlobRef.current && currentBlobRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(currentBlobRef.current);
      }

      // Создаем новый blob URL
      const newBlobUrl = URL.createObjectURL(selectedFile);
      currentBlobRef.current = newBlobUrl;
      
      setTempVideoFile(selectedFile);
      setTempVideoUrl(newBlobUrl);
      setShowPreview(true);

      // Очищаем input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Ошибка при загрузке видео:', error);
      alert('Не удалось загрузить видео. Пожалуйста, попробуйте другой файл.');
    }
  }, []);

  // Обработчик сохранения URL из DescriptionInput
  const handleUrlSave = useCallback((url: string) => {
    if (url.trim()) {
      setTempVideoUrl(url.trim());
      setShowPreview(true);
      setIsUrlInputMode(false);
    }
  }, []);

  // Сохранение изменений
  const handleSave = useCallback(() => {
    if (tempVideoFile && tempVideoUrl) {
      // Переносим blob URL из временного в постоянный
      if (currentBlobRef.current && currentBlobRef.current.startsWith('blob:')) {
        // Очищаем старый сохраненный blob если есть
        if (savedBlobRef.current && savedBlobRef.current.startsWith('blob:')) {
          URL.revokeObjectURL(savedBlobRef.current);
        }
        savedBlobRef.current = currentBlobRef.current;
        currentBlobRef.current = null; // Переносим ответственность
      }
      
      setCurrentVideoUrl(tempVideoUrl);
      if (onVideoChange) {
        onVideoChange(tempVideoFile);
      }
    } else if (tempVideoUrl) {
      setCurrentVideoUrl(tempVideoUrl);
      if (onVideoChange) {
        onVideoChange(tempVideoUrl);
      }
    }
    
    // Сброс временных состояний с небольшой задержкой
    setTimeout(() => {
      setIsEditMode(false);
      setIsUrlInputMode(false);
      setTempVideoFile(null);
      setTempVideoUrl('');
      setShowPreview(false);
    }, 100);
  }, [tempVideoFile, tempVideoUrl, onVideoChange]);

  // Отмена изменений
  const handleCancel = useCallback(() => {
    // Очищаем только временный blob URL
    if (currentBlobRef.current && currentBlobRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(currentBlobRef.current);
      currentBlobRef.current = null;
    }
    
    // Сброс состояний с небольшой задержкой
    setTimeout(() => {
      setIsEditMode(false);
      setIsUrlInputMode(false);
      setTempVideoFile(null);
      setTempVideoUrl('');
      setShowPreview(false);
    }, 100);
  }, []);

  // Переход в режим вставки ссылки
  const handleInsertByUrl = useCallback(() => {
    setIsUrlInputMode(true);
  }, []);

  return (
    <div className="w-full">
      {/* Обычный режим отображения */}
      {!isEditMode && (
        <>
          <div className="relative w-full">
            {currentVideoUrl ? (
              <VideoPlayer sourceUrl={currentVideoUrl} />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
                Нет видео
              </div>
            )}
            <div className="flex justify-center mt-4">
              <Button 
                text="Изменить" 
                func={() => setIsEditMode(true)} 
              />
            </div>
          </div>
        </>
      )}

      {/* Режим редактирования */}
      {isEditMode && (
        <>
          {/* Превью загруженного/введенного видео */}
          {showPreview && tempVideoUrl && (
            <div className="mb-4">
              <VideoPlayer sourceUrl={tempVideoUrl} />
            </div>
          )}

          {/* Ввод URL */}
          {isUrlInputMode ? (
            <div className="mb-4">
              <DescriptionInput
                text=""
                inputField={true}
                horizontal={false}
                onSave={handleUrlSave}
              />
            </div>
          ) : (
            /* Загрузка файла */
            <div className="mb-4">
              <Label className="mb-2 block" htmlFor="video-upload">
                Загрузить видео
              </Label>
              <FileInput 
                id="video-upload" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="video/*"
              />
              <HelperText className="mt-1">
                MP4, AVI, MOV, WMV или другие видео форматы.
              </HelperText>
            </div>
          )}

          {/* Кнопки управления */}
          <div className="flex gap-3 justify-start">
            {!isUrlInputMode && !showPreview && (
              <Button 
                text="Вставить видео ссылкой" 
                func={handleInsertByUrl} 
              />
            )}
            
            {showPreview && (
              <Button 
                text="Сохранить" 
                func={handleSave} 
              />
            )}
            
            <Button 
              text="Отменить" 
              func={handleCancel} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VideoWithUpload;