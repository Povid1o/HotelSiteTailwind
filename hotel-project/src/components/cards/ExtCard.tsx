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
        // Full screen on phones; dvh keeps the bottom of the editor above the
        // mobile browser toolbar, where 100vh would hide it.
        <div className="fixed inset-0 z-[60] flex items-stretch justify-center bg-black/50 sm:items-center sm:p-4" ref={dialogRef} role="presentation">
          <div className="h-[100dvh] w-full max-w-[1040px] overflow-y-auto overscroll-contain bg-white px-4 pb-6 shadow-md sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:rounded-lg sm:px-8" role="dialog" aria-modal="true" aria-label="Редактор">
            <div className="sticky top-0 z-10 -mx-4 mb-4 flex justify-end border-b border-gray-100 bg-white px-4 py-2 sm:-mx-8 sm:mb-6 sm:px-8 sm:py-4">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-main_theme focus:outline-none focus:ring-2 focus:ring-main_theme"
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
