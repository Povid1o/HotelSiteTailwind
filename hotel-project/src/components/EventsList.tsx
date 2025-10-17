import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dropdown, DropdownItem } from "flowbite-react";

import Navbar from './Navbar';
import Footer from './Footer';
import EventCard from './cards/EventCard';
import { eventsEmergency } from '../emergencyContent/text';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { API_BASE } from './http';


const EventsList = observer(() => {
    const params = useParams();
    const navigate = useNavigate();
    const [nav, setNav] = useState(false);

    // Access Context stores
    const context = useContext(Context);
    if (!context) {
        throw new Error('EventsList must be used within Context Provider');
    }
    const { events } = context;

    // Load events data
    useEffect(() => {
        console.log('=== EVENTS LIST PAGE DATA ===');
        console.log('All categories:', events.categories);
        console.log('All events:', events.events);
        console.log('Loading state:', { events: events.isLoading });
    }, [events.categories, events.events]);

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

    // Show loading if data is still being fetched
    if (events.isLoading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="text-2xl text-gray-600">Загрузка...</div>
            </div>
        );
    }

    const categorieName = decodeURIComponent(params.categorie || '');
    
    // Find current category from events.categories
    const currentCategory = events.categories.find(cat => cat.header === categorieName);
    const categoryDescription = currentCategory?.description || '';
    
    // Get events for this category
    const currentEvents = currentCategory?.events || [];

    return(

        <div className='font-body'>

            <Navbar nav = {nav} setNav = {setNav}/>


            <div className="w-5/6 mx-auto mb-5 pt-[7rem]">
                <p className="font-extrabold max-sm:text-4xl sm:text-6xl">{categorieName}</p>
                <h1 className="mt-4 font-bold max-sm:text-xl sm:text-2xl">{categoryDescription}</h1>
            </div>

            <div className='w-5/6 mx-auto flex justify-between'>

                <Dropdown label="Категории" size="xl" className=''>
                    {events.categories.map(({id, header}) => (
                        <DropdownItem 
                            key={id}
                            onClick={() => navigate(`/Events/${encodeURIComponent(header)}`)}
                        >
                            {header}
                        </DropdownItem>
                    ))}
                </Dropdown>

            </div>



            <div className=" font-body mx-auto my-16 w-5/6">

                <ul className="grid gap-4 mobile:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {currentEvents.length > 0 ? (
                        currentEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                imgSrc={event.images?.[0]?.url ? getImageUrl(event.images[0].url) : ''}
                                title={event.title}
                                description={event.description}
                                children={undefined}
                            />
                        ))
                    ) : (
                        <p className="col-span-3 text-center text-gray-500 py-10">
                            В этой категории пока нет мероприятий
                        </p>
                    )}
                </ul>

            </div>

                



            <Footer/>


        </div>
        
    )
    
});

export default EventsList;