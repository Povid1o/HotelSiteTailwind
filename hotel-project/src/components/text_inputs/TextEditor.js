import React, { useState } from 'react';
import Button from './Button';
import { FaPen } from "react-icons/fa";

function TextEditor({ text, format = 'paragraph', onSave }) {
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
        return 'font-bold text-4xl text-gray-700 bg-white pt-4 pr-4 lg:text-5xl xl:text-6xl pt-8 pr-16';
      case 'paragraph':
      default:
        return 'max-w-screen-lg font-light text-left text-gray-700 bg-white text-xs md:text-base lg:text-lg xl:text-2xl pt-8';
    }
  };

  const renderTextArea = () => {
    if (isEditing) {
      return (
        <input
          value={description}
          onChange={handleChange}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#201A09] focus:outline-0 focus:ring-0 border border-[#EFE3C3] bg-[#FBF8EF] focus:border-[#EFE3C3] h-14 placeholder:text-[#A07D1C] p-[15px] text-base font-normal leading-normal"
        />
      );
    } else {
      return (
        <div className="relative">
          <p className={getTextStyle()}>
            {description}
          </p>
          <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 absolute -top-4 -right-8 py-2 px-4 rounded z-20"
              style={{ display: isDirty ? 'none' : 'block' }}
              onClick={handleEditClick}
            >
                <FaPen />
          </button>

          {/* <button
            onClick={handleEditClick}
            className="absolute top-0 right-0 mt-2 mr-2 bg-blue-500 text-white px-2 py-1 rounded"
            style={{ display: isDirty ? 'none' : 'block' }} // Hide button when editing
          >
            Edit
          </button> */}
        </div>
      );
    }
  };

  return (
    <div className="max-w-[700px] mx-auto px-16 flex flex-col justify-center content-center text-center">
      <div className="flex max-w-screen-lg flex-wrap items-end gap-4 px-4 py-3">
        <label className="flex flex-col min-w-40 flex-1">
          {renderTextArea()}
        </label>
      </div>
      {isEditing && (
        <div className="flex justify-stretch">
          <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
            <Button text="Сохранить" func={handleSave} />
          </div>
        </div>
      )}
    </div>
  );
}

export default TextEditor;