import React from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';

const Card = ({ className, horizontal, imgAlt, imgSrc, children }) => {
  // New: useMediaQuery hook to check screen width
  const isBelow600px = useMediaQuery({ query: '(max-width: 689px)' });

  const cardClasses = `
    ${horizontal && !isBelow600px ? 'flex flex-col' : 'flex flex-col'}
    ${className}
    rounded-lg
    shadow-2xl
    //p
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