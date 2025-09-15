import React from "react";

export default function ProductionCard({title, description, spesialTitle, spesialDesc, imageStyle}){


    return(
        <div className ='w-full flex flex-row bg-white rounded-xl drop-shadow-2xl z-[2]'>
            {/*<div className="'w-2/3 h-full bg-[url('./components/assets/VineryBackground.png')] bg-no-repeat bg-cover bg-blend-multiply w-full h-screen'">*/}
            {/*</div>*/}
            <div className={`${imageStyle} bg-main_theme bg-no-repeat bg-cover bg-center rounded-l-xl`}></div>


            <div className=" p-10 font-body">
                <h1 className={`card-title uppercase ${spesialTitle}`}>{title}</h1>
                <p className={`max-w-screen-lg font-light text-left  bg-white pt-8 ${spesialDesc}`}>
                    {description}
                </p>

            </div>

        </div>
    )
}