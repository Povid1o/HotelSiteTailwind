// src/utils/travelLine.ts
import React from 'react';

/**
 * Opens TravelLine booking module or smoothly scrolls to TravelLine search form.
 */
export const openTravelLineBooking = (event?: React.MouseEvent | Event, roomId?: string | number) => {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  const w = window as any;

  // 1. Try TravelLine native JS API if available
  if (w.TL && typeof w.TL.open === 'function') {
    w.TL.open({ room: roomId });
    return;
  }
  if (w.TL && w.TL.booking && typeof w.TL.booking.open === 'function') {
    w.TL.booking.open({ room: roomId });
    return;
  }

  // 2. Locate TravelLine search block on current page
  const searchBlock = document.getElementById('block-search') || 
                      document.querySelector('[id*="tl-search-form"]') ||
                      document.getElementById('booking');

  if (searchBlock) {
    searchBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Highlight or focus search form
    const firstInput = searchBlock.querySelector('input, select, button') as HTMLElement;
    if (firstInput) {
      setTimeout(() => {
        try {
          firstInput.focus();
        } catch (e) {
          // ignore focus errors if hidden
        }
      }, 500);
    }
    return;
  }

  // 3. Fallback: navigate to homepage with #block-search hash
  window.location.href = '/#block-search';
};
