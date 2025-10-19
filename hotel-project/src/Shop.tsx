/* eslint-disable */

import React, { useState, useMemo, useCallback, useEffect, useRef, useContext } from "react";
import { Context } from './index';
import { observer, Observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

import Navbar from "./components/Navbar"
import Footer from "./components/Footer";

import BottlesShop from "./components/assets/BottlesShop.jpg"

import WineCard from "./components/cards/WineCard";
import Filters from "./components/Filters";
import Search from "./components/Search";
import Sorting from "./components/Sorting";
import CircularPagination from "./components/CircularPagination";

import "./components/styles/shop.css"
import { winesEmergency } from './emergencyContent/text';
import { getArrayOrEmergency } from './utils/contentHelpers';
import { API_BASE, STATIC_BASE } from './components/http';

interface Wine {
  id: number;
  name: string;
  image: string;
  type?: string;
  year?: number;
  sweetness?: string;
  alcohol?: string;
  sugar?: string;
  temperature: string;
  price?: number;
  description?: string[];
}

const Shop = observer(() => {
  const [nav, setNav] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Каталог');
  const [sortOption, setSortOption] = useState('По умолчанию');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Настраиваемый параметр - количество элементов на странице
  const itemsPerPage = 6;
  
  // Состояние для текущей страницы пагинации
  const [currentPage, setCurrentPage] = useState(1);
  
  // Фильтры - применяются только после нажатия кнопки "Применить фильтры"
  // Активные фильтры (которые применяются к списку)
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeSweetness, setActiveSweetness] = useState<string[]>([]);
  const [activeYearRange, setActiveYearRange] = useState<[number, number]>([1970, 2025]);
  
  // Флаг для отслеживания первой инициализации
  const isInitialized = useRef(false);

  // Access Context stores
  const context = useContext(Context);
  if (!context) {
    throw new Error('Shop must be used within Context Provider');
  }
  const { wine } = context;

  // Log data from stores
  useEffect(() => {
    console.log('=== SHOP PAGE DATA ===');
    console.log('All wines:', wine.wines);
    console.log('Loading state:', { wine: wine.isLoading });
  }, [wine.wines]);

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
      return `${STATIC_BASE}${image}`;
    }
    return '';
  };

  // Helper to serialize wine for navigation
  const serializeWine = (wine: Wine) => {
    try {
      // Convert MobX observable to plain JS object using toJS
      const plainWine = toJS(wine);
      // Then do a deep clone using JSON to ensure full serialization
      return JSON.parse(JSON.stringify({
        id: plainWine.id,
        name: plainWine.name,
        image: plainWine.image,
        type: plainWine.type,
        year: plainWine.year,
        sweetness: plainWine.sweetness,
        alcohol: plainWine.alcohol,
        sugar: plainWine.sugar,
        temperature: plainWine.temperature,
        price: plainWine.price,
        description: Array.isArray(plainWine.description) ? [...plainWine.description] : plainWine.description,
      }));
    } catch (e) {
      console.error('Error serializing wine:', e);
      return null;
    }
  };

  // Transform WineStorage structure to flat Wine[] array
  const wines: Wine[] = useMemo(() => {
    if (wine.wines.length === 0) {
      // Fallback to emergency data
      return winesEmergency as unknown as Wine[];
    }

    const flatWines: Wine[] = [];
    wine.wines.forEach((wineType) => {
      wineType.assortment.forEach((assortment) => {
        assortment.wines.forEach((w) => {
          const normalizedType = typeof wineType.type === 'string' ? wineType.type.trim().toLowerCase() : wineType.type;
          const normalizedSweetness = typeof assortment.sweetness === 'string' ? assortment.sweetness.trim().toLowerCase() : assortment.sweetness;
          flatWines.push({
            id: w.id,
            name: w.name,
            image: getImageUrl(w.images?.[0] || ''),
            type: normalizedType,
            year: w.year,
            sweetness: normalizedSweetness,
            alcohol: w.alcohol,
            sugar: w.sugar,
            temperature: w.temperature,
            price: w.price,
            description: w.description,
          });
        });
      });
    });
    
    // Debug: Log wine types and sweetness to verify data structure
    console.log('=== SHOP: Wines data ===');
    console.log('Total wines:', flatWines.length);
    console.log('Unique types:', [...new Set(flatWines.map(w => w.type))]);
    console.log('Unique sweetness:', [...new Set(flatWines.map(w => w.sweetness))]);
    console.log('All wines with type and sweetness:');
    flatWines.forEach((w, idx) => {
      console.log(`  [${idx}] ${w.name}: type="${w.type}" (${typeof w.type}), sweetness="${w.sweetness}" (${typeof w.sweetness})`);
    });
    
    return flatWines;
  }, [wine.wines]);

  // Вычисляем минимальный и максимальный год для слайдера
  const { minYear, maxYear } = useMemo(() => {
    let min = 1970; // Значение по умолчанию
    let max = 2025; // Значение по умолчанию
    
    if (wines.length > 0) {
      // Фильтруем вина с годом и находим min/max
      const yearsArray = wines
        .filter(wine => wine.year !== undefined)
        .map(wine => wine.year as number);
      
      if (yearsArray.length > 0) {
        min = Math.min(...yearsArray);
        max = Math.max(...yearsArray);
      }
    }
    
    return { minYear: min, maxYear: max };
  }, [wines]);
  
  // Используем useEffect для установки начальных значений activeYearRange только один раз
  useEffect(() => {
    if (!isInitialized.current) {
      setActiveYearRange([minYear, maxYear]);
      isInitialized.current = true;
    }
  }, [minYear, maxYear]);

  // Обработчики изменения фильтров - эти функции передаются в компонент Filters
  // и вызываются только когда пользователь нажимает "Применить фильтры"
  const handleTypeChange = useCallback((types: string[]) => {
    setActiveTypes(types);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтров
  }, []);

  const handleSweetnessChange = useCallback((sweetness: string[]) => {
    setActiveSweetness(sweetness);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтров
  }, []);

  const handleYearRangeChange = useCallback((min: number, max: number) => {
    // Проверяем, что значения валидны
    if (isNaN(min) || isNaN(max)) return;
    console.log(min, max)
    // Обновляем активный диапазон годов
    setActiveYearRange([Number(min), Number(max)]);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтров
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении поиска
  }, []);

  const handleSortChange = useCallback((option: string) => {
    setSortOption(option);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении сортировки
  }, []);

  // Мемоизируем обработчик сброса фильтров
  const handleResetFilters = useCallback(() => {
    setActiveTypes([]);
    setActiveSweetness([]);
    setActiveYearRange([minYear, maxYear]);
    setSearchQuery('');
    setSortOption('По умолчанию');
    setCurrentPage(1); // Сбрасываем на первую страницу при сбросе фильтров
  }, [minYear, maxYear]);

  // Мемоизированный обработчик изменения страницы
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Прокручиваем страницу вверх при смене страницы
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Применяем фильтрацию и сортировку с помощью useMemo для оптимизации
  const filteredProducts = useMemo(() => {
    console.log('=== SHOP: Filtering wines ===');
    console.log('Active types:', activeTypes);
    console.log('Active sweetness:', activeSweetness);
    console.log('Active year range:', activeYearRange);
    console.log('Sort option:', sortOption);
    
    // Проверяем корректность activeYearRange
    if (!activeYearRange || activeYearRange.length !== 2 || isNaN(activeYearRange[0]) || isNaN(activeYearRange[1])) {
      return wines; // Возвращаем все вина при некорректном activeYearRange
    }
    
    // Шаг 1: Фильтрация по чекбоксам (тип вина)
    let filtered = wines;
    
    if (activeTypes.length > 0) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(wine => 
        wine.type && activeTypes.includes(wine.type)
      );
      console.log(`Type filter: ${beforeFilter} -> ${filtered.length} wines`);
    }
    
    // Шаг 2: Фильтрация по чекбоксам (сладость)
    if (activeSweetness.length > 0) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(wine => 
        wine.sweetness && activeSweetness.includes(wine.sweetness)
      );
      console.log(`Sweetness filter: ${beforeFilter} -> ${filtered.length} wines`);
    }
    
    // Шаг 3: Фильтрация по диапазону годов
    filtered = filtered.filter(wine => 
      wine.year !== undefined && 
      wine.year >= activeYearRange[0] && 
      wine.year <= activeYearRange[1]
    );
    
    
    // Шаг 4: Поиск по тексту
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(wine => 
        wine.name.toLowerCase().includes(query)
      );
    }
    
    // Шаг 5: Сортировка
    const sorted = [...filtered];
    console.log(`Sorting by: ${sortOption}`);
    switch(sortOption) {
      case 'По названию (А-Я)':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'По названию (Я-А)':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'По году (новые)':
        sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case 'По году (старые)':
        sorted.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case 'По цене (возрастание)':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        console.log('First 3 prices (asc):', sorted.slice(0, 3).map(w => ({ name: w.name, price: w.price })));
        break;
      case 'По цене (убывание)':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        console.log('First 3 prices (desc):', sorted.slice(0, 3).map(w => ({ name: w.name, price: w.price })));
        break;
      default:
        sorted.sort((a, b) => a.id - b.id);
    }
    
    console.log(`Final result: ${sorted.length} wines`);
    return sorted;
  }, [wines, activeTypes, activeSweetness, activeYearRange, searchQuery, sortOption]);

  // Мемоизируем пагинацию для оптимизации
  const paginationData = useMemo(() => {
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Если текущая страница больше, чем общее количество страниц, сбрасываем на первую
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
    
    // Вычисляем индексы для текущей страницы
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
    // Получаем элементы для текущей страницы
    const currentItems = filteredProducts.slice(startIndex, endIndex);
    
    return {
      currentItems,
      totalPages,
      showPagination: totalItems > itemsPerPage
    };
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Show loading if data is still being fetched
  if (wine.isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-2xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  // Компонент для отображения пустого результата
  const EmptyResult = () => (
    <div className="w-full text-center py-10">
      <h3 className="text-xl text-gray-600 mb-2">Для вас ничего не нашлось 🙁</h3>
      <p className="text-gray-500">Попробуйте изменить параметры фильтрации</p>
      <button 
        onClick={handleResetFilters}
        className="mt-4 py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
      >
        Сбросить фильтры
      </button>
    </div>
  );

  const MobileView = () => (
    <div className="flex flex-col min-h-screen bg-white">
      <section
        className="h-[500px] bg-cover bg-center bg-no-repeat rounded-b-3xl"
        style={{ backgroundImage: `url('${BottlesShop}')` }}
      />
      
      <div className="p-4">
        <Filters 
          isMobile={true} 
          yearRange={activeYearRange}  // Передаем активное значение как начальное
          setYearRange={handleYearRangeChange} 
          onSortChange={handleSortChange}
          selectedTypes={activeTypes}  // Передаем активное значение как начальное
          onTypeChange={handleTypeChange}
          selectedSweetness={activeSweetness}  // Передаем активное значение как начальное
          onSweetnessChange={handleSweetnessChange}
          onResetFilters={handleResetFilters}
          minYear={minYear}
          maxYear={maxYear}
        />

        <Search 
          isMobile={false}
          onSearch={handleSearch}
          suggestionsList={wines.map(p => p.name)}
        />
        
        <div className="flex flex-col items-center mt-4">
          {paginationData.currentItems.length > 0 ? (
            paginationData.currentItems.map((wine) => {
              const serializedWine = serializeWine(wine);
              return (
                <WineCard 
                  key={wine.id}
                  header={wine.name}
                  imgSrc={wine.image}
                  to={`/Shop/${wine.id}`}
                  state={serializedWine ? { wine: serializedWine } : undefined}
                />
              );
            })
          ) : (
            <EmptyResult />
          )}
        </div>
        
        {/* Пагинация для мобильной версии */}
        {paginationData.showPagination && (
          <div className="mt-6 mb-8">
            <CircularPagination 
              currentPage={currentPage}
              totalPages={paginationData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
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
            yearRange={activeYearRange}  // Передаем активное значение как начальное
            setYearRange={handleYearRangeChange}
            selectedTypes={activeTypes}  // Передаем активное значение как начальное
            onTypeChange={handleTypeChange}
            selectedSweetness={activeSweetness}  // Передаем активное значение как начальное
            onSweetnessChange={handleSweetnessChange}
            onResetFilters={handleResetFilters}
            minYear={minYear}
            maxYear={maxYear}
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

          {paginationData.currentItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3 2xl:gap-12">
              {paginationData.currentItems.map((wine) => {
                const serializedWine = serializeWine(wine);
                return (
                  <div key={wine.id} className="mx-auto">
                    <WineCard 
                      header={wine.name}
                      imgSrc={wine.image}
                      to={`/Shop/${wine.id}`}
                      state={serializedWine ? { wine: serializedWine } : undefined}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyResult />
          )}
          
          {/* Пагинация для десктопной версии */}
          {paginationData.showPagination && (
            <CircularPagination 
              currentPage={currentPage}
              totalPages={paginationData.totalPages}
              onPageChange={handlePageChange}
            />
          )}
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
});

export default Shop;
