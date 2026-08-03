import React, { useEffect, useState, useRef } from 'react';

const ExtCard = ({ Card, ExtContent, content }) => {
  const [showDialog, setShowDialog] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [dialogOverflow, setDialogOverflow] = useState('hidden');


  const handleClick = (event) => {
    event.stopPropagation();
    setShowDialog(true);
    // document.body.classList.add('no-scroll');
  };

  const handleClose = () => {
    setShowDialog(false);
    // document.body.classList.remove('no-scroll');
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (showDialog) {
      document.body.style.overflow = 'hidden';
      setDialogOverflow('auto');
    } else {
      document.body.style.overflow = 'auto';
      setDialogOverflow('hidden');
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showDialog]);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.style.overflow = dialogOverflow;
    }
  }, [dialogOverflow]);

  useEffect(() => {
    if (!showDialog) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showDialog]);


  return (
    <div className="flex items-center justify-center">
        {/* <button
          className='mt-8 transition ease-in-out delay-150 hover:scale-105'
          onClick={handleClick}
        >
          <Card/>
        </button> */}
        <div 
          className="cursor-pointer transition ease-in-out delay-150 hover:scale-105 w-full"
          onClick={handleClick}
        >
          <Card />
        </div>
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" ref={dialogRef} role="presentation">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-[1040px] overflow-y-auto rounded-lg bg-white px-8 py-6 shadow-md" role="dialog" aria-modal="true" aria-label="Редактор">
            <div className="mb-6 flex justify-end border-b border-gray-100 pb-4">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-main_theme focus:outline-none focus:ring-2 focus:ring-main_theme"
                aria-label="Закрыть редактор"
              >
                Закрыть <span className="text-xl leading-none" aria-hidden="true">×</span>
              </button>
            </div>
            <div>{content ?? <ExtContent/>}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtCard;
