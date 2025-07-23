import React, { useState, useEffect } from 'react';
import Button from './Button';

// Типы для пропсов компонента
interface DescriptionInputProps {
  text?: string; // Начальное значение текста
  height?: string; // Высота поля ввода (не используется в коде)
  width?: string; // Ширина поля ввода (не используется в коде)
  horizontal?: boolean; // Флаг для горизонтального расположения
  inputField?: boolean; // Флаг для использования input вместо textarea
  onSave?: (value: string) => void; // Callback для поднятия состояния наверх
}

/**
 * Компонент DescriptionInput для управления текстовым полем с автосохранением
 * @param {DescriptionInputProps} props - Пропсы компонента
 */
const DescriptionInput: React.FC<DescriptionInputProps> = ({ 
  text = '', 
  height, 
  width, 
  horizontal = false, 
  inputField = false, 
  onSave = () => {} 
}) => {
  // Состояние для хранения текущего текста
  const [description, setDescription] = useState(text);
  // Флаг, показывающий, были ли изменения в поле
  const [isDirty, setDirty] = useState(false);

  // Синхронизация внутреннего состояния с пропсом text
  useEffect(() => {
    setDescription(text);
    setDirty(false);
  }, [text]);

  // Обработчик изменения текста
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setDescription(event.target.value);
    setDirty(true);
  };

  // Сохранение изменений и поднятие состояния наверх
  const handleSave = () => {
    setDirty(false);
    onSave(description);
  };

  // Автосохранение при потере фокуса с небольшой задержкой
  const handleBlur = () => {
    setTimeout(() => {
      if (isDirty) {
        handleSave();
      }
    }, 100);
  };

  // Функция для рендеринга поля ввода (input или textarea)
  const renderInputField = () => {
    if (inputField) {
      return (
        <label className="flex flex-col min-w-40 flex-1">
          <input
            placeholder="Вводите..."
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#201A09] focus:outline-0 focus:ring-0 border border-[#EFE3C3] bg-[#FBF8EF] focus:border-[#EFE3C3] h-14 placeholder:text-[#A07D1C] p-[15px] text-base font-normal leading-normal"
            value={description}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </label>
      );
    } else {
      return (
        <textarea
          placeholder="Введите описание..."
          value={description}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#201A09] focus:outline-0 focus:ring-0 border border-[#EFE3C3] bg-[#FBF8EF] focus:border-[#EFE3C3] min-h-36 placeholder:text-[#A07D1C] p-[15px] text-base font-normal leading-normal"
        />
      );
    }
  };

  // JSX рендеринг компонента
  return (
    <>
      {horizontal ? (
        <div className="flex flex-row">
          <div className="flex max-w-screen-lg flex-wrap items-end gap-4 px-4 py-3">
            {renderInputField()}
          </div>
          {isDirty && (
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
                <Button text="Сохранить" func={handleSave} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex max-w-screen-lg flex-wrap items-end gap-4 px-4 py-3">
            {renderInputField()}
          </div>
          {isDirty && (
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
                <Button text="Сохранить" func={handleSave} />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DescriptionInput;