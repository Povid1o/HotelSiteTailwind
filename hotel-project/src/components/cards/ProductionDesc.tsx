import React from "react";

export default function ProductionDesc({title, description, position}){
    return(
        <div className={`flex ${position}`}>
            <div className={`text-white max-w-[700px]`}>
                <h1 className="text-[30px] sm:text-[45px] md:text-[50px] lg:text-[64px] font-bold uppercase">{title}</h1>
                <p className="max-w-screen-lg font-light text-left text-xs md:text-xl lg:text-2xl xl:text-3xl pt-8">
                    {description}
                </p>
            </div>
        </div>
    )
}