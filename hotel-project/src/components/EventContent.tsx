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
import {description1, description2, description3, description4, description5, description6} from './modals/CreateDesc.tsx'
// import {TsConfigJson} from "type-fest";
// import JSX = TsConfigJson.CompilerOptions.JSX;
//
// export interface ProductionCardData {
//     description: string | (() => JSX.Element);
//     id: number;
//     imageStyle?: string;
//     spesialDesc?: string;
//     spesialTitle?: string;
//     title: string;
// }
//
// export interface ProductionCategory {
//     category: string;
//     components: ProductionCardData[];
// }
//
// const productionCardsData: ProductionCategory[] = [
//     {
//         category:
//             "СПЕЦИАЛЬНЫЕ ДЕГУСТАЦИИ В РАМКАХ ЭНОГАСТРОНОМИЧЕСКОГО ФЕСТИВАЛЯ «ЧЕРНОМОРСКАЯ ВИННАЯ НЕДЕЛЯ» 29.09-05.10.2025 года",
//         components: [
//             {
//                 id: 1,
//                 imageStyle: "w-[100px]",
//                 spesialDesc: "text-xs md:text-1 lg:text-xl xl:text-2xl",
//                 title:
//                     "Экскурсия по винодельне и дегустационный сет «КРЫМ И МАТЕРИК в одних руках»",
//                 description: () => (
//
//                         <>
//                             <p>Вина Валерия Логинова КРЫМ 2022-2023 годы и КРАСНОДАРСКИЙ КРАЙ 2024 год. 5 образцов.</p><br />
//                             <p>Длительность 1,5 часа</p><br />
//                             <p>В стоимость входят закуски и продукты Центра локальных продуктов БОЛЬШИЕ ХУТОРА</p><br/>
//                             <p>Группа до 12 гостей</p><br/>
//                             <p>Стоимость дегустации:</p><br/>
//                             <div className='flex justify-between'><div>11.00-12.30</div> <div>бесплатно</div></div>
//                             <div className='flex justify-between'><div>14.00-15.30</div> <div>500 руб/чел</div></div>
//                             <div className='flex justify-between'><div>16.00-17.30</div> <div>500 руб/чел</div></div>
//
//                         </>
//                     )
//
//             },
//
//         ]
//     },
//     {
//         category: "ДЕГУСТАЦИИ ВНЕ РАМОК ЭНОГАСТРОНОМИЧЕСКОГО ФЕСТИВАЛЯ",
//         components: [
//             {
//                 id: 1,
//                 imageStyle: "w-[100px]",
//                 spesialDesc: "text-xs md:text-1 lg:text-xl xl:text-2xl",
//                 title:
//                     "Сет «КРЫМ И МАТЕРИК в одних руках».",
//                 description: () => (
//
//                     <>
//                         <p>Вина Валерия Логинова КРЫМ 2022-2023 годы и МАТЕРИК 2024 год. 5 образцов.</p><br />
//                         <p>Длительность 1,5 часа</p><br />
//                         <p>В стоимость входят закуски и продукты Центра локальных продуктов БОЛЬШИЕ ХУТОРА</p><br/>
//                         <p>Группа до 12 гостей</p><br/>
//                         <p>Стоимость дегустации на одного гостя 2.000 руб</p><br/>
//
//                     </>
//                 )
//
//             },
//             {
//                 id: 2,
//                 imageStyle: "w-[100px]",
//                 spesialDesc: "text-xs md:text-1 lg:text-xl xl:text-2xl",
//                 title:
//                     "Сет «ВСЕ ОТТЕНКИ КАБЕРНЕ»",
//                 description: () => (
//
//                     <>
//                         <p>Вина сорта КАБЕРНЕ-СОВИНЬОН 2024 года, произведенные из винограда с одного поля с периодичным сбором в течении 4-х недель. 5 образцов.</p><br />
//                         <p>Длительность 1,5 часа</p><br />
//                         <p>В стоимость входят закуски и продукты Центра локальных продуктов БОЛЬШИЕ ХУТОРА</p><br/>
//                         <p>Группа до 12 гостей</p><br/>
//                         <p>Стоимость дегустации на одного гостя 3.000 руб</p><br/>
//
//
//                     </>
//                 )
//
//
//             },
//             {
//                 id: 3,
//                 imageStyle: "w-[100px]",
//                 spesialDesc: "text-xs md:text-1 lg:text-xl xl:text-2xl",
//                 title:
//                     "Сет «ОТ ПРОСТОГО К СЛОЖНОМУ»",
//                 description: () => (
//
//                     <>
//                         <p>Вина красные разных годов, произведенные на винодельнях в Крыму и на МАТЕРИКЕ. 5 образцов. Все вина вы можете забрать с собой.</p><br />
//                         <p>Длительность 1,5 часа</p><br />
//                         <p>В стоимость входят закуски и продукты Центра локальных продуктов БОЛЬШИЕ ХУТОРА</p><br/>
//                         <p>Группа до 6 гостей, но не менее 4 гостей.</p><br/>
//                         <p>Стоимость дегустации на одного гостя 4.500 руб</p><br/>
//
//
//                     </>
//                 )
//             },
//             {
//                 id: 4,
//                 imageStyle: "w-[100px]",
//                 spesialDesc: "text-xs md:text-1 lg:text-xl xl:text-2xl",
//                 title:
//                     "ИНДИВИДУАЛЬНАЯ ДЕГУСТАЦИЯ",
//                 description: () => (
//
//                     <>
//                         <p>	Вина Валерия Логинова в сопровождении продуктов, произведенных в Центре локальных продуктов БОЛЬШИЕ ХУТОРА. 5 образцов. Все вина и продукты вы можете забрать с собой.</p><br />
//                         <p>Длительность 1,5 часа</p><br />
//                         <p>В сет входят паштеты, конфитюры, варенье на СТЕВИИ, томаты вяленые</p><br/>
//                         <p>Группа до 6 гостей, но не менее 4 гостей.</p><br/>
//                         <p>Стоимость дегустации для группы 24.000 руб</p><br/>
//                         <p>Стоимость дегустации с трансфером из/до Новороссийска 25.000 руб</p><br/>
//
//                     </>
//                 )
//
//             },
//             {
//                 id: 5,
//                 imageStyle: "w-[100px]",
//                 spesialDesc: "text-xs md:text-1 lg:text-xl xl:text-2xl",
//                 title:
//                     "УЖИН С ВИНОДЕЛОМ",
//                 description: () => (
//
//                     <>
//                         <p>Винодел Валерий Логинов готовит для гостей ужин в сопровождении своих вин и продуктов Центра локальных продуктов БОЛЬШИЕ ХУТОРА. Комментарии и интересные рассказы из жизни винодела о вине и людях.</p><br />
//                         <p>Предварительная запись за 2 недели.</p><br />
//                         <p>Длительность неограничена</p><br/>
//                         <p>В меню ужина включены одно холодное и одно горячее блюдо, вина и продукты Центра локальных продуктов БОЛЬШИЕ ХУТОРА</p><br/>
//                         <p>Группа от 2 до 4 человек</p><br/>
//                         <p>Стоимость ужина от 12.000 руб на гостя и рассчитывается индивидуально исходя из выбранных блюд, вин и количества гостей.</p><br/>
//                         <p>Возможен трансфер из/до Новороссийска</p><br/>
//                         <p>Возможно размещение на ночь в нашем мини-отеле ВИННЫЕ ТЕРРАСЫ</p><br/>
//
//
//                     </>
//                 )
//             },
//
//         ]
//     }
// ];

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
                max-w-[1200px] text-[#3E4756] p-3 md:p-10 lg:p-10
                ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 z-20 p-2  cl-btn-6">
                    <div className="cl-btn-6-in">
                        <label className="cl-btn-6-txt mr-3 text-gray-600">Close</label>
                    </div>
                </button>


                <div className="flex flex-col gap-10 font-body">

                    <div>
                        <h2 className="text-[20px] md:text-[30px] lg:text-[35px] font-bold">Специальные дегустации в рамках этногастрономического фестиваля “Черноморская винная неделя” 29.09-05.10.2025 года</h2>
                        <div className='h-[3px] w-full bg-[#3E4756]'></div>
                    </div>
                    {/*{renderProductionCards()}*/}
                    <ProductionCard
                        imageStyle='w-[100px]'
                        spesialTitle=''
                        spesialDesc={'text-xs md:text-1 lg:text-xl xl:text-2xl'}
                        title={"Экскурсия по винодельне и дегустационный сет  “КРЫМ И МАТЕРИК в одних руках”"}
                        description={description1()}>
                    </ProductionCard>
                    <div>
                        <h2 className="text-[20px] md:text-[30px] lg:text-[35px] font-bold">ДЕГУСТАЦИИ ВНЕ РАМОК ЭНОГАСТРОНОМИЧЕСКОГО ФЕСТИВАЛЯ.
                        </h2>
                        <div className='h-[3px] w-full bg-[#3E4756]'></div>
                    </div>
                    <ProductionCard
                        imageStyle='w-[100px]'
                        spesialDesc={'text-xs md:text-1 lg:text-xl xl:text-2xl'}
                        title={"Сет «КРЫМ И МАТЕРИК в одних руках»"}
                        description={description2()}>
                    </ProductionCard>
                    <ProductionCard
                        imageStyle='w-[100px]'
                        spesialDesc={'text-xs md:text-1 lg:text-xl xl:text-2xl'}
                        title={"Сет «ВСЕ ОТТЕНКИ КАБЕРНЕ»"}
                        description={description3()}>
                    </ProductionCard>
                    <ProductionCard
                        imageStyle='w-[100px]'
                        spesialDesc={'text-xs md:text-1 lg:text-xl xl:text-2xl'}
                        title={"Сет «ОТ ПРОСТОГО К СЛОЖНОМУ»"}
                        description={description4()}>
                    </ProductionCard>
                    <ProductionCard
                        imageStyle='w-[100px]'
                        spesialDesc={'text-xs md:text-1 lg:text-xl xl:text-2xl'}
                        title={"ИНДИВИДУАЛЬНАЯ ДЕГЕГУСТАЦИЯ"}
                        description={description5()}>
                    </ProductionCard>
                    <ProductionCard
                        imageStyle='w-[100px]'
                        spesialDesc={'text-xs md:text-1 lg:text-xl xl:text-2xl'}
                        title={"УЖИН С ВИНОДЕЛОМ"}
                        description={description6()}>
                    </ProductionCard>

                </div>

            <div>


            </div>
            </div>

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
        
    );
}
 
export default EventContent;