import React from 'react'

const ExtDishCard = () => {
  return (
    <div className='mt-6 size-[95%] max-w-[520px] font-body mx-auto'>
      <div className=' mx-auto rounded-lg my-2'> 
        <img src="https://i.imgur.com/44wBlh1.png" alt="Caprese Salad" className="w-[100%]   rounded-lg"/>
      </div>
       
      <h3 className="text-lg font-semibold font-sans text-center mb-2">Caprese Salad</h3>
      <p className=" text-blue-600 text-md text-center pb-2 ">$12.99</p>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">     
        <div className="p-4">
          <p className="text-gray-600 text-xs ">Caprese salad (Italian: insalata caprese linsa la ta ka'pre ze; -e sel or simply caprese)[1] is an Italian salad, made of sliced fresh mozzarella, tomatoes, and sweet basil, seasoned with salt, and olive oil. It is usually arranged on a plate in restaurant practice. 2|3) Like pizza Margherita, it features the colours of the Italian flag: green, white, and red. In Italy, it is usually served as an antipasto (starter), not a contorno (side dish), and it may be eaten any time of day. The caprese salad is one form of a caprese dish; it may also be served as a caprese pizza, pasta, or sandwich.</p>
          <p className="text-gray-600 text-xs pt-2">110г.</p>
          <p className="text-gray-600 text-xs pt-2">В 100г.: Белки:11,3г.; Жиры:14,4г.; Углеводы:16,9г.; Энерг. Ценность: 252кКал</p>
        </div>
    
      </div>
    </div>
  )
}

export default ExtDishCard