import { useState } from "react";
import React from 'react';
import ExtStandart from "./ExtStandart"
import ExtCard from "./ExtCard";
import EventCard from "./EventCard";
import WineBottlePng from "./assets/wine-bottle.png"
import RestaurantIcon from "./assets/tray.png";
import ExcursionIcon from "./assets/excursion.png";
import SeasonIcon from "./assets/calendar.png";
import RunningIcon from "./assets/running.png";
import OpenAirIcon from "./assets/open-air.png";


const EventCard1 = () => {
    return(
        <EventCard
        imgSrc="https://cdn.amwine.ru/upload/blog/07-02-2019/2.jpg"
        title="Дегустация весенних новинок"
        description="Расслабьтесь и насладитесь сезоном"
        />
    )
}

const EventCard2 = () => {
    return(
        <EventCard
        imgSrc="https://i.pinimg.com/736x/72/79/bc/7279bc3fb8f11d45856513e716181442.jpg"
        title="Дегустация на пляже"
        description="Расслабьтесь и насладитесь сезоном"
        />
    )
}

const EventCard3 = () => {
    return(
        <EventCard
        imgSrc="https://static.tildacdn.one/tild6132-3637-4466-b866-326238653261/_______________21-5-.jpg"
        title="Винный ужин от шеф-повара"
        description="Расслабьтесь и насладитесь сезоном"
        />
    )
}


function EventContent() {

    return (
        <div>

            <div className="bg-[#f0f0f0]">

                <div className=" font-body w-3/4 mx-auto">
                    <div className="w-full h-[625px] pt-[7rem]">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d2/Robert_Young_Vineyards.jpg" className="flex mx-auto max-w-[300px] rounded-[14rem] sm:max-w-[400px] lg:max-w-[700px]"/>

                    </div>

                    <div className="w-3/4">
                        <p className="font-extrabold text-6xl">Дегустация вина</p>
                        <h1 className="mt-4 font-bold text-2xl">Познайте настоящее искусство создания вина вместе с нашими сомелье и виноделами</h1>
                    </div>

                    <hr className="border-gray-400 my-8" />

                    <ul className="pb-8">
                        <button className="bg-[#101316] rounded-2xl "><p className="text-xl text-white mx-4 my-3">Подробнее</p></button>
                    </ul>

                </div>

            </div>

            <div>

                <div className=" font-body w-3/4 mx-auto my-16">

                    <div className="w-3/4">
                        <h1 className="mt-4 font-bold text-3xl">Предстоящие</h1>
                        <p className="font-extrabold text-6xl">Мероприятия</p>
                    </div>

                    <ul className="mx-auto my-8 flex flex-wrap flex-row justify-evenly">
                        
                        <li className="flex flex-col w-[150px]">
                            <img src={WineBottlePng} className="w-[100px] h-[100px] mx-auto bg-[#f0f0f0] p-2 rounded-xl" />
                            <p className="mx-auto my-2 font-bold text-lg">Дегустации</p>
                        </li>

                        <li className="flex flex-col w-[150px]">
                            <img src={RestaurantIcon} className="w-[100px] h-[100px] mx-auto bg-[#f0f0f0] p-2 rounded-xl" />
                            <p className="mx-auto my-2 font-bold text-lg">Ресторан</p>
                        </li>

                        <li className="flex flex-col w-[150px]">
                            <img src={ExcursionIcon} className="w-[100px] h-[100px] mx-auto bg-[#f0f0f0] p-2 rounded-xl" />
                            <p className="mx-auto my-2 font-bold text-lg">Экскурсии</p>
                        </li>

                        <li className="flex flex-col w-[150px]">
                            <img src={SeasonIcon} className="w-[100px] h-[100px] mx-auto bg-[#f0f0f0] p-2 rounded-xl" />
                            <p className="mx-auto my-2 font-bold text-lg">Сезонные</p>
                        </li>

                        <li className="flex flex-col w-[150px]">
                            <img src={RunningIcon} className="w-[100px] h-[100px] mx-auto bg-[#f0f0f0] p-2 rounded-xl" />
                            <p className="mx-auto my-2 font-bold text-lg">Спорт</p>
                        </li>

                        <li className="flex flex-col w-[150px]">
                            <img src={OpenAirIcon} className="w-[100px] h-[100px] mx-auto bg-[#f0f0f0] p-2 rounded-xl" />
                            <p className="mx-auto my-2 font-bold text-lg">Open-air</p>
                        </li>
                    </ul>

                    <div className="relative h-[120px]">
                        <div className="absolute top-0 right-0">
                            <h1 className="mt-4 font-bold text-3xl">Откройте для себя</h1>
                            <p className="font-extrabold text-6xl">Винодельню</p>
                        </div>
                    </div>
                    <ul className="flex flex-row">
                        <ExtCard
                        Card={EventCard1}
                        ExtContent={ExtStandart}/>

                        <ExtCard
                        Card={EventCard2}
                        ExtContent={ExtStandart}/>

                        <ExtCard
                        Card={EventCard3}
                        ExtContent={ExtStandart}/>
                    </ul>

                </div>

            </div>


        </div>
        
    );
}
 
export default EventContent;