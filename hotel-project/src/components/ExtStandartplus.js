import React from 'react'
import BlueSwiper from './BlueSwiper'
import './hover.css'

const prices = [
  { title: 'Ночь', price: '₽ 20000' },
  { title: 'Неделя', price: '₽ 100000' },
]

const HotelRoom = () => {
  return (
    <div className="flex flex-col items-center justify-center max-h-4/5 max-w-5/6">
      {/* Image Swiper */}
      <div className= " flex flex-col h-60 w-full md:h-80 z-0 min-w-60 lg:h-96">
        <BlueSwiper/>
      </div>
      {/* Image Swiper */}


      {/* Header */}
      <h2 className="text-2xl font-semibold my-4">Стандарт+</h2>
      {/* Header */}



      <ul className='flex flex-wrap justify-center flex-row mx-auto mb-5'>

        <li className='flex flex-row'>
          <span className='h-2 w-2 bg-main_theme rounded-full my-auto mr-2'/>
          <p>3 человека</p>
        </li>

        <li className='flex flex-row'>
          <span className='h-2 w-2 bg-main_theme rounded-full my-auto mr-2'/>
          <p>2 кровати</p>
        </li>
        <li className='flex flex-row'>
          <span className='h-2 w-2 bg-main_theme rounded-full my-auto mr-2'/>
          <p>2 спальни</p>
        </li>
        <li className='flex flex-row'>
          <span className='h-2 w-2 bg-main_theme rounded-full my-auto mr-2'/>
          <p>160 м до моря</p>
        </li>
        <li className='flex flex-row'>
          <span className='h-2 w-2 bg-main_theme rounded-full my-auto mr-2'/>
          <p>Свой мангал</p>
        </li>

      </ul>


      <div className='grid grid-cols-1 mb-5 md:grid-cols-2 gap-5 lg:gap-32'>

        <div className=' flex flex-col max-md:mb-5 '>
          <h1 className='text-2xl font-semibold mb-3'>Описание</h1>
          <p className='text-base'>Аппартаменты расположены в 160 м. От моря, красивой набережной и открытыми пляжами. Разнообразие кофеин, ресторанов на любой вкус и бюджет. Велодорожка вдоль всей набережной, протяжённостью 12 км. </p>
        </div>

        <div className=' flex flex-col'>
          <h1 className='text-2xl font-semibold mb-3'>Удобства</h1>

          <ul className='grid grid-cols-2 gap-1'>

            <div className='flex flex-row'>
              <span className='h-1 w-1 bg-main_theme rounded-full my-auto mr-1'/>
              <p className='my-auto'>Бассейн</p>
            </div>
            <div className='flex flex-row'>
              <span className='h-1 w-1 bg-main_theme rounded-full my-auto mr-1'/>
              <p className='my-auto'>Автостоянка</p>
            </div>
            <div className='flex flex-row'>
              <span className='h-1 w-1 bg-main_theme rounded-full my-auto mr-1'/>
              <p className='my-auto'>Wi-Fi</p>
            </div>
            <div className='flex flex-row'>
              <span className='h-1 w-1 bg-main_theme rounded-full my-auto mr-1'/>
              <p className='my-auto'>Свой двор</p>
            </div>
            <div className='flex flex-row'>
              <span className='h-1 w-1 bg-main_theme rounded-full my-auto mr-1'/>
              <p className='my-auto'>Спутник/кабель ТВ</p>
            </div>
            <div className='flex flex-row'>
              <span className='h-1 w-1 bg-main_theme rounded-full my-auto mr-1'/>
              <p className='my-auto'>Холодильник</p>
            </div>
            <div className='flex flex-row'>
              <span className='h-1 w-1 bg-main_theme rounded-full my-auto mr-1'/>
              <p className='my-auto'>Душ</p>
            </div>
            <div className='flex flex-row'>
              <span className='h-1 w-1 bg-main_theme rounded-full my-auto mr-1'/>
              <p className='my-auto'>Сейф</p>
            </div>

          </ul>

        </div>

      </div>



      <div className="w-full max-w-md space-y-2">
        <h2 className="text-2xl font-semibold my-4">Цены</h2>
        {prices.map((price, index) => (
          <div
            key={index}
            className="p-4 border border-gray-300 rounded-lg flex justify-between items-center"
          >
            <span className="text-lg font-semibold">{price.title}</span>
            <span className="text-lg font-semibold text-main_theme underlineCard ">{price.price}</span>
          </div>
        ))}
      </div>

      
      <div className='my-9 mr-auto'>
        <strong className='text-2xl font-semibold'>Правила Размещения</strong>

        <ul className='my-5 grid grid-cols-1 gap-x-20 gap-y-5 md:grid-cols-2'>

          <div className='grid grid-cols-2 gap-x-20 gap-y-5'>
            <div>
              <h1 className='text-xl font-bold'>Заезд</h1>
              <p>С 13:00</p>
            </div>

            <div>
              <h1 className='text-xl font-bold'>Выезд</h1>
              <p>до 22:00</p>
            </div>
          </div>

          <div>
            <h1 className='text-xl font-bold'>Минимальный срок проживания</h1>
            <p>С 14:00 до 22:00</p>
          </div>

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
  )
}

export default HotelRoom