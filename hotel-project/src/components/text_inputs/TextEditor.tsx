import React, { useState } from 'react';
import Button from './Button';
import { FaPen } from "react-icons/fa";

function TextEditor({ text, format = 'paragraph', style, onSave, isShort = false}) {
  const [description, setDescription] = useState(text || '');
  const [isDirty, setDirty] = useState(false);
  const [isEditing, setEditing] = useState(false);

  const handleChange = (event) => {
    setDescription(event.target.value);
    setDirty(true);
  };

  const handleSave = () => {
    setDirty(false);
    setEditing(false);
    if (onSave) {
      onSave(description);
    }
  };

  const handleEditClick = () => {
    setEditing(true);
    setDirty(false);
  };

  const getTextStyle = () => {
    switch (format) {
      case 'header':
        return 'text-3xl font-bold font-body py-3 relative text-white drop-shadow-2xl isolate md:text-5xl xl:text-7xl';
      case 'modal':
        return 'text-4xl text-gray-700 font-bold pt-3 pb-3 text-wrap lg:text-5xl xl:text-6xl';
      case 'paragraph':
        return 'text-left text-gray-700 bg-white text-xs md:text-base lg:text-lg xl:text-2xl pt-8';
      case 'custom':
        return style
      default:
        return;
    }
  };

  const renderTextArea = () => {
    if (isEditing) {
      return (
        <div className="relative w-full">
            {isShort ? (
                <input
                    value={description}
                    onChange={handleChange}
                    className="w-full min-w-0 rounded-xl text-[#201A09] focus:outline-0 focus:ring-0 border border-[#EFE3C3] bg-[#FBF8EF] focus:border-[#EFE3C3] placeholder:text-[#A07D1C] p-[15px] text-base font-normal leading-normal"
                />
            ) : (
                <textarea
                    placeholder="Введите описание..."
                    value={description}
                    onChange={handleChange}
                    className="w-full rounded-xl text-[#201A09] focus:outline-0 focus:ring-0 border border-[#EFE3C3] bg-[#FBF8EF] focus:border-[#EFE3C3] min-h-48 placeholder:text-[#A07D1C] p-[15px] text-base font-normal leading-normal"
                />
            )}
        </div>
      );
    } else {
      return (
        <div className="relative inline-block max-w-full">
          <p className={getTextStyle()}>
            {description}
          </p>
          <button
            className="absolute -top-4 -right-8 bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full"
            style={{ display: isDirty ? 'none' : 'block' }}
            onClick={handleEditClick}
          >
            <FaPen className="w-4 h-4" />
          </button>
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="w-full p-3">
        <label className="block w-full">
          {renderTextArea()}
        </label>
      </div>
      {isEditing && (
        <div className="px-4 py-3">
          <Button text="Сохранить" func={handleSave} />
        </div>
      )}
    </div>
  );
}

export default TextEditor;