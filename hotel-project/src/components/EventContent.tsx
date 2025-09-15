import { useState } from "react";
import React from 'react';
import ExtStandart from "./cards/ExtStandart"
import ExtCard from "./cards/ExtCard";
import EventCard from "./cards/EventCard";
import WineBottlePng from "./assets/wine-bottle.png"
import RestaurantIcon from "./assets/tray.png";
import ExcursionIcon from "./assets/excursion.png";
import SeasonIcon from "./assets/calendar.png";
import RunningIcon from "./assets/running.png";
import OpenAirIcon from "./assets/open-air.png";
import { Link } from "react-router-dom";
import ProductionCard from "./cards/ProductionCard.tsx";
import './styles/ExitButton.css'


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
    const [isOpen, setIsOpen] = useState(false)
    const categories = [{header : "Дегустации", image : WineBottlePng}, {header : "Ресторан", image : RestaurantIcon}, {header : "Экскурсии", image : ExcursionIcon}, {header : "Сезонные", image : SeasonIcon}, {header : "Спорт", image : RunningIcon}, {header : "Open-air", image : OpenAirIcon}];

    const description = () => {
        return(
            <>
                <p>Вина Валерия Логинова Крым 2022-2023 годы и КРАСНОДАРСКИЙ КРАЙ 2024 год. 5 образцов</p><br/>
                <p>Даты проведения: 29.09.-05.10.2025</p><br/>
                <p>Длительность: 1.5 часа</p><br/>
                <p>В стоимость входят закуски и продукты Центра локальных продуктов БОЛЬШИЕ ХУТОРА.</p><br/>
                <p>Группа:  до 12 гостей</p><br/>
                <p>Стоимость дегустации:</p><br/>
                <div>
                    <div className='flex justify-between'>
                        <div>11:00 - 12:30</div>
                        <div>бесплатно</div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div>

            <div className="bg-[#f0f0f0]">

                <div className="font-body w-3/4 mx-auto">
                    <div className="w-full flex justify-center items-center h-[425px] pt-[7rem] lg:h-[625px] mb-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d2/Robert_Young_Vineyards.jpg" className="flex mx-auto max-w-[300px] rounded-[14rem] sm:max-w-[400px] lg:max-w-[700px]"/>

                    </div>

                    <div className="w-3/4">
                        <p className="font-extrabold max-sm:text-4xl sm:text-6xl">Дегустация вина</p>
                        <h1 className="mt-4 font-bold max-sm:text-xl sm:text-2xl">Познайте настоящее искусство создания вина вместе с нашими сомелье и виноделами</h1>
                    </div>

                    <hr className="border-gray-400 my-8" />

                    <ul className="pb-8">
                        <button
                            className="bg-[#101316] rounded-2xl"
                            onClick={() => {setIsOpen(true)}}
                        ><p className="text-xl text-white mx-4 my-3">Подробнее</p></button>
                    </ul>

                </div>
            </div>

            {/* Затемнённый фон */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Модальное окно */}
            <div
                className={`
                fixed top-0 right-0 h-full bg-white shadow-xl z-50
                transform transition-transform duration-300 ease-in-out overflow-y-auto w-full sm:w-2/3 
                max-w-[1200px] text-[#3E4756] p-10
                ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 z-20 p-2  cl-btn-6">
                    <div className="cl-btn-6-in">
                        <label className="cl-btn-6-txt text-gray-600">Close</label>
                    </div>
                </button>

                <div className="flex flex-col gap-10 font-body">
                    <div>
                        <h2 className="text-[35px] font-bold">Специальные дегустации в рамках этногастрономического фестиваля “Черноморская винная неделя” 29.09-05.10.2025 года</h2>
                        <div className='h-[3px] w-full bg-[#3E4756]'></div>
                    </div>

                    <ProductionCard
                        imageStyle='w-[100px]'
                        spesialTitle='text-[35px] font-bold'
                        spesialDesc={'text-xs md:text-1 lg:text-xl xl:text-2xl'}
                        title={"Экскурсия по винодельне и дегустационный сет  “КРЫМ И МАТЕРИК в одних руках”"}
                        description={description()}>
                    </ProductionCard>
                    <ProductionCard
                        spesialTitle='text-[35px] font-bold'
                        spesialDesc={'text-xs md:text-1 lg:text-xl xl:text-2xl'}
                        title={"Экскурсия по винодельне и дегустационный сет  “КРЫМ И МАТЕРИК в одних руках”"}
                        description={description()}>
                    </ProductionCard>
                    <ProductionCard
                        spesialTitle='text-[35px] font-bold'
                        spesialDesc={'text-xs md:text-1 lg:text-xl xl:text-2xl'}
                        title={"Экскурсия по винодельне и дегустационный сет  “КРЫМ И МАТЕРИК в одних руках”"}
                        description={description()}>
                    </ProductionCard>
                </div>
            </div>

            <div>

                <div className=" font-body mx-auto my-16 max-sm:w-5/6 sm:w-3/4">

                    <div className="w-3/4">
                        <h1 className="mt-4 font-bold max-sm:text-2xl sm:text-3xl">Предстоящие</h1>
                        <p className="font-extrabold max-sm:text-4xl sm:text-6xl">Мероприятия</p>
                    </div>

                    <ul className="mx-auto my-8 flex flex-wrap flex-row justify-evenly">
                        {categories.map(({header, image}) => (
                            <Link key={header} to={`/Мероприятия/${header}`} className="flex flex-col w-[150px]">
                                <img src={image} className="w-[100px] h-[100px] mx-auto bg-[#f0f0f0] p-2 rounded-xl" />
                                <p className="mx-auto my-2 font-bold text-lg">{header}</p>
                            </Link>
                        ))}
                    </ul>

                    <div className="relative max-sm:h-[90px] sm:h-[120px]">
                        <div className="absolute top-0 right-0">
                            <h1 className="mt-4 font-bold max-sm:text-2xl sm:text-3xl">Откройте для себя</h1>
                            <p className="font-extrabold max-sm:text-4xl sm:text-6xl">Винодельню</p>
                        </div>
                    </div>
                    <ul className="grid gap-4 grid-cols-2 mx-auto ">
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