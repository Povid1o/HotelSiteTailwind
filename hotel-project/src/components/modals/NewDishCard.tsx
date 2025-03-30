import React, { useState } from 'react';
import PhotoSelector from '../text_inputs/PhotoSelector';
import PriceList from '../text_inputs/PriceList';
import DescriptionInput from '../text_inputs/DescriptionInput';
import MultiInputField from '../text_inputs/MultiInputField';
import Button from '../text_inputs/Button';
import { MdModeEdit } from "react-icons/md";

// const Button = ({ icon, text }) => {
//     return (
//       <button
//         className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 ${
//           icon ? 'bg-[#FAC638] text-[#AB2217]' : 'bg-[#F5EFDB] text-[#201A09]'
//         } text-base font-bold leading-normal tracking-[0.015em]`}
//       >
//         {icon ? (
//           <div className="text-[#201A09]" data-icon={icon} data-size="20px" data-weight="regular">
//             <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
//               {/* SVG path */}
//             </svg>
//           </div>
//         ) : (
//           <span className="truncate">{text}</span>
//         )}
//       </button>
//     );
//   };



 

const NewDishCard = ({dishName, photos, description, descriptionBrief, price, weight}) => {

    const [localName, ChangeName] = useState(dishName)
    const [changeNameState, ChangeNameState] = useState(false)

    const handleSave = (newValue) => {
        ChangeName(newValue)
        ChangeNameState(false)
    }

    return (
        <section className="relative flex w-full flex-col bg-[#FBF8EF] rounded-lg overflow-x-hidden">

            <header className="flex items-center h-[70px] justify-between whitespace-nowrap border-b border-solid border-b-[#F5EFDB] px-10 py-3">
                <div className="flex items-center gap-4 text-[#201A09]">
                    {!changeNameState ? (
                        <>
                            <h2 className="text-[#201A09] text-lg font-bold leading-tight tracking-[-0.015em]">{localName}</h2>
                            <label>
                                <Button icon={<MdModeEdit className='h-[20px] w-[20px]'/>} func={ChangeNameState}/>
                            </label>
                        </>
                        ) : 
                        (<>
                            <DescriptionInput inputField={true} horizontal={true} onSave={handleSave}/>

                        </>)
                    }
                    {/* <h2 className="text-[#201A09] text-lg font-bold leading-tight tracking-[-0.015em]">Номер {roomName}</h2>
                    <label>
                        <Button icon={<MdModeEdit className='h-[20px] w-[20px]'/>} func={}/>
                    </label> */}

                </div>
            </header>

            <div className="px-20 flex flex-1 justify-center py-5 lg:px-40">
                
                <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                    <PhotoSelector photos={photos} header={"Фото Блюда"}/>
                    
                    <h4 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">Описание</h4>
                    <DescriptionInput text={description}/>

                    <h4 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">Краткое описание</h4>
                    <DescriptionInput text={descriptionBrief}/>
                    
                    <div className="flex justify-stretch">
                        <div className="flex flex-1 gap-10 flex-wrap px-4 py-3 justify-around">
                            <div className='flex flex-col'>
                                <h2 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] text-left pb-3 pt-5">Цена</h2>
                                <DescriptionInput inputField={true} text={price} />
                            </div>
                            
                            <div className='flex flex-col'>
                                <h3 className="text-[#201A09] text-[22px] font-bold leading-tight tracking-[-0.015em] text-left pb-3 pt-5">Вес</h3>
                                <DescriptionInput inputField={true} text={weight} />
                            </div>
                        </div>
                    </div>

                </div>


            </div>
            
        </section>
    );
}
 
export default NewDishCard;