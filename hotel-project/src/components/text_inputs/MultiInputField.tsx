import React, { useState, useEffect } from 'react';
import Button from './Button';
import { IoIosClose } from "react-icons/io";

const MultiInputField = ({ initialValues = [], onSave = () => {} }) => {
  const [inputs, setInputs] = useState(
    initialValues.map((value) => ({ value })) || []
  );
  const [isDirty, setDirty] = useState(false);

  // Синхронизация с внешним состоянием при изменении initialValues
  useEffect(() => {
    const newInputs = initialValues.map((value) => ({ value }));
    setInputs(newInputs);
    setDirty(false);
  }, [initialValues]);

  const handleAddInput = () => {
    const newInputs = [...inputs, { value: '' }];
    setInputs(newInputs);
    setDirty(true);
  };

  const handleRemoveInput = (index) => {
    const newInputs = inputs.filter((input, i) => i !== index);
    setInputs(newInputs);
    setDirty(true);
    
    // Автоматически сохраняем при удалении
    const values = newInputs.map(input => input.value).filter(value => value.trim() !== '');
    if (onSave) {
      onSave(values);
    }
  };

  const handleInputChange = (index, value) => {
    const newInputs = inputs.map((input, i) => (i === index ? { value } : input));
    setInputs(newInputs);
    setDirty(true);
  };

  const handleSave = () => {
    setDirty(false);
    // Фильтруем пустые значения перед сохранением
    const values = inputs.map(input => input.value).filter(value => value.trim() !== '');
    if (onSave) {
      onSave(values);
    }
  };

  // Автосохранение при потере фокуса с задержкой
  const handleBlur = () => {
    setTimeout(() => {
      if (isDirty) {
        handleSave();
      }
    }, 100);
  };

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