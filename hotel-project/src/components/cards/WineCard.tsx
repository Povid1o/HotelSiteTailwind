import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { FaLongArrowAltRight } from "react-icons/fa";

interface Wine {
  id: number;
  name: string;
  image: string;
  type?: string;
  year?: number;
  sweetness?: string;
  alcohol?: string;
  sugar?: string;
  temperature: string;
  price?: number;
  description?: string[];
}

interface WineCardProps {
  className?: string;
  imgSrc?: string;
  imgAlt?: string;
  header?: string;
  description?: string;
  children?: ReactNode;
  to?: string; 
  state?: {wine: Wine}
}

const WineCard: React.FC<WineCardProps> = ({
  className = '',
  imgSrc = '',
  imgAlt = '',
  header = '',
  description = '',
  children,
  to = '',
  state,
}) => {
  const cardClasses = `
    ${className}
    w-[330px]
    h-auto
    px-4
    py-2
    mb-8
    rounded-lg
    transition ease-in-out
    delay-150
    md:w-[300px]
    lg:w-[360px]
    hover:scale-105
    hover:shadow-lg
  `;

  const imgClasses = `
    w-[297px]
    h-[297px]
    rounded-lg
    mb-3
    sm:mb-4
    md:w-[270px]
    md:h-[270px]
    lg:w-[330px]
    lg:h-[330px]
  `;

  // const handleClick = () => {
  //   if (onClick) {
  //     onClick();
  //   }
  // };

  return (
    <div className={cardClasses}>
      {imgSrc && (
        <img
          className={imgClasses}
          src={imgSrc}
          alt={imgAlt}
        />
      )}
      <h3 className="font-bold text-base mx-auto text-center content-center sm:text-[24px] sm:leading-[32px] sm:mb-2 md:h-[72px]">{header}</h3>
      {description && <p className="text-gray-600 text-sm">{description}</p>}

      {/* Кнопка "Подробнее" */}
      <Link
        to={to}
        state={state}
        className="flex items-center justify-between text-white bg-[#3A2A33] py-2 px-4 w-full mt-3 mb-3 hover:bg-[#5A2A41] transition-colors rounded"
        aria-label="Показать подробную информацию"
      >
        <span className='text-[24px] leading-[32px] font-semibold'>Подробнее</span>
        <FaLongArrowAltRight className='w-[25px] h-[15px] xl:w-[30px] xl:h-[20px] 2xl:w-[35px] 2xl:h-[25px] left-[35px] my-auto'/>
      </Link>

      {children}
    </div>
  );
};

export default WineCard;