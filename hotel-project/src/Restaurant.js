import React from 'react'
import Navbar from "./components/Navbar.js"
import ExtMenucard from './components/ExtMenucard.js';
import Card from './components/Card';
import ExtCard from './components/ExtCard';
import Footer from "./components/Footer.js";

const menucard = () => {
    return(
        <Card >
            карточка....      
        </Card>

    )
}

function Restaurant() {
    return (
        <>
        <div>
        <Navbar/>
        </div>
     
<div class="container mx-auto font-body sm:px-4 sm:py-8">
                    
  <h1 className="text-center text-3xl font-bold mb-8">Menu</h1>
  <ExtCard
                        Card={menucard}
                        ExtContent={ExtMenucard}
                    /> 

    <h2 className=" font-bold pt-2 mb-3 text-lg sm:pt-6 sm:mb-4 sm:text-xl text-center">Antipasti</h2>
    <div className="flex flex-nowrap -mx-4 md:mx-auto max-w-[750px]">
        <div className="w-full px-4 mb-8">
            <img src="https://i.imgur.com/GuUbM8Q.png" alt="Bruschetta" className="w-full h-auto rounded-lg mb-3 sm:mb-4"/>
            <h3 className="font-bold text-base sm:text-lg sm:mb-2"> Bruschetta</h3>
            <p className="text-gray-600">$10.99</p>
        </div>
        <div className="w-full px-4 mb-8">
            <img src="https://i.imgur.com/44wBlh1.png" alt="Caprese Salad" className="w-full h-auto rounded-lg mb-3 sm:mb-4"/>
            <h3 className="font-bold text-base sm:text-lg sm:mb-2">Caprese Salad</h3>
            <p className="text-gray-600">$12.99</p>
        </div>
    </div>
    
    <h2 className="font-bold pt-2 mb-3 text-lg sm:pt-6 sm:mb-4 sm:text-xl text-center">Primi Platti</h2>
    <div className="flex flex-nowrap -mx-4 md:mx-auto max-w-[750px]">
        <div className="w-full px-4 mb-8">
            <img src="https://i.imgur.com/jJBWmPu.png" alt="Spaghetti Carbonara" className="w-full h-auto rounded-lg mb-3 sm:mb-4"/>
            <h3 className="font-bold text-base sm:text-lg sm:mb-2">Spaghetti Carbonara</h3>
            <p className="text-gray-600">$14.99</p>
        </div>
        <div className="w-full  px-4 mb-8">
            <img src="https://i.imgur.com/NflqYmH.png" alt="Risotto ai Funghi" className="w-full h-auto rounded-lg mb-3 sm:mb-4"/>
            <h3 className="font-bold text-base sm:text-lg sm:mb-2">Risotto ai Funghi</h3>
            <p className="text-gray-600">$16.99</p>
        </div>
    </div>
    
    <h2 className="font-bold pt-2 mb-3 text-lg sm:pt-6 sm:mb-4 sm:text-xl text-center">Soups</h2>
    <div className="flex flex-nowrap -mx-4 md:mx-auto max-w-[750px]">
        <div className="w-full px-4 mb-8">
            <img src="https://i.imgur.com/4VIMe45.png" alt="Borsch" className="w-full h-auto rounded-lg mb-3 sm:mb-4"/>
            <h3 className="font-bold text-base sm:text-lg sm:mb-2">Borsch</h3>
            <p className="text-gray-600">$14.99</p>
        </div>
        <div className="w-full px-4 mb-8">
            <img src="https://i.imgur.com/PraiyRI.png" alt="Dunno what's it" className="w-full h-auto rounded-lg mb-3 sm:mb-4"/>
            <h3 className="font-bold text-base sm:text-lg sm:mb-2">Dunno what's it</h3>
            <p className="text-gray-600">$16.99</p>
        </div>
    </div>
</div>
<div>
    <Footer />
</div>
        </>
      );
}

export default Restaurant;