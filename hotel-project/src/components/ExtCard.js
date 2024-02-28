import React, { useState } from 'react';

const ExtCard = ({ Card }) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = () => {
    setShowDialog(true);
  };

  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    <div className="flex items-center justify-center">
        <button
          className='mt-8 mr-8 transition ease-in-out delay-150 hover:scale-105'
          onClick={handleClick}
        >
          <Card/>
        </button>
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-64">
            <h2 className="font-bold mb-4">Dialog Title</h2>
            <p className="text-gray-600">Dialog Description</p>
            <button
              className="bg-red-500 hover:bg-red-700 p-2 rounded-lg text-white mt-4"
              onClick={handleClose}
            >
              Close Dialog
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtCard;