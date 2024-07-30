import React, { useContext, useState } from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite';
import {createType, fetchTypes} from "../http/productAPI.js";

const CreateType = observer(() => {
  const [value, setValue] = useState('')
  const {product} = useContext(Context)
  const addType = async () => {
    try {
      const types = await fetchTypes();
      if (types.some(type => type.name.toLowerCase() === value.toLowerCase())) {
        throw new Error('Тип с таким именем уже существует');
      }
      await createType({name: value});
      setValue('');
      alert('Готово!');
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className='mt-6 size-[95%] max-w-[520px] font-body mx-auto '>

<h3 className="text-lg font-semibold font-sans text-center mb-2 pt-4">Добавить Тип:</h3> <hr/>
      <form className="= text-md text-center py-8 ">
      Введите Тип:<input value={value} onChange={e => setValue(e.target.value)} className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
      </form>
      <div className="bg-white  overflow-hidden text-end">    <hr/> 
        <div className="p-4">
          <button onClick={addType} className="mr-4 text-green-800 hover:bg-gray-50 text-md px-2 shadow-md rounded-lg w-24 h-8">
            Добавить</button>
        </div>
    
      </div>
    </div>
  )
})

export default CreateType