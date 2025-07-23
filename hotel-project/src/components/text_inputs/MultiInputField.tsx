import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { IoIosClose } from "react-icons/io";

// Типы для пропсов компонента
interface MultiInputFieldProps {
  initialValues?: string[]; // Начальные значения полей
  onSave?: (values: string[]) => void; // Callback для поднятия состояния наверх
}

/**
 * Компонент MultiInputField для управления списком текстовых полей с автосохранением
 * @param {MultiInputFieldProps} props - Пропсы компонента
 */
const MultiInputField: React.FC<MultiInputFieldProps> = ({ initialValues = [], onSave = () => {} }) => {
  // Состояние для хранения списка полей ввода
  const [inputs, setInputs] = useState(initialValues.map(value => ({ value })));
  // Флаг, показывающий, были ли изменения в полях
  const [isDirty, setDirty] = useState(false);
  // Ref для хранения предыдущего значения initialValues
  const prevInitialValues = useRef(initialValues);

  // Синхронизация внутреннего состояния с пропсом initialValues
  useEffect(() => {
    // Проверяем, действительно ли initialValues изменился
    if (JSON.stringify(prevInitialValues.current) !== JSON.stringify(initialValues)) {
      setInputs(initialValues.map(value => ({ value })));
      setDirty(false);
      prevInitialValues.current = initialValues; // Обновляем предыдущее значение
    }
  }, [initialValues]);

  // Добавление нового пустого поля ввода
  const handleAddInput = () => {
    setInputs(prevInputs => [...prevInputs, { value: '' }]);
    setDirty(true);
  };

  // Удаление поля по индексу с автоматическим сохранением
  const handleRemoveInput = (index: number) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
    setDirty(true);
    // Поднимаем отфильтрованные значения наверх
    const values = newInputs.map(input => input.value).filter(value => value.trim() !== '');
    onSave(values);
  };

  // Обновление значения поля по индексу
  const handleInputChange = (index: number, value: string) => {
    const newInputs = inputs.map((input, i) => (i === index ? { value } : input));
    setInputs(newInputs);
    setDirty(true);
  };

  // Сохранение изменений и поднятие состояния наверх
  const handleSave = () => {
    setDirty(false);
    // Фильтруем пустые строки перед сохранением
    const values = inputs.map(input => input.value).filter(value => value.trim() !== '');
    onSave(values);
  };

  // Автосохранение при потере фокуса с небольшой задержкой
  const handleBlur = () => {
    setTimeout(() => {
      if (isDirty) {
        handleSave();
      }
    }, 100);
  };

  // JSX рендеринг компонента
  return (
    <div className="flex flex-col">
      {inputs.map((input, index) => (
        <div key={index} className="flex items-center gap-4 mb-2">
          <textarea
            placeholder="Введите текст..."
            value={input.value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onBlur={handleBlur}
            className="form-input flex w-full h-[50px] min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#201A09] focus:outline-0 focus:ring-0 border border-[#EFE3C3] bg-[#FBF8EF] focus:border-[#EFE3C3] placeholder:text-[#A07D1C] p-2 text-base font-normal leading-normal"
          />
          <label>
            <Button 
              func={() => handleRemoveInput(index)} 
              text="Удалить" 
              icon={<IoIosClose className='h-[20px] w-[20px]'/>}
            />
          </label>
        </div>
      ))}
      <div className="flex justify-stretch">
        <div className="flex flex-1 gap-3 flex-wrap py-3 justify-start">
          <Button func={handleAddInput} text="Добавить" />
          {isDirty && (
            <Button text="Сохранить" func={handleSave} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiInputField;