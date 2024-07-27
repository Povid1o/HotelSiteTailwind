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

  const changeType = async () => {
    try {
      if (!selectedType) {
        throw new Error('Выберите тип для изменения');
      }
      await updateType(selectedType.id, {name: value});
      setValue('');
      alert('Готово!');
      fetchTypes().then(data => setTypes(data))
    } catch (error) {
      alert(error.message);
    }
  }

  const deleteSelectedType = async () => {
    try {
      if (!selectedType) {
        throw new Error('Выберите тип для удаления');
      }
      await deleteType(selectedType.id);
      alert('Готово!');
      fetchTypes().then(data => setTypes(data))
    } catch (error) {
      alert(error.message);
    }
  }
  
  return (
    <div className='mt-6 size-[95%] max-w-[520px] font-body mx-auto '>

<h3 className="text-lg font-semibold font-sans text-center mb-2 pt-4">Изменить тип:</h3> <hr/>
      <form className="= text-md text-center py-8 ">
      Введите тип:<input value={value} onChange={e => setValue(e.target.value)} className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
      </form>
      <div className="bg-white  overflow-hidden text-end">    <hr/> 
        <div className="p-4">
          <button onClick={addType} className="mr-4 text-green-800 hover:bg-gray-50 text-md px-2 shadow-md rounded-lg w-24 h-8">
            Добавить
          </button>
          <button onClick={changeType} className="mr-4 text-blue-800 hover:bg-gray-50 text-md px-2 shadow-md rounded-lg w-24 h-8">
            Изменить
          </button>
          <button onClick={deleteSelectedType} className="mr-4 text-red-800 hover:bg-gray-50 text-md px-2 shadow-md rounded-lg w-24 h-8">
            Удалить
          </button>
        </div>

        <div className="p-4">
          <select value={selectedType?.id} onChange={e => setSelectedType(types.find(type => type.id === e.target.value))} className='ml-2 outline outline-1 outline-main_theme rounded-lg'>
            <option value="">Выберите тип</option>
            {types.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        <div className="p-4">
          <ul>
            {types.map(type => (
              <li key={type.id}>{type.name}</li>
            ))}
          </ul>
        </div>
    
      </div>
    </div>
  )
})

export default CreateType