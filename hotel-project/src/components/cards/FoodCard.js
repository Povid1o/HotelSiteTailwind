import React from 'react';
import PropTypes from 'prop-types';

const FoodCard = ({className, imgSrc, imgAlt, header, description, children }) => {

    const cardClasses =  `
    ${className}
    w-full
    px-4
    mb-8
    transition ease-in-out
    delay-150 
    hover:scale-105
    `;

    const imgClasses  =  `
    w-full
    h-auto 
    rounded-lg 
    mb-3 
    sm:mb-4
    `;

    return(

        <div className={cardClasses}>
            {imgSrc && (
                <img
                className={imgClasses}
                src={imgSrc}
                alt={imgAlt}
                />
            )}
            <h3 className="font-bold text-base sm:text-lg sm:mb-2"> {header} </h3>
            <p className="text-gray-600 text-sm"> {description} </p>
            {children}
        </div>
    )
};

FoodCard.propTypes = {
    className: PropTypes.string,
    imgAlt: PropTypes.string,
    imgSrc: PropTypes.string,
    header: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.node,
};
  
FoodCard.defaultProps = {
    className: '',
    imgAlt: '',
    imgSrc: '',
    header: '',
    description: '',
};
 
export default FoodCard;