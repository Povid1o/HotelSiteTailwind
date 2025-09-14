import React from "react";


export default function ProductionCard({title, description}){


    return(
        <div className ='w-full flex flex-row bg-white rounded-xl drop-shadow-2xl z-[2]'>
            <div className="'w-2/3 h-full bg-[url('./components/assets/VineryBackground.png')] bg-no-repeat bg-cover bg-blend-multiply w-full h-screen'">
            </div>

            <div className="w-full p-10 font-body">
                <h1 className="card-title uppercase">{title}</h1>
                <p className="max-w-screen-lg font-light text-left  bg-white text-xs md:text-xl lg:text-2xl xl:text-3xl pt-8">
                    {description}
                </p>

            </div>

        </div>
    )
}