import { useState, useContext, useEffect } from "react";
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
import DiscountIcon from "./assets/discount-icon.png";
import { Link } from "react-router-dom";
// @ts-ignore
import ProductionCard from './cards/ProductionCard.tsx';
import './styles/ExitButton.css'
// @ts-ignore
import {description1, description2, description3, description4, description5, description6} from './modals/CreateDesc.tsx'
import { eventCardsEmergency, eventCategoriesEmergency, eventsEmergency } from '../emergencyContent/text';
import { MdBuild } from 'react-icons/md';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { API_BASE } from './http';

const ExpandedMaintenance = () => (
  <div className="flex flex-col gap-4 p-4">
    <div className='flex items-center gap-3 text-amber-600'>
      <MdBuild className='w-6 h-6' />
      <h2 className="font-bold text-base sm:text-2xl">Технические работы</h2>
    </div>
    <p className="text-gray-700 text-justify text-xs sm:text-base">
      В настоящий момент ведётся разработка бронирования мероприятий онлайн, по вопросам записи на мероприятие обращайтесь к администратору.
    </p>
  </div>
);

const EventContent = observer(() => {
    const [isOpen, setIsOpen] = useState(false)
    
    // Access Context stores
    const context = useContext(Context);
    if (!context) {
        throw new Error('EventContent must be used within Context Provider');
    }
    const { events } = context;

    // ✅ ДОБАВЬТЕ: Фиксируем данные при первой загрузке
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);
    const [fixedCategories, setFixedCategories] = useState<any[]>([]);
    const [fixedEvents, setFixedEvents] = useState<any[]>([]);

    // Load events data
    useEffect(() => {
        console.log('=== EVENTS PAGE DATA ===');
        console.log('All categories:', events.categories);
        console.log('All events:', events.events);
        console.log('Loading state:', { events: events.isLoading });
    }, [events.categories, events.events]);

    // ✅ Фиксируем данные при первой загрузке
    useEffect(() => {
        if (!initialDataLoaded && !events.isLoading) {
            if (events.categories.length > 0) {
                setFixedCategories(events.categories);
            } else {
                setFixedCategories(eventCategoriesEmergency);
            }
            
            if (events.events.length > 0) {
                setFixedEvents(events.events);
            } else {
                setFixedEvents(eventsEmergency);
            }
            
            setInitialDataLoaded(true);
        }
    }, [events.isLoading, events.categories, events.events, initialDataLoaded]);

    // Icon mapping for categories
    const iconMap: Record<string, string> = {
        'Дегустации': WineBottlePng,
        'Ресторан': RestaurantIcon,
        'Экскурсии': ExcursionIcon,
        'Сезонные': SeasonIcon,
        'Спорт': RunningIcon,
        'Open-air': OpenAirIcon,
        'Акции': DiscountIcon,
    };

    // Helper to get image URL
    const getImageUrl = (image: string | File) => {
        if (typeof image === 'string') {
            // Already absolute URL
            if (image.startsWith('http://') || image.startsWith('https://')) {
                return image;
            }
            // Local file in public folder (starts without /)
            if (!image.startsWith('/')) {
                return image;
            }
            // Relative path from backend (starts with /)
            return `${API_BASE}${image}`;
        }
        return '';
    };

    // Show loading only on first load
    if (events.isLoading && !initialDataLoaded) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="text-2xl text-gray-600">Загрузка...</div>
            </div>
        );
    }

    // ✅ ИСПОЛЬЗУЙТЕ ФИКСИРОВАННЫЕ ДАННЫЕ
    const categoriesWithIcons = fixedCategories.map(cat => ({
        id: cat.id,
        header: cat.header,
        description: cat.description,
        image: iconMap[cat.header] || WineBottlePng,
        events: cat.events || []
    }));

    const allEvents = fixedEvents;

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
                <div className="relative mb-2">
                    <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 z-20 cl-btn-6">
                        <div className="cl-btn-6-in">
                            <label className="cl-btn-6-txt text-gray-600">Close</label>
                        </div>
                    </button>
                </div>



                <div className="flex flex-col gap-10 font-body">

                    <div>
                        <h2 className="text-[20px] md:text-[30px] lg:text-[35px] font-bold">Специальные дегустации в рамках этногастрономического фестиваля “Черноморская винная неделя” 29.09-05.10.2025 года</h2>
                        <div className='h-[3px] w-full bg-[#3E4756]'></div>
                    </div>
                    <ProductionCard
                        imageStyle={`w-[100px]') ]`}
                        spesialTitle={''}
                        spesialDesc={'text-xs md:text-1 lg:text-xl xl:text-2xl'}
                        title={"Экскурсия по винодельне и дегустационный сет  “КРЫМ И МАТЕРИК в одних руках”"}
                        description={description1()}
                        bgImg={''}
                        flexReverse={false}
                        specialStyle={''}
                        extraBlock={false}
                        extraImage={''}
                    ></ProductionCard>
                    <div>
                        <h2 className="text-[20px] md:text-[30px] lg:text-[35px] font-bold">ДЕГУСТАЦИИ ВНЕ РАМОК ЭНОГАСТРОНОМИЧЕСКОГО ФЕСТИВАЛЯ.
                        </h2>
                        <div className='h-[3px] w-full bg-[#3E4756]'></div>
                    </div>
                    <ProductionCard
                        imageStyle='w-[100px]'
                        spesialDesc={'text-xs md:text-1 lg:text-xl xl:text-2xl'}
                        title={"Сет «КРЫМ И МАТЕРИК в одних руках»"}
                        description={description2()}
                        spesialTitle={''}
                        bgImg={''}
                        flexReverse={false}
                        specialStyle={''}
                        extraBlock={false}
                        extraImage={''}
                    ></ProductionCard>
                    <ProductionCard
                        imageStyle='w-[100px]'
                        spesialDesc={'text-xs md:text-1 lg:text-xl xl:text-2xl'}
                        title={"Сет «ВСЕ ОТТЕНКИ КАБЕРНЕ»"}
                        description={description3()}
                        spesialTitle={''}
                        bgImg={''}
                        flexReverse={false}
                        specialStyle={''}
                        extraBlock={false}
                        extraImage={''}
                    ></ProductionCard>
                    <ProductionCard
                        imageStyle='w-[100px]'
                        spesialDesc={'text-xs md:text-1 lg:text-xl xl:text-2xl'}
                        title={"Сет «ОТ ПРОСТОГО К СЛОЖНОМУ»"}
                        description={description4()}
                        spesialTitle={''}
                        bgImg={''}
                        flexReverse={false}
                        specialStyle={''}
                        extraBlock={false}
                        extraImage={''}
                    ></ProductionCard>
                    <ProductionCard
                        imageStyle='w-[100px]'
                        spesialDesc={'text-xs md:text-1 lg:text-xl xl:text-2xl'}
                        title={"ИНДИВИДУАЛЬНАЯ ДЕГЕГУСТАЦИЯ"}
                        description={description5()}
                        spesialTitle={''}
                        bgImg={''}
                        flexReverse={false}
                        specialStyle={''}
                        extraBlock={false}
                        extraImage={''}
                    ></ProductionCard>
                    <ProductionCard
                        imageStyle='w-[100px]'
                        spesialDesc={'text-xs md:text-1 lg:text-xl xl:text-2xl'}
                        title={"УЖИН С ВИНОДЕЛОМ"}
                        description={description6()}
                        spesialTitle={''}
                        bgImg={''}
                        flexReverse={false}
                        specialStyle={''}
                        extraBlock={false}
                        extraImage={''}
                    ></ProductionCard>

                    {/* Предупреждение о бронировании для развёрнутого вида */}
                    <ExpandedMaintenance />

                </div>


            </div>

            <div className=" font-body mx-auto my-16 max-sm:w-5/6 sm:w-3/4">

                <div className="w-3/4">
                    <h1 className="mt-4 font-bold max-sm:text-2xl sm:text-3xl">Предстоящие</h1>
                    <p className="font-extrabold max-sm:text-4xl sm:text-6xl">Мероприятия</p>
                </div>

                <ul className="mx-auto my-8 flex flex-wrap flex-row justify-evenly">
                    {categoriesWithIcons.map(({id, header, image}) => (
                        <Link key={id} to={`/Events/${encodeURIComponent(header)}`} className="flex flex-col w-[150px]">
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
                    {allEvents.length > 0 ? (
                        allEvents.map((event) => (
                            <ExtCard
                                key={event.id}
                                Card={() => (
                                    <EventCard
                                        imgSrc={event.images?.[0]?.url ? getImageUrl(event.images[0].url) : ''}
                                        title={event.title}
                                        description={event.description}
                                        children={undefined}
                                    />
                                )}
                                ExtContent={ExpandedMaintenance}
                            />
                        ))
                    ) : (
                        <p className="col-span-2 text-center text-gray-500">Мероприятия скоро появятся</p>
                    )}
                </ul>

            </div>
        </div>
        
    );
});
 
export default EventContent;