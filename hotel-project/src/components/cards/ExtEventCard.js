import React from 'react';
import PropTypes from 'prop-types';
import BlueSwiper from '../BlueSwiper';
import '../hover.css';

const ExtEventCard = ({
  headerTitle,
  features,
  description,
  amenities,
  prices,
  rules,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center max-h-4/5 max-w-5/6`}>
      {/* Image Swiper */}
      <div className="flex flex-col h-60 w-full md:h-80 z-0 min-w-60 lg:h-96">
        <BlueSwiper />
      </div>
      {/* Image Swiper */}

      {/* Header */}
      <h2 className="text-2xl font-semibold my-4">{headerTitle}</h2>
      {/* Header */}

      <div className="grid grid-cols-1 mb-5 md:grid-cols-2 gap-5 lg:gap-32">
        <div className="flex flex-col max-md:mb-5">
          <h1 className="text-2xl font-semibold mb-3">Описание</h1>
          <p className="text-base">{description}</p>
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold mb-3">Удобства</h1>
          <ul className="grid grid-cols-2 gap-1">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex flex-row">
                <span className="h-1 w-1 bg-main_theme rounded-full my-auto mr-1" />
                <p className="my-auto">{amenity}</p>
              </div>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full max-w-md space-y-2">
        <h2 className="text-2xl font-semibold my-4">Цены</h2>
        {prices.map((price, index) => (
          <div key={index} className="p-4 border border-gray-300 rounded-lg flex justify-between items-center">
            <span className="text-lg font-semibold">{price.title}</span>
            <span className="text-lg font-semibold text-main_theme underlineCard">{price.price}</span>
          </div>
        ))}
      </div>

      <div className="my-9 mr-auto">
        <strong className="text-2xl font-semibold">Правила Размещения</strong>
        <ul className="my-5 grid grid-cols-1 gap-x-20 gap-y-5 md:grid-cols-2">
          {rules.map((rule, index) => (
            <div key={index} className="grid grid-cols-2 gap-x-20 gap-y-5">
              <div>
                <h1 className="text-xl font-bold">{rule.title}</h1>
                <p>{rule.description}</p>
              </div>
            </div>
          ))}
        </ul>

        <ul className='grid grid-cols-1 gap-4 sm:grid-cols-3 sm:flex flex-row justify-around'>
          <div className='flex flex-row mr-5'>
            <span className='h-1 w-1 bg-main_theme rounded-full my-auto mr-1'/>
            <p className='my-auto'>18+</p>
          </div>
          <div className='flex flex-row mr-5'>
            <span className='h-1 w-1 bg-main_theme rounded-full my-auto mr-1'/>
            <p className='my-auto'>Нельзя с животными</p>
          </div>
          <div className='flex flex-row mr-5'>
            <span className='h-1 w-1 bg-main_theme rounded-full my-auto mr-1'/>
            <p className='my-auto'>Не больше указанного количества человек на дом</p>
          </div>
        </ul>
      </div>
    </div>
  );
};

ExtEventCard.propTypes = {
  headerTitle: PropTypes.string,
  features: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.string,
  amenities: PropTypes.arrayOf(PropTypes.string),
  prices: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      price: PropTypes.string,
    })
  ),
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  className: PropTypes.string,
};

ExtEventCard.defaultProps = {
  headerTitle: '',
  features: [],
  description: '',
  amenities: [],
  prices: [],
  rules: [],
  className: '',
};

export default ExtEventCard;