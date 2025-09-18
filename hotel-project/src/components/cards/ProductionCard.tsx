import React from "react";
import './../styles/productionCenter.css'
import {Link} from "react-router-dom";
import {FaLongArrowAltRight} from "react-icons/fa";
// @ts-ignore
import VideoPlayer from "../VideoPlayer.tsx";

export default function ProductionCard({
                                           title,
                                           description,
                                           spesialTitle,
                                           spesialDesc,
                                           imageStyle,
                                           bgImg,
                                           flexReverse,
                                           specialStyle,
                                           extraBlock, videoUrl
                                       }){


    return(
        <div className ={`${specialStyle} w-full flex ${flexReverse ? 'flex-row lg:flex-row-reverse' : 'flex-row'} justify-between bg-white rounded-xl drop-shadow-2xl z-[2]`}>

            <div className={`${imageStyle} min-h-30 relative bg-main_theme bg-no-repeat bg-cover bg-center rounded-l-xl 
            ${flexReverse ? 'lg:rounded-l-none lg:rounded-r-xl' :''} `}
            style={videoUrl ? {} : {backgroundImage: `url('${bgImg}')`}}>
                {videoUrl ? (
                    <VideoPlayer sourceUrl={videoUrl}></VideoPlayer>
                ): ('')}
            </div>

            <div className='flex flex-col justify-between p-10'>
                <div className=" font-body">
                    <h1 className={`uppercase font-bold ${  
                        spesialTitle ? spesialTitle : 'card-title'}`}>{title}</h1>
                    <p className={`max-w-screen-lg font-light text-left bg-white pt-8 
                    text-l md:text-xl lg:text-2xl xl:text-3xl ${spesialDesc}`}>
                        {description}
                    </p>

                </div>
                <div>{extraBlock && (
                    <>
                        <button className="flex justify-start items-end">
                            <div className='flex-col inline-block py-8 pr-8 bottom-3'>
                                <Link to='/Каталог'>
                                    <div className='flex flex-row'>
                                        <a className='text-[#3E4756] leading-[38px] mx-2 text-lg mobile:text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-semibold'>Перейти</a>
                                        {/*@ts-ignore*/}
                                        <FaLongArrowAltRight className='w-[25px] h-[15px] xl:w-[30px] xl:h-[20px] 2xl:w-[35px] 2xl:h-[25px] left-[35px] my-auto'/>
                                    </div>
                                    <hr className="border-gray-400 w-full my-2" />
                                </Link>
                            </div>
                        </button>
                    </>
                )}
                </div>
            </div>
        </div>
    )
}