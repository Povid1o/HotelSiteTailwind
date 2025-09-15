import React from "react";
import './../styles/productionCenter.css'

export default function ProductionCard({title, description, spesialTitle, spesialDesc, imageStyle}){


    return(
        <div className ='w-full flex flex-row bg-white rounded-xl drop-shadow-2xl z-[2]'>

            <div className={`${imageStyle} bg-main_theme bg-no-repeat bg-cover bg-center rounded-l-xl`}></div>


            <div className=" p-10 font-body">
                <h1 className={`uppercase font-bold ${  
                    spesialTitle ? spesialTitle : 'card-title'}`}>{title}</h1>
                <p className={`max-w-screen-lg font-light text-left bg-white pt-8 
                text-xs md:text-xl lg:text-2xl xl:text-3xl ${spesialDesc}`}>
                    {description}
                </p>

            </div>

        </div>
    )
}