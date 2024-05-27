import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite';
import {createClase, fetchClase, fetchTypes} from "../http/productAPI.js";

const CreateClase = observer(() => {
  const [value, setValue] = useState('')
  const {product} = useContext(Context)
  
  useEffect(() => {
    fetchTypes().then(data => product.setTypes(data))
  }, [])
  
  const addClase = async () => {
    


    
    try {
      const clases = await fetchClase();
      if (clases.some(clase => clase.name.toLowerCase() === value.toLowerCase())) {
        throw new Error('Класс с таким именем уже существует');
      }
      await createClase({name: value});
      setValue('');
      alert('Готово!');
    } catch (error) {
      alert(error.message);
    }
  }
  
  const [isOpenType, setIsOpenType] = useState(false);
  
  const handleToggleType = () => {
    setIsOpenType(!isOpenType);
  }

  
  
  return (
    <div className='mt-6 size-[95%] max-w-[520px] font-body mx-auto '>
        
        <div>
          <button
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            onClick={handleToggleType}
          >
            {product.selectedType.name || "Выберите Тип"}
          </button>
        </div>
        {isOpenType &&(
          <div
          className="origin-top-right  mt-2  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
            <div className="py-1" role="none" onClick={handleToggleType}>
              
                {product.types.map((type)=>
                  <p
                  onClick={() => product.setSelectedType(type)}
                  key={type.id}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >{type.name}</p>
                )}
              
            </div>
            
          
          </div>
        )}

<h3 className="text-lg font-semibold font-sans text-center mb-2 pt-4">Добавить Класс:</h3> <hr/>
      <form className="= text-md text-center py-8 ">
      Введите Класс:<input value={value} onChange={e => setValue(e.target.value)} className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
      </form>
      <div className="bg-white  overflow-hidden text-end">    <hr/> 
        <div className="p-4">
          <button onClick={addClase} className="mr-4 text-green-800 hover:bg-gray-50 text-md px-2 shadow-md rounded-lg w-24 h-8">
            Добавить</button>
        </div>
    
      </div>
    </div>
  )
})

export default CreateClase