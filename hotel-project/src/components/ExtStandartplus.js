import React from 'react'
import BlueSwiper from './BlueSwiper'
import './hover.css'

const prices = [
  { title: 'Ночь', price: '₽ 20000' },
  { title: 'Неделя', price: '₽ 100000' },
]

const HotelRoom = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 max-h-4/5 max-w-4/5 ">
      <div className= " flex flex-col h-60 w-full md:h-80 z-0 min-w-60 lg:h-96">
        <BlueSwiper/>
      </div>
      {/* <img
        src="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWxzfGVufDB8fDB8fHww"
        
        alt="Hotel Room"
        className="w-full h-full object-cover mb-4 rounded-lg"
      /> */}
      <h2 className="text-2xl font-semibold my-4">Deluxe King Room</h2>
      <h1 className="text-gray-600 mb-6 text-center">
        Enjoy a spacious and comfortable room with a king-size bed, a flat-screen TV, and a modern bathroom.
      </h1>
      <div className='w-full'>
        <div className='w-1/2 flex flex-col'>
          <h1 className='text-base'>Описание</h1>
          <p className='text-sm'>Enjoy a spacious and comfortable room with a king-size bed, a flat-screen TV, and a modern bathroom.</p>


        </div>
        

      </div>
      <div className="w-full max-w-md space-y-2">
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
      <h1 className='text-lg mt-8 font-body'>Deluxe room – это:</h1>
      <p className='mt-4 font-body text-gray-600 text-wrap text-left'>
        - комфортная, обустроенная по современным меркам комната площадью 20-40 квадратных метров (реже – две);<br/><br/>
        - хороший, но не уникальный ремонт;<br/><br/>
        - отдельный санузел с душем, унитазом и биде;<br/><br/>
        - качественная и стильная, но не слишком дорогая мебель;<br/><br/>
        - мягкая и удобная кровать (или кровати) с ортопедическим матрасом, возможно – дополнительно диван или кресло;<br/><br/>
        - уютное и приятное постельное белье;<br/><br/>
        - лучшие в отеле виды из окон (не обязательно они должны быть самыми красивыми в городе);<br/><br/>
        - качественная ежедневная уборка;<br/><br/>
        - скромный, но достойный ассортимент услуг.<br/><br/>
        - Типовой номер класса Делюкс рассчитан на двух человек, но по договоренности в нем может поселиться третий гость, к примеру – со спальным местом на диване.<br/>
      </p>
    </div>
  )
}

export default HotelRoom