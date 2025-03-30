import React from 'react';
import PropTypes from 'prop-types';

import { FaLongArrowAltRight } from "react-icons/fa";

const WineCard = ({ className, imgSrc, imgAlt, header, description, children, onClick }) => {
    const cardClasses = `
    ${className}
    w-[300px]
    h-auto
    px-4
    mb-8
    rounded-lg
    transition ease-in-out
    delay-150 
    hover:scale-105
    hover:shadow-lg
    `;

    const imgClasses = `
    w-[270px]
    h-[270px]
    rounded-lg 
    mb-3 
    sm:mb-4
    `;

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <div className={cardClasses}>
            {imgSrc && (
                <img
                    className={imgClasses}
                    src={imgSrc}
                    alt={imgAlt}
                    onClick={handleClick}
                />
            )}
            <h3 className="font-normal text-base mx-auto text-center sm:text-[24px] sm:leading-[32px] sm:mb-2">{header}</h3>
            {description && <p className="text-gray-600 text-sm">{description}</p>}
            
            {/* Кнопка "Подробнее" */}
            <button 
                className="flex items-center justify-between text-white bg-[#3A2A33] py-2 px-4 w-full my-3 hover:bg-[#5A2A41] transition-colors rounded"
                onClick={handleClick}
                aria-label="Показать подробную информацию"
            >   
                <span className='text-[24px] leading-[32px] font-semibold'>Подробнее</span>
                <FaLongArrowAltRight className='w-[25px] h-[15px] xl:w-[30px] xl:h-[20px] 2xl:w-[35px] 2xl:h-[25px] left-[35px] my-auto'/>
            </button>
            
            {children}
        </div>
    ) ;
};

WineCard.propTypes = {
    className: PropTypes.string,
    imgAlt: PropTypes.string,
    imgSrc: PropTypes.string,
    header: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func,
};

WineCard.defaultProps = {
    className: '',
    imgAlt: '',
    imgSrc: '',
    header: '',
    description: '',
    onClick: null,
};

export default WineCard;
