import React from 'react'
import BlueSwiper from './BlSwiper';

const prices = [
  { title: 'Ночь', price: '₽1000' },
  { title: 'Неделя', price: '₽7000' },
]

const HotelRoom = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 max-h-4/5 max-w-4/5 ">
      <div className= "flex flex-col h-60 w-full md:h-80 z-0 min-w-60 lg:h-96">
        <BlueSwiper/>
      </div>
      {/* <img
        src="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWxzfGVufDB8fDB8fHww"
        
        alt="Hotel Room"
        className="w-full h-full object-cover mb-4 rounded-lg"
      /> */}
      <h2 className="text-base text-center font-semibold my-2 md:text-xl  lg:text-2xl">Deluxe King Room</h2>
      <p className="text-gray-600 mb-6 text-center text-xs md:text-base  lg:text-lg">
        Enjoy a spacious and comfortable room with a king-size bed, a flat-screen TV, and a modern bathroom.
      </p>
      <div className="w-full max-w-md space-y-2">
        {prices.map((price, index) => (
          <div
            key={index}
            className="p-4 border border-gray-300 rounded-lg flex justify-between items-center"
          >
            <span className="text-base font-semibold md:text-lg  lg:text-xl">{price.title}</span>
            <span className="text-base font-semibold text-blue-600 md:text-lg  lg:text-xl">{price.price}</span>
          </div>
          
        ))}
      </div>
    </div>
  )
}

export default HotelRoom