import React from 'react';

const ProcessCard = ({ className, imgSrc, imgAlt, header, description }) => {
    const cardClasses = `
    ${className}
    w-[165px]
    h-[190px]
    relative
    rounded-lg
    overflow-hidden
    transition ease-in-out
    delay-150 
    hover:scale-105
    sm:w-[160px]
    sm:h-[183px]
    lg:w-[313px]
    lg:h-[358px]
    xl:w-[350px]
    xl:h-[400px]
    2xl:w-[400px]
    2xl:h-[450px]
    `;

    return (
        <div className={cardClasses}>
            {imgSrc && (
                <img
                    className="w-full h-full object-cover absolute inset-0"
                    src={imgSrc}
                    alt={imgAlt}
                />
            )}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-black bg-opacity-50 xl:p-4 2xl:p-5">
                <h3 className="text-white font-bold text-[12px] leading-[14px] sm:text-[16px] sm:leading-[19px] xl:text-[20px] xl:leading-[24px] 2xl:text-[24px] 2xl:leading-[29px]">
                    {header}
                </h3>
            </div>
        </div>
    );
};

export default ProcessCard;