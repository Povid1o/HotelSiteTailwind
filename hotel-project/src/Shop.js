import Navbar from "./components/Navbar.js"
import Footer from "./components/Footer.js";
import { useState } from "react";

import ThreeBottles from "./components/assets/ThreeBottles.png"
import BottlesShop from "./components/assets/BottlesShop.jpg"

import WineCard from "./components/cards/WineCard.js";

function Shop() {
  const [nav, setNav] = useState(false);

  const [wines, setWines] = useState([
    {
      id: 1,
      name: 'Вино игристое красное Русское игристое полусладкое',
      image: 'https://krymwine.ru/upload/resize_cache/iblock/08a/700_700_140cd750bba9870f18aada2478b24840a/u2usww0s9fsyzy4bbgoaha4bm860mp8a.webp',
      type: 'Красное',
      year: 1985,
      sweetness: 'Полусладкое'
    },
    {
      id: 2,
      name: 'Вино игристое красное Русское игристое полусладкое',
      image: 'https://krymwine.ru/upload/resize_cache/iblock/522/700_700_140cd750bba9870f18aada2478b24840a/aizouqgfnwmbpzgpga3mx9f8kre9fnhg.webp',
      type: 'Красное',
      year: 1980,
      sweetness: 'Полусладкое'
    },
    {
      id: 3,
      name: 'Вино игристое красное Русское игристое полусладкое',
      image: 'https://krymwine.ru/upload/resize_cache/iblock/ade/700_700_140cd750bba9870f18aada2478b24840a/tntl3fmkj2j8quxu0on6ucgc0biqbx0m.webp',
      type: 'Красное',
      year: 1975,
      sweetness: 'Полусладкое'
    },
    {
      id: 4,
      name: 'Вино игристое красное Русское игристое полусладкое',
      image: 'https://krymwine.ru/upload/resize_cache/iblock/b29/700_700_140cd750bba9870f18aada2478b24840a/n0ucqwbcvftwozqoqwyz2w3q0sehg2zo.webp',
      type: 'Красное',
      year: 1990,
      sweetness: 'Полусладкое'
    },
  ]) ;
  return (
    <>
        <Navbar nav = {nav} setNav = {setNav}/>
        <main className="font-body w-full">

        <section
            className="h-[500px] bg-cover bg-center bg-no-repeat rounded-b-3xl"
            style={{ backgroundImage: `url('${BottlesShop}')` }}
        >
        </section>

            {/* <img src={BottlesShop} alt="" /> */}
    

            <section className="p-4">
              <div className="flex flex-row flex-wrap items-center justify-center">
                {wines.map((wine) => (
                  <WineCard 
                    key={wine.id} 
                    id={wine.id} 
                    header={wine.name} 
                    imgSrc={wine.image} 
                    isMobile={true}
                    onClick={() => console.log(wine.name)}
                  />
                ))}
              </div>
            </section>
        </main>
        
        {/* <WineCard nam/> */}
        <Footer />
    </>
  );
}

export default Shop;
