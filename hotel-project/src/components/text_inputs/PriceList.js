//Ебани сюда в пропс загружаемый массив цен и прочей хуйни
import React, { useState } from 'react';
import { IoIosClose } from "react-icons/io";


const Button = ({ icon, text, func }) => {
  return (
    <button
      className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 ${
        icon ? 'bg-[#FAC638] text-[#AB2217]' : 'bg-[#F5EFDB] text-[#201A09]'
      } text-base font-bold leading-normal tracking-[0.015em]`}
      onClick={func}
      
    >
      {icon ? (
        <div className="text-[#201A09]" data-icon={icon} data-size="20px" data-weight="regular">
          <div width="20px" height="20px">
            {icon}
          </div>
        </div>
      ) : (
        <span className="truncate">{text}</span>
      )}
    </button>
  );
};

//пряяяям сюда, вот в прайс лист, ага, как сделать посмотри в баттоне сверху
function PriceList({globalPrices, onSave = () => {}}) {
  // const [prices, setPrices] = useState([
  //   { title: '', price: '' },
  // ]);
  const [prices, setPrices] = useState(globalPrices);
  const [isDirty, setDirty] = useState(false);

  const handleTitleChange = (index, value) => {
    setPrices((prevPrices) => {
      prevPrices[index].title = value;
      setDirty(true);
      return [...prevPrices];
    });
  };

  const handlePriceChange = (index, value) => {
    setPrices((prevPrices) => {
      prevPrices[index].price = value;
      setDirty(true);
      return [...prevPrices];
    });
  };

  const handleAddField = () => {
    setPrices((prevPrices) => [...prevPrices, { title: '', price: '' }]);
  };

  const handleRemoveField = (index) => {
    setPrices((prevPrices) => prevPrices.filter((_, i) => i !== index));
  };

  const handleResetDirty = () => {
    setDirty(false);
    if (onSave) {
      onSave(prices); 
    }
  };

  return (
    <div className="w-full max-w-lg">

      {prices.map((price, index) => (
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
                <input
                    placeholder="Период..."
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#201A09] focus:outline-0 focus:ring-0 border border-[#EFE3C3] bg-[#FBF8EF] focus:border-[#EFE3C3] h-14 placeholder:text-[#A07D1C] p-[15px] text-base font-normal leading-normal"
                    value={price.title}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                />
            </label>
            <label className="flex flex-col min-w-40 flex-1">
                <input
                    placeholder="Цена..."
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#201A09] focus:outline-0 focus:ring-0 border border-[#EFE3C3] bg-[#FBF8EF] focus:border-[#EFE3C3] h-14 placeholder:text-[#A07D1C] p-[15px] text-base font-normal leading-normal"
                    value={price.price}
                    onChange={(e) => handlePriceChange(index, e.target.value)}
                />
            </label>
            <label>
                <Button func={() => handleRemoveField(index)} text="Удалить" icon={<IoIosClose className='h-[20px] w-[20px]'/>}/>
            </label>
        
        </div>
      ))}
        <div className="flex justify-stretch">
            <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
              <Button text="Добавить" func={handleAddField} />
              {/* <Button text="Cancel" /> */}
              {isDirty && (
                <Button text="Сохранить" func={handleResetDirty} />
              )}
            </div>
        </div>
    </div>
    
  );
}

export default PriceList;