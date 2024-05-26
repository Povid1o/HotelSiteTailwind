import React, { useState } from 'react'

import Navbar from "./components/Navbar.js"
import ExtDishcard from './components/ExtDishcard.js';
import FoodCard from './components/FoodCard.js';
import ExtCard from './components/ExtCard';
import Footer from "./components/Footer.js";


function Restaurant () {
    const [nav, setNav] = useState(false);
    return (
        <div>
            <Navbar nav = {nav} setNav = {setNav}/>
        
            <div className="container mx-auto font-body sm:px-4 ">
                                
                <h1 className="flex mx-auto justify-center items-center text-3xl font-bold pt-[7rem] mb-8">Меню</h1>

                <h2 className=" font-bold pt-2 mb-3 text-lg sm:pt-6 sm:mb-4 sm:text-xl text-center">Antipasti</h2>
                <div className="grid gap-0 grid-cols-2 mx-auto max-w-[1000px]">
                    <FoodCard
                        imgSrc="https://i.imgur.com/GuUbM8Q.png"
                        imgAlt="Bruschetta"
                        header="Bruschetta"
                        description="Very delicious slice of bread with vegetables"
                        />

                    <FoodCard
                        imgSrc="https://i.imgur.com/44wBlh1.png"
                        imgAlt="Caprese Salad"
                        header="Caprese Salad"
                        description="What Salad could be more Italian, than Caprese?"
                    />
                </div>

                <hr className="border-gray-400 my-8" />
                
                <h2 className="font-bold pt-2 mb-3 text-lg sm:pt-6 sm:mb-4 sm:text-xl text-center">Primi Platti</h2>
                <div className="grid gap-0 grid-cols-2 mx-auto max-w-[1000px]">
       
                    <FoodCard
                        imgSrc="https://i.imgur.com/jJBWmPu.png"
                        imgAlt="Spaghetti Carbonara"
                        header="Spaghetti Carbonara"
                        description="Well, that's now the most italian thing here"
                        />

                    <FoodCard
                        imgSrc="https://i.imgur.com/NflqYmH.png"
                        imgAlt="Risotto ai Funghi"
                        header="Risotto ai Funghi"
                        description="You probably gonna like it"
                        />
                </div>

                <hr className="border-gray-400 my-8" />
                
                <h2 className="font-bold pt-2 mb-3 text-lg sm:pt-6 sm:mb-4 sm:text-xl text-center">Soups</h2>
                <div className="grid gap-0 grid-cols-2 mx-auto max-w-[1000px]">
        
                    <FoodCard
                        imgSrc="https://i.imgur.com/4VIMe45.png"
                        imgAlt="Borsch"
                        header="Borsch"
                        description="For the most patriotic ppl"
                        />

                    <FoodCard
                        imgSrc="https://i.imgur.com/PraiyRI.png"
                        imgAlt=""
                        header="Dunno what's it"
                        description="I mean...I really dunno"
                        />
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default Restaurant;