import React, { useState } from 'react';
import Button from './Button';

function DescriptionInput({ text, height, width, horizontal=false, inputField = false, onSave }) {
  const [description, setDescription] = useState(text || '');
  const [isDirty, setDirty] = useState(false);

  const handleChange = (event) => {
    setDescription(event.target.value);
    setDirty(true);
  };

  const handleResetDirty = () => {
    setDirty(false);
    if (onSave) {
      onSave(description); 
    }
  };

  const renderTextArea = () => {
    if (inputField) {
      return (
        
        <label className="flex flex-col min-w-40 flex-1">
            <input
                placeholder="Вводите..."
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#201A09] focus:outline-0 focus:ring-0 border border-[#EFE3C3] bg-[#FBF8EF] focus:border-[#EFE3C3] h-14 placeholder:text-[#A07D1C] p-[15px] text-base font-normal leading-normal"
                value={description}
                onChange={handleChange}
            />
        </label>
      );
    } else {
      return (
        <textarea
          placeholder="Введите описание..."
          value={description}
          onChange={handleChange}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#201A09] focus:outline-0 focus:ring-0 border border-[#EFE3C3] bg-[#FBF8EF] focus:border-[#EFE3C3] min-h-36 placeholder:text-[#A07D1C] p-[15px] text-base font-normal leading-normal"
        />
      );
    }
  };

  return (
    <>  
      {
        horizontal ? 
        (
          <div className='flex flex-row'>
            <div className="flex max-w-screen-lg flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                {renderTextArea()}
              </label>
            </div>
            {isDirty && (
              <div className="flex justify-stretch">
                <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
                  <Button text="Сохранить" func={handleResetDirty} />
                </div>
              </div>
            )}
          </div>
        ) : 
        (
          <div>
            <div className="flex max-w-screen-lg flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                {renderTextArea()}
              </label>
            </div>
            {isDirty && (
              <div className="flex justify-stretch">
                <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
                  <Button text="Сохранить" func={handleResetDirty} />
                </div>
              </div>
            )}
          </div>
        )
      }
    </>

  );
}

export default DescriptionInput;