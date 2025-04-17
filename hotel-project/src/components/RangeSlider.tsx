import React, { useState, useRef, useEffect } from 'react';

interface RangeSliderProps {
  title: string;
  minValue: number;
  maxValue: number;
  initialMin?: number;
  initialMax?: number;
  valuePrefix?: string;
  unit?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  title,
  minValue,
  maxValue,
  initialMin = minValue,
  initialMax = maxValue,
  valuePrefix = "",
  unit = "",
}) => {
  const [minVal, setMinVal] = useState<number>(initialMin);
  const [maxVal, setMaxVal] = useState<number>(initialMax);
  const range = useRef<HTMLDivElement | null>(null);
  const minThumb = useRef<HTMLDivElement | null>(null);
  const maxThumb = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Convert to percentage
  const getPercent = (value: number): number => {
    return ((value - minValue) / (maxValue - minValue)) * 100;
  };

  // Update range highlight
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }

    if (minThumb.current) {
      minThumb.current.style.left = `${minPercent}%`;
    }

    if (maxThumb.current) {
      maxThumb.current.style.left = `${maxPercent}%`;
    }
  }, [minVal, maxVal, minValue, maxValue]);

  // Handle track click
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const percent = (e.clientX - trackRect.left) / trackRect.width;
    const value = Math.round(percent * (maxValue - minValue) + minValue);

    // Determine which thumb to move based on which is closer
    const minDistance = Math.abs(value - minVal);
    const maxDistance = Math.abs(value - maxVal);

    if (minDistance <= maxDistance) {
      setMinVal(Math.min(value, maxVal - 1));
    } else {
      setMaxVal(Math.max(value, minVal + 1));
    }
  };

  // Handle min thumb drag
  const handleMinThumbDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const startX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const startLeft = minThumb.current ? minThumb.current.getBoundingClientRect().left : 0;
    const trackWidth = trackRef.current ? trackRef.current.getBoundingClientRect().width : 0;
    const trackLeft = trackRef.current ? trackRef.current.getBoundingClientRect().left : 0;

    const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX = 'clientX' in moveEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
      const newLeft = startLeft + (clientX - startX);
      const newPercent = (newLeft - trackLeft) / trackWidth;
      const newValue = Math.round(newPercent * (maxValue - minValue) + minValue);

      if (newValue >= minValue && newValue < maxVal) {
        setMinVal(newValue);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove as EventListener);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove as EventListener);
      document.removeEventListener('touchend', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove as EventListener);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove as EventListener, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
  };

  // Handle max thumb drag
  const handleMaxThumbDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const startX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const startLeft = maxThumb.current ? maxThumb.current.getBoundingClientRect().left : 0;
    const trackWidth = trackRef.current ? trackRef.current.getBoundingClientRect().width : 0;
    const trackLeft = trackRef.current ? trackRef.current.getBoundingClientRect().left : 0;

    const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX = 'clientX' in moveEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
      const newLeft = startLeft + (clientX - startX);
      const newPercent = (newLeft - trackLeft) / trackWidth;
      const newValue = Math.round(newPercent * (maxValue - minValue) + minValue);

      if (newValue <= maxValue && newValue > minVal) {
        setMaxVal(newValue);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove as EventListener);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove as EventListener);
      document.removeEventListener('touchend', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove as EventListener);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove as EventListener, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
  };

  return (
    <div className="mb-8">
      <div className="font-medium uppercase text-gray-800 mb-2">{title}</div>

      <div className="flex justify-between mb-2 text-sm">
        <div className="text-gray-500">
          от <span className="text-amber-600">{valuePrefix}{minVal}{unit}</span>
        </div>
        <div className="text-gray-500">
          до <span className="text-amber-600">{valuePrefix}{maxVal}{unit}</span>
        </div>
      </div>

      <div className="relative h-6" style={{ touchAction: 'none' }}>
        {/* Base track */}
        <div
          ref={trackRef}
          className="absolute h-1 rounded bg-gray-200 w-full z-10 top-2 cursor-pointer"
          onClick={handleTrackClick}
        ></div>

        {/* Colored range */}
        <div ref={range} className="absolute h-1 rounded bg-main_theme z-20 top-2"></div>

        {/* Min thumb */}
        <div
          ref={minThumb}
          className="absolute w-5 h-5 rounded-full bg-white border-2 border-main_theme top-2 -ml-2.5 z-40 cursor-pointer"
          style={{ transform: 'translateY(-50%)' }}
          onMouseDown={handleMinThumbDrag}
          onTouchStart={handleMinThumbDrag}
        ></div>

        {/* Max thumb */}
        <div
          ref={maxThumb}
          className="absolute w-5 h-5 rounded-full bg-white border-2 border-main_theme top-2 -ml-2.5 z-40 cursor-pointer"
          style={{ transform: 'translateY(-50%)' }}
          onMouseDown={handleMaxThumbDrag}
          onTouchStart={handleMaxThumbDrag}
        ></div>
      </div>
    </div>
  );
};

export default RangeSlider;