import React from 'react';
import Card from './Card';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';

const EventCard = ({ className, horizontal, imgAlt, imgSrc, title, description, children }) => {
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
    h-auto 
    object-cover
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
      <div className='flex flex-col mx-2 min-w-28 sm:mx-4 md:mx-6 lg:mx-8'>
        <h2 className="font-bold mb-2 text-center text-base sm:text-2xl">{title}</h2>
        <p className="text-gray-700 mb-4 text-justify text-xs  sm:text-base">{description}</p>
      </div>
      {children}
    </div>
  );
};

Card.propTypes = {
  className: PropTypes.string,
  horizontal: PropTypes.bool,
  imgAlt: PropTypes.string,
  imgSrc: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Card.defaultProps = {
  className: '',
  horizontal: true, // Set the default value to true
  imgAlt: '',
  imgSrc: '',
  title: '',
  description: '',
};

export default EventCard;