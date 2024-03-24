import React, { useEffect, useState, useRef } from 'react';
import './hover.css'

const ExtCard = ({ Card, ExtContent }) => {
  const [showDialog, setShowDialog] = useState(false);
  const dialogRef = useRef(null);
  const [dialogOverflow, setDialogOverflow] = useState('hidden');


  const handleClick = () => {
    setShowDialog(true);
    // document.body.classList.add('no-scroll');
  };

  const handleClose = () => {
    setShowDialog(false);
    // document.body.classList.remove('no-scroll');
  };

  useEffect(() => {
    if (showDialog) {
      document.body.style.overflow = 'hidden';
      setDialogOverflow('auto');
    } else {
      document.body.style.overflow = 'auto';
      setDialogOverflow('hidden');
    }
  }, [showDialog]);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.style.overflow = dialogOverflow;
    }
  }, [dialogOverflow]);


  return (
    <div className="flex items-center justify-center">
        <button
          className='mt-8 transition ease-in-out delay-150 hover:scale-105'
          onClick={handleClick}
        >
          <Card/>
        </button>
      {showDialog && (
        <div className="fixed mt-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center" ref={dialogRef}>
          <div className="bg-white p-8 rounded-lg shadow-md  w-5/6 overflow-y-scroll h-5/6  mt-20 lg:mt-14 mb-12 max-w-[1040px]  " > 
            <ExtContent/>
            <button
              className="p-2 text-lg rounded-2xl text-gray-600 mt-4 hover:text-gray-900 "
              onClick={handleClose}
            >
              ⛌
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtCard;