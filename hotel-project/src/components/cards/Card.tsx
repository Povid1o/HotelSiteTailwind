import React, { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';

interface CardProps {
  className?: string;
  horizontal?: boolean;
  imgAlt?: string;
  imgSrc?: string;
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({
  className = '',
  horizontal = true,
  imgAlt = '',
  imgSrc = '',
  children,
}) => {
  // New: useMediaQuery hook to check screen width
  const isBelow600px = useMediaQuery({ query: '(max-width: 689px)' });

  const cardClasses = `
    ${horizontal && !isBelow600px ? 'flex flex-col' : 'flex flex-col'}
    ${className}
    rounded-lg
    shadow-2xl
    mx-4
    ${horizontal && !isBelow600px ? 'items-center' : 'items-start'}
  `;

  const imgClasses = `
    ${horizontal && !isBelow600px ? 'w-full' : 'w-full'}
    h-auto
    rounded-t-lg
    mb-2
  `;

  return (
    <div className={cardClasses}>
      {imgSrc && (
        <img
          className={imgClasses}
          src={imgSrc}
          alt={imgAlt}
        />
      )}
      {children}
    </div>
  );
};

export default Card;