import React, { useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../../index'
import { observer } from 'mobx-react-lite';
// В CreateClase.tsx и EditProduct.tsx
import { updateProduct, fetchClase, fetchTypes, fetchOneProduct } from '../http/productAPI';

interface EditProductProps {
  productId: number;
  onClose?: () => void;
}

const EditProduct = observer(({ productId, onClose }: EditProductProps) => {
  const {product} = useContext(Context)
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [weight, setWeight] = useState('')
  const [nutrients, setNutrients] = useState('')
  const [currentImg, setCurrentImg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем данные продукта
        const productData = await fetchOneProduct(productId);
        setName(productData.name || '');
        setPrice(productData.price || 0);
        setDescription(productData.description || '');
        setWeight(productData.weight || '');
        setNutrients(productData.nutrients || '');
        setCurrentImg(productData.img || '');
        
        // Загружаем типы и классы
        const [clases, types] = await Promise.all([
          fetchClase(),
          fetchTypes()
        ]);
        
        product.setClases(clases);
        product.setTypes(types);
        
        // Устанавливаем выбранные тип и класс
        const selectedType = types.find((t: any) => t.id === productData.typeId);
        const selectedClase = clases.find((c: any) => c.id === productData.classId);
        
        if (selectedType) product.setSelectedType(selectedType);
        if (selectedClase) product.setSelectedClase(selectedClase);
        
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки данных продукта:', error);
        alert('Ошибка загрузки данных продукта');
        setLoading(false);
      }
    };
    
    loadData();
  }, [productId, product])
  
  const clearInputs = () => {
    setName('');
    setPrice(0);
    setDescription('');
    setWeight('');
    setNutrients('');
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  const updateProductHandler = async () => {
    try {
      const formData = new FormData();
  
      if (!name || !price || !product.selectedType || !product.selectedClase || !description || !weight || !nutrients) {
        throw new Error('Все поля должны быть заполнены');
      }
  
      formData.append('name', name);
      formData.append('price', `${price}`);
      formData.append('typeId', product.selectedType.id);
      formData.append('claseId', product.selectedClase.id);
      formData.append('description', description);
      formData.append('weight', weight);
      formData.append('nutrients', nutrients);
      
      // Добавляем файл только если он выбран
      if (file) {
        formData.append('img', file);
      }
  
      await updateProduct(productId, formData);
      alert('Продукт успешно обновлен!');
      if (onClose) onClose();
    } catch (error: any) {
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

  if (loading) {
    return (
      <div className='mt-6 size-[95%] max-w-[520px] font-body mx-auto w-3/4 text-center'>
        <p>Загрузка...</p>
      </div>
    );
  }
  
  return (
    <div className='mt-6 size-[95%] max-w-[520px] font-body mx-auto w-3/4 '>
    
      <h3 className="text-lg font-semibold font-sans text-center mb-2">Редактировать продукт:</h3>
      <div className="relative text-left">
        <div>
          <button
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            onClick={handleToggleType}
          >
            {product.selectedType.name || "Выберите тип"}
          </button>
        </div>
        {isOpenType && (
          <div
            className="origin-top-right mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1" role="none" onClick={handleToggleType}>
              {product.types.map((type: any) =>
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
        {isOpenClase && (
          <div
            className="origin-top-right mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1" role="none" onClick={handleToggleClase}>
              {product.clases.map((clase: any) =>
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

      <form className="text-md text-center py-8">
        Название продукта:<input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          className='ml-2 outline outline-1 outline-main_theme rounded-lg'
        />
      </form><hr/>

      <form className="text-md text-center py-8">
        Изображение продукта:<input 
          ref={fileInputRef} 
          onChange={selectFile} 
          type='file'  
          className='ml-2 outline outline-1 outline-main_theme rounded-lg'
        />
        {currentImg && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">Текущее изображение: {currentImg}</p>
          </div>
        )}
      </form>
      <hr/>
      
      <div className="bg-white overflow-hidden text-end">     
        <h3 className="text-lg font-semibold font-sans text-center pt-4 mb-2">Описание продукта:</h3>
        
        <form className="text-md text-center py-8">
          Описание продукта:<textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            className='ml-2 outline outline-1 outline-main_theme rounded-lg'
          />
        </form><hr/>
        
        <form className="text-md text-center py-8">
          Вес блюда:<input 
            value={weight} 
            onChange={e => setWeight(e.target.value)} 
            className='ml-2 outline outline-1 outline-main_theme rounded-lg'
          />
        </form><hr/>
        
        <form className="text-md text-center py-8">
          Нутриенты (БЖУ):<input 
            value={nutrients} 
            onChange={e => setNutrients(e.target.value)} 
            className='ml-2 outline outline-1 outline-main_theme rounded-lg'
          />
        </form>
        
        <form className="text-md text-center py-8">
          Стоимость продукта:<input 
            value={price} 
            onChange={e => setPrice(Number(e.target.value))}
            className='ml-2 outline outline-1 outline-main_theme rounded-lg'
          />
        </form><hr/>         

        <div className="p-4">
          <button 
            onClick={updateProductHandler} 
            className="mr-4 text-green-800 hover:bg-gray-50 text-md px-2 shadow-md rounded-lg w-24 h-8"
          >
            Сохранить
          </button>
          {onClose && (
            <button 
              onClick={onClose} 
              className="text-gray-800 hover:bg-gray-50 text-md px-2 shadow-md rounded-lg w-24 h-8"
            >
              Отмена
            </button>
          )}
        </div>
      </div>
    </div>
  )
})

export default EditProduct