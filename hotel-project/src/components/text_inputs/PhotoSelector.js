import React, { useState } from 'react';
import ExtCard from '../ExtCard';
import ImageWithButton from './ImageWithButton';
import { MdOutlinePhotoCamera } from "react-icons/md";
import Bottle from '../assets/wine-bottle.png'

      
 

const PhotosLayout = ({content}) => {

    const [images, setImages] = useState(content);

    const handleAddImage = () => {
        setImages([...images, Bottle]);
    }

    return ( 
        <div className=''>
            {images.map((photo, index) => (
                <div className='mb-4'>
                    <ImageWithButton image={photo}/>
                </div>
            ))}

            <button
                className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48"
                onClick={handleAddImage}
            >
                    Добавить картинку
            </button>

        </div>
    );
}

const PhotoSelectorButton = ({header}) => {
    return ( 

        <div className="@container w-full">
            <div className="sm:px-4 sm:py-3 ">
                <div
                    className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-[#FBF8EF] sm:rounded-xl min-h-80 " 
                    style={{
                    backgroundImage:
                                    'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("https://cdn.usegalileo.ai/sdxl10/5362d63b-c3ad-40ed-94a9-a4597902cbc7.png")',
                    }}
                >
                    <div className="flex p-4">
                    <p className="text-white tracking-light text-[28px] font-bold leading-tight">{header}</p>
                    </div>
                </div>
            </div>
        </div>

    );
}
 
 

const PhotoSelector = ({ photos, header, ButtonCard }) => {
    return ( 
        <div className='w-full'>

            {/* <ExtCard
                Card={() => <PhotoSelectorButton header={header}/>}
                // Card={() => <ButtonCard />}
                ExtContent={() => <PhotosLayout content={photos}/>}
            /> */}

            {ButtonCard ? 

                (<ExtCard
                    Card={() => <ButtonCard />}
                    ExtContent={() => <PhotosLayout content={photos}/>}
                />) 
                : 
                (<ExtCard
                    Card={() => <PhotoSelectorButton header={header}/>}
                    ExtContent={() => <PhotosLayout content={photos}/>}
                />)}

        </div>
    );
}
 
export default PhotoSelector;