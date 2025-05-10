// между sm и md сделать компьютерные фильтры, но колонку в один ряд 

import Navbar from "./components/Navbar"
import Footer from "./components/Footer";
import { useState } from "react";

import BottlesShop from "./components/assets/BottlesShop.jpg"

import WineCard from "./components/cards/WineCard";
import Filters from "./components/Filters";
import Search from "./components/Search";
import Sorting from "./components/Sorting";

import "./components/styles/shop.css"

interface Wine {
  id: number;
  name: string;
  image: string;
  type?: string;
  year?: number;
  sweetness?: string;
}

function Shop() {
  const [nav, setNav] = useState(false);
  const [yearRange, setYearRange] = useState<[number, number]>([1970, 1990]);
  const [activeCategory, setActiveCategory] = useState('Каталог');
  // const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('По умолчанию');
  

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setFilteredProducts(prev => {
      const sortedWines = [...prev];
      
      switch(option) {
        case 'По названию (А-Я)':
          sortedWines.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'По названию (Я-А)':
          sortedWines.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'По году (новые)':
          sortedWines.sort((a, b) => (b.year || 0) - (a.year || 0));
          break;
        case 'По году (старые)':
          sortedWines.sort((a, b) => (a.year || 0) - (b.year || 0));
          break;
        default:
          sortedWines.sort((a, b) => a.id - b.id);
      }

      return sortedWines;
    });
    // let sortedWines = [...wines];
    
    // switch(option) {
    //   case 'По названию (А-Я)':
    //     sortedWines.sort((a, b) => a.name.localeCompare(b.name));
    //     break;
    //   case 'По названию (Я-А)':
    //     sortedWines.sort((a, b) => b.name.localeCompare(a.name));
    //     break;
    //   case 'По году (новые)':
    //     sortedWines.sort((a, b) => (b.year || 0) - (a.year || 0));
    //     break;
    //   case 'По году (старые)':
    //     sortedWines.sort((a, b) => (a.year || 0) - (b.year || 0));
    //     break;
    //   default:
    //     sortedWines.sort((a, b) => a.id - b.id);
    // }
    
    // setWines(sortedWines);
  };

  const [wines, setWines] = useState([
    {
      id: 1,
      name: 'Вино игристое белое',
      image: 'https://krymwine.ru/upload/resize_cache/iblock/08a/700_700_140cd750bba9870f18aada2478b24840a/u2usww0s9fsyzy4bbgoaha4bm860mp8a.webp',
      type: 'Красное', // Исправлено на "Белое" ниже, если это игристое белое
      year: 1985,
      sweetness: 'Полусладкое'
    },
    {
      id: 2,
      name: 'Вино красное Красностоп Золотовский',
      image: 'https://krymwine.ru/upload/resize_cache/iblock/522/700_700_140cd750bba9870f18aada2478b24840a/aizouqgfnwmbpzgpga3mx9f8kre9fnhg.webp',
      type: 'Красное',
      year: 1980,
      sweetness: 'Полусладкое'
    },
    {
      id: 3,
      name: 'Вино белое',
      image: 'https://krymwine.ru/upload/resize_cache/iblock/ade/700_700_140cd750bba9870f18aada2478b24840a/tntl3fmkj2j8quxu0on6ucgc0biqbx0m.webp',
      type: 'Красное', // Возможно, ошибка, должно быть "Белое"
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
    {
      id: 5,
      name: 'Вино игристое красное Русское игристое полусладкое',
      image: 'https://krymwine.ru/upload/resize_cache/iblock/b29/700_700_140cd750bba9870f18aada2478b24840a/n0ucqwbcvftwozqoqwyz2w3q0sehg2zo.webp',
      type: 'Красное',
      year: 2018,
      sweetness: 'Полусладкое'
    },
    {
      id: 6,
      name: 'Вино Corvo Irmana Frappato',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1024656-300Wx300H-avif?context=bWFzdGVyfGltYWdlc3wyNzQwfGltYWdlL2F2aWZ8aW1hZ2VzL2g5MC9oNjQvMTAwNTIxOTg5MjQzMTguYXZpZnwyN2RjZDlkM2ZiYTQzMjAyNmFkOGU3ZDBhZDRiMzdlYWI2MzM5YmViMDcwNTFhMGI1NWQ3MTZlOWRhNmM5MTc1', 
      type: 'Красное',
      year: 2000, 
      sweetness: 'Полусухое'
    },
    {
      id: 7,
      name: 'Вино Corvo Irmana Grillo',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1004105.png-300Wx300H-avif?context=bWFzdGVyfGltYWdlc3wzNzAyfGltYWdlL2F2aWZ8aW1hZ2VzL2g4NC9oZjMvMTAxMTYzMzMwNzY1MTAuYXZpZnxmYTM3OTc0YzZiOTAyNDkyZDhlMDZmNWFjNTUzMzUxY2MxYTMxY2MzMGJhOTgyMjI5NzI3ZGNlZDY2YmJlYmM4', 
      type: 'Белое',
      year: 2017, 
      sweetness: 'Сухое'
    },
    {
      id: 8,
      name: 'Вино Pasqua Montepulciano d\'Abruzzo',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1024655-300Wx300H-avif?context=bWFzdGVyfGltYWdlc3wzMDc2fGltYWdlL2F2aWZ8aW1hZ2VzL2hjMC9oMWIvMTAwNTIxOTg1OTY2MzguYXZpZnwwNDE0MjA5ZDFjNzY4ODc2MzU4NmVlNzE2YmZjMTk3NTAwYjhjM2NhZjhjZmRmYTU0ZWY5YWU5MzhlNjc1Yjk5', 
      type: 'Красное',
      year: 2023, 
      sweetness: 'Полусухое'
    },
    {
      id: 9,
      name: 'Вино II Gaggio Cabernet-Sauvignon',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1000635.png-300Wx300H-avif?context=bWFzdGVyfGltYWdlc3wzMjY3fGltYWdlL2F2aWZ8aW1hZ2VzL2gwYi9oNWIvMTAxMTU4NDcwNjE1MzQuYXZpZnw1YTA2NDM4MWUxNWYxM2RkMWUzYWQyNGI5NzBjODBlOWZmZmJiYzVkOGExYTUxZTljZTUyMTg1ZWJiNzY5YWU1', 
      type: 'Красное',
      year: 2022, 
      sweetness: 'Сухое'
    },
    {
      id: 10,
      name: 'Вино Piccini Collezione Oro Chianti Riserva',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1017106.png-300Wx300H-avif?context=bWFzdGVyfGltYWdlc3wxNzQxMnxpbWFnZS9hdmlmfGltYWdlcy9oMzgvaDc3LzEwMTE2OTQxNDQ3MTk4LmF2aWZ8Y2VjNmNkOTgxNGQwY2Y2ODlhNmI4YzI1ODgzNzRiODI5MTAxOTkzOGIxODQ1MjBiOWQ4YjJmOTEzNWM0NDdhOQ', 
      type: 'Красное',
      year: 2015, 
      sweetness: 'Сухое'
    },
    {
      id: 11,
      name: 'Вино Masi Modello Bianco',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1018066-2-300Wx300H-avif?context=bWFzdGVyfGltYWdlc3wzMTg5fGltYWdlL2F2aWZ8aW1hZ2VzL2hjMi9oZTkvMTE2MjUwNjQxMzY3MzQuYXZpZnwzODZkMzg2Yzc5YzgzNDhmMjFkZDVjY2ZiYjBjMTk0MWQ2ZjA1Njc1NmFjYTIzZDJiMmYzNDUyZjNlODk1MGM1', 
      type: 'Белое',
      year: 2015, 
      sweetness: 'Полусухое'
    }
  ]);

  // const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(wines)
  const handleSearch = (query) => {
    const low = query.trim().toLowerCase();
    setFilteredProducts(
      low
        ? wines.filter(p =>
            p.name.toLowerCase().includes(low)
          )
        : wines                     // очистили поиск → показать всё
    );
  };

  const MobileView = () => (
    <div className="flex flex-col min-h-screen bg-white">
      <section
        className="h-[500px] bg-cover bg-center bg-no-repeat rounded-b-3xl"
        style={{ backgroundImage: `url('${BottlesShop}')` }}
      />
      
      <div className="p-4">
        <Filters 
          isMobile={true} 
          yearRange={yearRange} 
          setYearRange={setYearRange} 
          onSortChange={handleSortChange}
        />

        <Search 
          isMobile={false}
          onSearch={handleSearch}
          suggestionsList={wines.map(p => p.name)}
        />
        
        <div className="flex flex-col items-center mt-4">
          {filteredProducts.map((wine) => (
            <WineCard 
              key={wine.id}
              header={wine.name}
              imgSrc={wine.image}
              onClick={() => console.log(wine.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const DesktopView = () => (
    <div className="flex flex-col min-h-screen bg-white">
      <section
        className="h-[500px] bg-cover bg-center bg-no-repeat rounded-b-3xl"
        style={{ backgroundImage: `url('${BottlesShop}')` }}
      />
      
      <div className="mx-auto flex flex-col md:flex-row mt-8">
        <aside className="w-full md:w-1/4 p-4 border-r">
          <Filters 
            isMobile={false} 
            yearRange={yearRange} 
            setYearRange={setYearRange} 
          />
        </aside>

        <main className="flex-1 p-4">
          <aside className="flex justify-between items-center mb-6 gap-4">
            <Search 
              isMobile={false}
              onSearch={handleSearch}
              suggestionsList={wines.map(p => p.name)}
            />
            <Sorting 
              isMobile={false}
              onSortChange={handleSortChange}
            />
          </aside>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3 2xl:gap-12">
            {filteredProducts.map((wine) => (
              <div className="mx-auto">
              <WineCard 
                key={wine.id}
                header={wine.name}
                imgSrc={wine.image}
                onClick={() => console.log(wine.name)}
              />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );

  return (
    <>
      <Navbar nav={nav} setNav={setNav}/>
      <main className="font-body w-full">
        <div className="md:hidden">
          <MobileView />
        </div>
        
        <div className="hidden md:block">
          <DesktopView />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Shop;