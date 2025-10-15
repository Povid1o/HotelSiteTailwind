import React, { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';

interface EventCardProps {
  className?: string;
  horizontal?: boolean;
  imgAlt?: string;
  imgSrc?: string;
  title?: string;
  description?: string;
  children: ReactNode;
}

const EventCard: React.FC<EventCardProps> = ({
  className = '',
  horizontal = true,
  imgAlt = '',
  imgSrc = '',
  title = '',
  description = '',
  children,
}) => {
  // New: useMediaQuery hook to check screen width
  const isBelow600px = useMediaQuery({ query: '(max-width: 689px)' });

  const cardClasses = `
    ${className}
    w-full
    rounded-lg
    shadow-2xl
    ${horizontal && !isBelow600px ? 'items-center' : 'items-start'}
  `;

  const imgClasses = `
    w-full
    h-full
    object-cover
    rounded-t-lg
  `;

  return (
    <div className={cardClasses}>
      <div className='w-auto h-[300px] overflow-hidden mb-3 '>
        {imgSrc && (
          <img
            className={imgClasses}
            src={imgSrc}
            alt={imgAlt}
          />
        )}
      </div>
      <div className='flex flex-col mx-2 min-w-28 sm:mx-4 md:mx-6 lg:mx-8'>
        <h2 className="font-bold mb-2 text-center text-base sm:text-2xl">{title}</h2>
        <p className="text-gray-700 mb-4 text-justify text-xs   sm:text-base">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default EventCard;