import React, { useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite';
import { createProduct, createRoom, fetchClase, fetchTypes,  } from '../http/productAPI';

const CreateProduct = observer(() => {
  const {product} = useContext(Context)
  
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [file,setFile] = useState(null)
  const [description, setDescription] = useState('')
  const [weight, setWeight] = useState('')
  const [nutrients, setNutrients] = useState('')

  useEffect(() => {
    fetchClase().then(data => product.setClases(data))
    fetchTypes().then(data => product.setTypes(data))
  }, [])
  
  
  const clearInputs = () => {
    setName('');
    setPrice(0);
    setDescription('');
    setWeight('');
    setNutrients('');
    fileInputRef.current.value = '';
  };
  
  
  const selectFile = e => {
    setFile(e.target.files[0])
  }



  const addProduct = async () => {
    try {
      const formData = new FormData();
  
      if (!name || !price || !product.selectedType || !product.selectedClase || !file || !description || !weight || !nutrients) {
        throw new Error('Все поля должны быть заполнены');
      }
  
      formData.append('name', name);
      formData.append('price', `${price}`);
      formData.append('typeId', product.selectedType.id);
      formData.append('claseId', product.selectedClase.id);
      formData.append('img', file);
      formData.append('description', description);
      formData.append('weight', weight);
      formData.append('nutrients', nutrients);
  
      await createProduct(formData).then(clearInputs);
      alert('Готово!');
    } catch (error) {
      alert(error.message);
    }
  }


  
    const [isOpenType, setIsOpenType] = useState(false);
  
    const handleToggleType = () => {
      setIsOpenType(!isOpenType);
    }

    const [isOpenClase, setIsOpenClase] = useState(false);
  
    const handleToggleClase = () => {
      setIsOpenClase(!isOpenClase);
    }
    
  
  return (
    
    <div className='mt-6 size-[95%] max-w-[520px] font-body mx-auto w-3/4 '>
    
      <h3 className="text-lg font-semibold font-sans text-center mb-2">Добавить продукт:</h3>
      <div className="relative  text-left">
        <div>
          <button
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            onClick={handleToggleType}
          >
            {product.selectedType.name || "Выберите тип"}
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

        <div className='pt-2'>
          <button
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            onClick={handleToggleClase}
          >
            {product.selectedClase.name || "Выберите Класс"}
          </button>
        </div>
        {isOpenClase &&(
          <div
          className="origin-top-right  mt-2  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
            <div className="py-1" role="none" onClick={handleToggleClase}>
              
                {product.clases.map((clase)=>
                  <p 
                  onClick={() => product.setSelectedClase(clase)}
                  key={clase.id}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >{clase.name}</p>
                )}
              
            </div>
            
          
          </div>
        )}

  
      </div>

    <form className="= text-md text-center py-8 ">
      Введите название продкута:<input value={name} onChange={e =>setName(e.target.value)} className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
    </form><hr/>

    <form className="= text-md text-center py-8 ">
      Добавьте основное изображение:<input ref={fileInputRef} onChange={selectFile} type='file'  className='ml-2 outline outline-1 outline-main_theme rounded-lg '/>
    </form>
    <hr/>
    <div className="bg-white  overflow-hidden text-end">     
      
    <h3 className="text-lg font-semibold font-sans text-center pt-4 mb-2">Добавить Описание:</h3>
        {'Блюдо' === product.selectedType.name ?
        <div>
          <form className="= text-md text-center py-8 ">
            Введите Описание к продукту:<textarea value={description} onChange={e =>setDescription(e.target.value)} className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
          </form><hr/>
          <form className="= text-md text-center py-8 ">
            Введите вес блюда:<input value={weight} onChange={e =>setWeight(e.target.value)} className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
          </form><hr/>
          <form className="= text-md text-center py-8 ">
            Добавьте нутриенты:<input value={nutrients} onChange={e =>setNutrients(e.target.value)} className='ml-2 outline outline-1 outline-main_theme rounded-lg '/>
          </form>
          <form className="= text-md text-center py-8 ">
            Введите стоимость продкута:<input value={price} onChange={e =>setPrice(Number(e.target.value))}className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
          </form><hr/>         
        </div>
        :
        <div>
          <form className="= text-md text-center py-8 ">
            Введите краткое описание:<textarea className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
          </form><hr/>
          <form className="= text-md text-center py-8 ">
            Введите полное описание:<textarea className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
          </form><hr/>
          <form className="= text-md text-center py-8 ">
            Введите удобства:<textarea className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
          </form><hr/>
          <form className="= text-md text-center py-8 ">
            Введите стоимость комнаты за ночь:<input value={price} onChange={e =>setPrice(Number(e.target.value))}className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
          </form><hr/>
          <form className="= text-md text-center py-8 ">
            Введите стоимость комнаты за неделю:<input value={price} onChange={e =>setPrice(Number(e.target.value))}className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
          </form><hr/>
            
         
          <h className="text-lg font-semibold font-sans text-center pt-4 mb-2">Введите правила размещения:</h>
          <div>
          <form className=" text-md text-center py-8">
              Заезд<input className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
          </form><hr/>
          <form className=" text-md text-center py-8 ">    
              Выезд<input className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
          </form><hr/>
          <form className=" text-md text-center py-8 ">
              Минимальный срок проживания<input className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
          </form><hr/>
          <form className=" text-md text-center py-8 ">
              Наличие животных:<input className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
          </form><hr/>
          <form className=" text-md text-center py-8 ">
              Количество человек на дом:<input className='ml-2 outline outline-1 outline-main_theme rounded-lg'/>
          </form><hr/>
          </div>
          <hr/>
          <form className="= text-md text-center py-8 ">
            Добавьте дополнительное изображение:<input type='file' className='ml-2 outline outline-1 outline-main_theme rounded-lg '/>
          </form><hr/>
          <form className="= text-md text-center py-8 ">
            Добавьте дополнительное изображение :<input type='file' className='ml-2 outline outline-1 outline-main_theme rounded-lg '/>
          </form><hr/>
          <form className="= text-md text-center py-8 ">
            Добавьте дополнительное изображение:<input type='file' className='ml-2 outline outline-1 outline-main_theme rounded-lg '/>
          </form><hr/>
          <form className="= text-md text-center py-8 ">
            Добавьте дополнительное изображение:<input type='file' className='ml-2 outline outline-1 outline-main_theme rounded-lg '/>
          </form><hr/>        
        </div>  
        
        }
      <div className="p-4 " >

        <button onClick={addProduct} className="mr-4 text-green-800 hover:bg-gray-50 text-md px-2 shadow-md rounded-lg w-24 h-8">
          Добавить
        </button>
      </div>
    </div>
  </div>
  )
})

export default CreateProduct