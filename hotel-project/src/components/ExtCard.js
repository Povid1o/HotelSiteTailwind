import React, { useEffect, useState, useRef } from 'react';
import './ExitButton.css'

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
        <div className="fixed z-50 flex-wrap mt-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center" ref={dialogRef}>
          <div className="bg-white p-8 rounded-lg shadow-md  w-5/6 overflow-y-scroll h-5/6  mt-20 lg:mt-14 mb-12 max-w-[1040px]  " > 
          <div className="relative">
            <div onClick={handleClose} className="cl-btn-6 absolute left-[99%]">
              <div class="cl-btn-6-in ">
                <label class="cl-btn-6-txt text-gray-600">Close</label>
              </div>
            </div>
          </div>
            <ExtContent/>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtCard;