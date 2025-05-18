import React, { useState, useRef, useEffect } from 'react';

interface RangeSliderProps {
  title: string;
  minValue: number;
  maxValue: number;
  initialMin?: number;
  initialMax?: number;
  valuePrefix?: string;
  unit?: string;
  onChange?: (minVal: number, maxVal: number) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  title,
  minValue,
  maxValue,
  initialMin = minValue,
  initialMax = maxValue,
  valuePrefix = "",
  unit = "",
  onChange = () => {},
}) => {
  const [minVal, setMinVal] = useState<number>(initialMin);
  const [maxVal, setMaxVal] = useState<number>(initialMax);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragFinished, setDragFinished] = useState<boolean>(false);
  
  const range = useRef<HTMLDivElement | null>(null);
  const minThumb = useRef<HTMLDivElement | null>(null);
  const maxThumb = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const userChangedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!userChangedRef.current) {
      setMinVal(initialMin);
      setMaxVal(initialMax);
    }
  }, [initialMin, initialMax]);

  // Эффект для вызова onChange при завершении перетаскивания
  useEffect(() => {
    if (dragFinished) {
      onChange(minVal, maxVal);
      setDragFinished(false);
    }
  }, [dragFinished, minVal, maxVal, onChange]);

  const getPercent = (value: number): number => {
    return ((value - minValue) / (maxValue - minValue)) * 100;
  };

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

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const percent = (e.clientX - trackRect.left) / trackRect.width;
    const value = Math.round(percent * (maxValue - minValue) + minValue);

    userChangedRef.current = true;
    if (Math.abs(value - minVal) <= Math.abs(value - maxVal)) {
      setMinVal(Math.min(value, maxVal - 1));
    } else {
      setMaxVal(Math.max(value, minVal + 1));
    }
    // Запускаем эффект, который вызовет onChange
    setDragFinished(true);
  };

  const handleMinThumbDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const startX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const startLeft = minThumb.current ? minThumb.current.getBoundingClientRect().left : 0;
    const trackWidth = trackRef.current ? trackRef.current.getBoundingClientRect().width : 0;
    const trackLeft = trackRef.current ? trackRef.current.getBoundingClientRect().left : 0;

    userChangedRef.current = true;
    setIsDragging(true);

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
      
      setIsDragging(false);
      setDragFinished(true);
    };

    document.addEventListener('mousemove', handleMouseMove as EventListener);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove as EventListener, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
  };

  const handleMaxThumbDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const startX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const startLeft = maxThumb.current ? maxThumb.current.getBoundingClientRect().left : 0;
    const trackWidth = trackRef.current ? trackRef.current.getBoundingClientRect().width : 0;
    const trackLeft = trackRef.current ? trackRef.current.getBoundingClientRect().left : 0;

    userChangedRef.current = true;
    setIsDragging(true);

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
      
      setIsDragging(false);
      setDragFinished(true);
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
        <div
          ref={trackRef}
          className="absolute h-1 rounded bg-gray-200 w-full z-10 top-2 cursor-pointer"
          onClick={handleTrackClick}
        ></div>

        <div ref={range} className="absolute h-1 rounded bg-main_theme z-20 top-2"></div>

        <div
          ref={minThumb}
          className="absolute w-5 h-5 rounded-full bg-white border-2 border-main_theme top-2 -ml-2.5 z-40 cursor-pointer"
          style={{ transform: 'translateY(-50%)' }}
          onMouseDown={handleMinThumbDrag}
          onTouchStart={handleMinThumbDrag}
        ></div>

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