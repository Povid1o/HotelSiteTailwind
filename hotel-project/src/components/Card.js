import React from 'react';
import PropTypes from 'prop-types';
// import { Carousel } from 'flowbite-react';
// import ImageCarousel from './ImageCarousel'

const Card = ({ className, horizontal, imgAlt, imgSrc, children }) => {
  const cardClasses = `
    ${horizontal ? 'flex flex-row' : 'flex flex-col'}
    ${className}
    rounded-lg
    shadow-2xl
    p-4
    ${horizontal ? 'items-center' : 'items-start'}
  `;

  const imgClasses = `
    ${horizontal ? 'w-1/2' : 'w-full'}
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

        // <Carousel pauseOnHover className='md:h-[300px] w-[400px] lg:w-[650px] h-[500px]'>
        //     <img src={imgSrc} alt={imgAlt} />
        //     <img src={imgSrc} alt={imgAlt} />
        //     <img src={imgSrc} alt={imgAlt} />
        //     <img src={imgSrc} alt={imgAlt} />
        //     <img src={imgSrc} alt={imgAlt} />
        // </Carousel>
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
  horizontal: false,
  imgAlt: '',
  imgSrc: '',
};

export default Card;