import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dropdown, DropdownItem } from "flowbite-react";

import Navbar from './Navbar';
import Footer from './Footer';
import EventCard from './cards/EventCard';
import { eventsEmergency } from '../emergencyContent/text';


function EventsList() {
    const params = useParams();
    const navigate = useNavigate();
    // console.log(params)

    const categories = [
        {header : "Дегустации", description : "Познайте настоящее искусство создания вина вместе с нашими сомелье и виноделами"}, 
        {header : "Ресторан", description : "Наслаждайтесь изысканными блюдами в нашем ресторане, где вкус встречается с искусством."},
        {header : "Экскурсии", description : "Переживайте незабываемые эмоции, путешествуя по нашим виноградникам и узнавая больше о процессе создания нашего вина."},
        {header : "Сезонные", description : "Участвуйте в наших сезонных мероприятиях, где каждый сезон - это уникальный опыт вкуса и аромата."},
        {header : "Спорт", description : "Оставайтесь в форме и наслаждайтесь вином одновременно, принимая участие в наших спортивных мероприятиях."},
        {header : "Open-air", description : "Наслаждайтесь прекрасным вином под открытым небом, вдыхая чистый воздух и наслаждаясь удивительными видами."}
    ];
    // const events = [
    //     {categorie : "Дегустации", news: [{header : "Дегустация новых вин Каберне", description : "Опробуйте наш новый продукт, вдохновлённый Италией и созданный из легенларного сорта Каберне", imgSrc : ``}, {header : "Дегустация новых вин Каберне", description : "Опробуйте наш новый продукт, вдохновлённый Италией и созданный из легенларного сорта Каберне", imgSrc : ``}]},
    //     {categorie : "Ресторан", news: [{header : "", description : "", imgSrc : ``}, {header : "", description : "", imgSrc : ``}]},
    //     {categorie : "Экскурсии", news: [{header : "", description : "", imgSrc : ``}, {header : "", description : "", imgSrc : ``}]},
    //     {categorie : "Сезонные", news: [{header : "", description : "", imgSrc : ``}, {header : "", description : "", imgSrc : ``}]},
    //     {categorie : "Спорт", news: [{header : "", description : "", imgSrc : ``}, {header : "", description : "", imgSrc : ``}]}, 
    //     {categorie : "Open-air", news: [{header : "", description : "", imgSrc : ``}, {header : "", description : "", imgSrc : ``}]},]

    const events = eventsEmergency;


    
    const categorie = params.categorie;
    const categorieDescription = categories.filter(element => element.header === categorie)
    console.log(categorieDescription)
    
    const currentCards = events.filter(event => event.categorie === categorie)
    // console.log(currentCards)

    const [nav, setNav] = useState(false);

    return(

        <div className='font-body'>

            <Navbar nav = {nav} setNav = {setNav}/>


            <div className="w-5/6 mx-auto mb-5 pt-[7rem]">
                <p className="font-extrabold max-sm:text-4xl sm:text-6xl">{categorie}</p>
                <h1 className="mt-4 font-bold max-sm:text-xl sm:text-2xl">{categorieDescription[0].description}</h1>
            </div>

            <div className='w-5/6 mx-auto flex justify-between'>

                <Dropdown label="Категории" size="xl" className=''>
                    {categories.map(({header}) => (
                        <DropdownItem 
                            key={header}
                            onClick={() => navigate(`/Мероприятия/${header}`)}
                        >
                            {header}
                        </DropdownItem>
                    ))}
                </Dropdown>

            </div>



            <div className=" font-body mx-auto my-16 w-5/6">

                <ul className="grid gap-4 mobile:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {currentCards.map((event) => (
                        event.news.map((newsItem) => (

                            <EventCard
                            imgSrc={newsItem.imgSrc}
                            title={newsItem.header}
                            description={newsItem.description}
                            key={newsItem.header}
                            children={undefined}
                            />

                        ))
                    ))}

                </ul>

            </div>

                



            <Footer/>


        </div>
        
    )
    
}

export default EventsList;