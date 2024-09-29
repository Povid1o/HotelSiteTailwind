import React from 'react'

const ExtDishcard = ({imgSrc, imgAlt, header, price, weight, description, children }) => {
  return (
    <div className='mt-6 size-[95%] max-w-[520px] font-body mx-auto'>
      <div className=' mx-auto rounded-lg my-2'> 
        <img src={imgSrc} alt={imgAlt} className="w-[100%] rounded-lg"/>
      </div>
       
      <h3 className="text-lg font-semibold font-sans text-center mb-2">{header}</h3>
      <p className=" text-blue-600 text-md text-center pb-2 ">${price}</p>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">     
        <div className="p-4">
          <p className="text-gray-600 text-xs ">{description}</p>
          <p className="text-gray-600 text-xs pt-2">{weight}</p>
          {/* <p className="text-gray-600 text-xs pt-2">В 100г.: Белки:11,3г.; Жиры:14,4г.; Углеводы:16,9г.; Энерг. Ценность: 252кКал</p> */}
        </div>
    
      </div>
    </div>
  )
}

export default ExtDishcard