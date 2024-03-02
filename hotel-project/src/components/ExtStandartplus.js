import React from 'react'
import { Carousel } from 'flowbite-react';

const prices = [
  { title: 'Ночь', price: '₽ 20000' },
  { title: 'Неделя', price: '₽ 100000' },
]

const HotelRoom = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 max-h-4/5 max-w-4/5">
      <div className= " relative h-56 w-full mx-auto z-0 sm:h-96">
        <Carousel pauseOnHover>
            <img src="https://media.admagazine.ru/photos/61409580103eaf1470f8df16/16:9/w_2560%2Cc_limit/Room-9-St-Andrea-(1).jpg" className=' object-fit' alt="..." />
            <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/42/0e/53/sant-andrea-9.jpg?w=1200&h=-1&s=1" alt="..." />
            <img src="https://www.pufikhomes.com/wp-content/uploads/2019/03/prekrasnyi-otel-v-italyanskom-stile-monteverdi-v-toskane-pufikhomes-18.jpg" alt="..." />
            <img src="https://media.admagazine.ru/photos/614095809ecf4e1934c47dfd/master/w_1600%2Cc_limit/mtvdi-208.jpg" alt="..." />
            <img src="https://media.admagazine.ru/photos/614095807f460117242d0abb/master/w_1600%2Cc_limit/La-Pieve---02-(3).jpg" alt="..." />
        </Carousel>
      </div>
      {/* <img
        src="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWxzfGVufDB8fDB8fHww"
        
        alt="Hotel Room"
        className="w-full h-full object-cover mb-4 rounded-lg"
      /> */}
      <h2 className="text-2xl font-semibold my-2">Deluxe King Room</h2>
      <p className="text-gray-600 mb-6 text-center">
        Enjoy a spacious and comfortable room with a king-size bed, a flat-screen TV, and a modern bathroom.
      </p>
      <div className="w-full max-w-md space-y-2">
        {prices.map((price, index) => (
          <div
            key={index}
            className="p-4 border border-gray-300 rounded-lg flex justify-between items-center"
          >
            <span className="text-lg font-semibold">{price.title}</span>
            <span className="text-lg font-semibold text-blue-600">{price.price}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HotelRoom