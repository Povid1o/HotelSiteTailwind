import React from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';

const Card = ({ className, horizontal, imgAlt, imgSrc, children }) => {
  // New: useMediaQuery hook to check screen width
  const isBelow600px = useMediaQuery({ query: '(max-width: 599px)' });

  const cardClasses = `
    ${horizontal && !isBelow600px ? 'flex flex-row' : 'flex flex-col'}
    ${className}
    rounded-lg
    shadow-2xl
    p-4
    ${horizontal && !isBelow600px ? 'items-center' : 'items-start'}
  `;

  const imgClasses = `
    ${horizontal && !isBelow600px ? 'w-1/2' : 'w-full'}
    h-auto
    rounded-lg
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

Card.propTypes = {
  className: PropTypes.string,
  horizontal: PropTypes.bool,
  imgAlt: PropTypes.string,
  imgSrc: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Card.defaultProps = {
  className: '',
  horizontal: true, // Set the default value to true
  imgAlt: '',
  imgSrc: '',
};

export default Card;