/* eslint-disable */

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";

import Navbar from "./components/Navbar"
import Footer from "./components/Footer";

import BottlesShop from "./components/assets/BottlesShop.jpg"

import WineCard from "./components/cards/WineCard";
import Filters from "./components/Filters";
import Search from "./components/Search";
import Sorting from "./components/Sorting";
import CircularPagination from "./components/CircularPagination";

import "./components/styles/shop.css"

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

function Shop() {
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
  
  // Данные вин
  const [wines] = useState<Wine[]>([
    {
      id: 1,
      name: 'Вино игристое Sempre Prosecco Brut белое брют',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1027925-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxNTE2N3xpbWFnZS9hdmlmfGltYWdlcy9oNTEvaDY3LzEwOTM3ODA4MzU1MzU4LmF2aWZ8MzQ0ZTE5NzNhNDM1ODgzNGYxNDkzMDg5NWQwNWYzODUzYjc2NzY3M2RlZTVmNTNjNWUxNzJkNDlmYzBlMjMwZg',
      type: 'Белое',
      year: 1985,
      sweetness: 'Полусладкое',
      alcohol: "11.5-12.5",
      sugar: "35-45",
      temperature: "6-8",
      price: 3200,
      description: [
        "Виноград: Шардоне, Пино Блан",
        "Цвет: Светло-соломенный с золотистыми бликами",
        "Аромат: Ноты зеленого яблока, груши и свежей выпечки",
        "Вкус: Элегантная игристость с медовыми нюансами",
        "Сочетания: Устрицы, легкие десерты, фруктовые тарталетки"
      ]
    },
    {
      id: 2,
      name: 'Вино Ведерниковъ Губернаторское Красностоп Золотовский красное сухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1020457-3-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxNzY2MHxpbWFnZS9hdmlmfGltYWdlcy9oZDgvaDAyLzExNjMxNjU2MzM3NDM4LmF2aWZ8MTMzNmViYTUzMDY2ODlhYTZhNjliYTM5ODUyMjM4NmVkNWU5ZTVkNjczOGUyOGUzODA1ZDc3ZTc1ZjBiZTllYw',
      type: 'Красное',
      year: 1980,
      sweetness: 'Полусладкое',
      alcohol: "13-14",
      sugar: "25-35",
      temperature: "16-18",
      price: 8700,
      description: [
        "Виноград: Красностоп",
        "Цвет: Глубокий гранатовый с кирпичными отблесками",
        "Аромат: Выдержанные тона чернослива, кожи и специй",
        "Вкус: Мягкие танины и длительное послевкусие",
        "Сочетания: Дичь, зрелые сыры, мясные пироги"
      ]
    },
    {
      id: 3,
      name: 'Вино JP. Chenet Original Colombard-Chardonnay белое полусухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1021991-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxNDAwNXxpbWFnZS9hdmlmfGltYWdlcy9oMGMvaDM0LzEwNTQzMjUxMjI2NjU0LmF2aWZ8MDAwNDQ2ZWZkNTUxNWQ4OGI2YzQ0NjA4ZTY1ODg3OTQ0ZmJlMzc2MTViYjBhNzIxYWRkMTMyNWU5ODE2NzY5Zg',
      type: 'Белое',
      year: 1975,
      sweetness: 'Полусладкое',
      alcohol: "11-12",
      sugar: "30-40",
      temperature: "8-10",
      price: 4500,
      description: [
        "Виноград: Ркацители, Рислинг",
        "Цвет: Янтарный с золотистыми переливами",
        "Аромат: Сухофрукты, мед и миндальные ноты",
        "Вкус: Маслянистая текстура с карамельным оттенком",
        "Сочетания: Фуа-гра, голубые сыры, ореховые десерты"
      ]
    },
    {
      id: 4,
      name: 'Вино игристое Абрау-Дюрсо Русское Игристое красное полусладкое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1001719-1-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wyMzQ3MnxpbWFnZS9hdmlmfGltYWdlcy9oYzkvaGYyLzExNDIwNTQ4NjYxMjc4LmF2aWZ8MjY5ZWQzYjkxZDBlNDllODMwM2ZjNmU4MzU4MjczYmY2Njk1ZmZmMTE3YjQ3YmI5YzIyYzRjNTk2NWFhYjg3ZQ',
      type: 'Красное',
      year: 1990,
      sweetness: 'Полусладкое',
      alcohol: "12-13",
      sugar: "35-45",
      temperature: "10-12",
      price: 2800,
      description: [
        "Виноград: Каберне Совиньон, Саперави",
        "Цвет: Ярко-рубиновый с фиолетовыми отблесками",
        "Аромат: Малина, вишня и легкие дрожжевые ноты",
        "Вкус: Игристое ягодное настроение с бархатистой пеной",
        "Сочетания: Клубника в шоколаде, ягодные муссы"
      ]
    },
    {
      id: 5,
      name: 'Напиток винный Santo Stefano Rosso Zero безалкогольный',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1028093-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wyMDI2OXxpbWFnZS9hdmlmfGltYWdlcy9oMzgvaDM0LzExMDI0MDg5OTcyNzY2LmF2aWZ8MmMzYjQxNDZmMTQwMmUyMGU1NzYwMTBmY2ZhNGUwNGIxNDcxOWM3YTQ2Y2I0MWRjMWY1YjQ0YTA4NTlkODNlYg',
      type: 'Красное',
      year: 2018,
      sweetness: 'Полусладкое',
      alcohol: "12.5-13.5",
      sugar: "40-50",
      temperature: "10-12",
      price: 1900,
      description: [
        "Виноград: Мерло, Пино Нуар",
        "Цвет: Фиолетово-рубиновый с лиловым краем",
        "Аромат: Свежая клубника, красная смородина",
        "Вкус: Сочная фруктовость с шелковистыми танинами",
        "Сочетания: Легкие десерты, фруктовые салаты"
      ]
    },
    {
      id: 6,
      name: 'Вино Corvo Irmana Frappato красное полусухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1024656-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxMjQ3MnxpbWFnZS9hdmlmfGltYWdlcy9oZWMvaDNjLzEwMDUyMTk4NjYyMTc0LmF2aWZ8MDZhMjM1NGEyZTM5ZWVmMzkyZDk2MWQyMzE4NDNjNTM2NjUwZWJjZmZiMTRiNWZjYmU4NDczNmQ4MmVlZjllOA', 
      type: 'Красное',
      year: 2000, 
      sweetness: 'Полусухое',
      alcohol: "13-14",
      sugar: "8-12",
      temperature: "16-18",
      price: 3500,
      description: [
        "Виноград: Фраппато",
        "Цвет: Прозрачный рубиновый с оранжевыми ободком",
        "Аромат: Сушеная клюква, кориандр, кожистые ноты",
        "Вкус: Элегантная кислинка и минеральный финиш",
        "Сочетания: Паста болоньезе, пицца с салями"
      ]
    },
    {
      id: 7,
      name: 'Вино Corvo Irmana Grillo белое сухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1024655-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxMzI4MXxpbWFnZS9hdmlmfGltYWdlcy9oYzkvaDk5LzEwMDUyMTk4MzM0NDk0LmF2aWZ8ZmE4YmJjZWYzN2M2ZmVjOGZjYTk5ODkyNjJkMmQzNWM1ZThkMDNiZDM2ZDc2ZmIxYmM1MDYxNzIwYzczYjVkZg', 
      type: 'Белое',
      year: 2017, 
      sweetness: 'Сухое',
      alcohol: "12.5-13",
      sugar: "4-6",
      temperature: "8-10",
      price: 2200,
      description: [
        "Виноград: Грилло",
        "Цвет: Бледно-соломенный с зеленоватыми бликами",
        "Аромат: Белый персик, морская галька, миндальные цветы",
        "Вкус: Освежающая минеральность и соленый финиш",
        "Сочетания: Мидии гриль, овощи-гриль, средиземноморские салаты"
      ]
    },
    {
      id: 8,
      name: 'Вино Pasqua Montepulciano d’Abruzzo красное полусухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1004105.png-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxNDQ5MnxpbWFnZS9hdmlmfGltYWdlcy9oZjEvaDljLzEwMTE2MzMyMjkwMDc4LmF2aWZ8Y2QyZjIxNWFiYTkzMzlmZjFlOGNkYTAzY2Q1YTg1ZWJmMTJjMWVhZWZlNzNiMjFmYmYxMjI5ZGJjMzEyZjM0Nw', 
      type: 'Красное',
      year: 2023, 
      sweetness: 'Полусухое',
      alcohol: "13-14",
      sugar: "10-15",
      temperature: "16-18",
      price: 1800,
      description: [
        "Виноград: Монтепульчано",
        "Цвет: Насыщенный фиолетовый с пурпурной пеной",
        "Аромат: Свежая черника, фиалка, легкий перец",
        "Вкус: Сочные фрукты и бархатистые танины",
        "Сочетания: Брускетты, паста карбонара, молодые сыры"
      ]
    },
    {
      id: 9,
      name: 'Вино Faustino Crianza Tempranillo красное сухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1015344-3-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3w5NzE1fGltYWdlL2F2aWZ8aW1hZ2VzL2gwMi9oNjIvMTAzMTgzNTg4NzIwOTQuYXZpZnxiODkzNDU2ZTlkNjA0MGQ3NWFiM2JmNDcwZThmOTA5ODZhM2I1Yzk3YjlmNzMxNDg3ZjAyN2EyY2Q1ZjNkYWQ2', 
      type: 'Красное',
      year: 2022, 
      sweetness: 'Сухое',
      alcohol: "14-14.5",
      sugar: "3-5",
      temperature: "17-19",
      price: 4300,
      description: [
        "Виноград: Каберне Совиньон",
        "Цвет: Глубокий рубиновый с фиолетовым оттенком",
        "Аромат: Черная смородина, эвкалипт, темный шоколад",
        "Вкус: Мощные танины и долгое пряное послевкусие",
        "Сочетания: Стейк рибай, блюда из баранины, выдержанные сыры"
      ]
    },
    {
      id: 10,
      name: 'Вино Il Gaggio Grillo Terre Siciliane белое сухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1014538-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wzNjM2MHxpbWFnZS9hdmlmfGltYWdlcy9oYzMvaDFhLzEwMTE3NDg5OTgzNTE4LmF2aWZ8MGY3NWNiOGIzNGIzOWM4MzBlODRkYjVlMGU4MmZiMjEwODk3ZjAzMDg0MjAzMDNiZjFkMGU1NWY1ODMzYzQxMA', 
      type: 'Красное',
      year: 2015, 
      sweetness: 'Сухое',
      alcohol: "13.5-14",
      sugar: "4-6",
      temperature: "18-20",
      price: 5600,
      description: [
        "Виноград: Санджовезе",
        "Цвет: Гранатовый с кирпичными ободком",
        "Аромат: Вяленая вишня, кожа, трюфельные ноты",
        "Вкус: Комплексный и элегантный с шелковистыми танинами",
        "Сочетания: Флорентийский стейк, дичь, грибные ризотто"
      ]
    },
    {
      id: 11,
      name: 'Вино Masi Modello Bianco белое полусухое',
      image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1018066-2-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wyMjM4NXxpbWFnZS9hdmlmfGltYWdlcy9oZDcvaDU0LzExNjI1MDYzNTQ2OTEwLmF2aWZ8MjNlMzg0ODZkNTk1ZDBmMjMxZGQxYmMwMGNiMDE4NzVmYzZhNmU0NTI1ZDZiNDU1MTE3ODE2MmIzZjJjZDNjYQ', 
      type: 'Белое',
      year: 2015, 
      sweetness: 'Полусухое',
      alcohol: "12-12.5",
      sugar: "15-20",
      temperature: "8-10",
      price: 2700,
      description: [
        "Виноград: Гарганега, Пино Гриджио",
        "Цвет: Светло-золотистый с зеленоватыми рефлексами",
        "Аромат: Белые цветы, спелый персик, миндаль",
        "Вкус: Сбалансированная кислотность с медовыми нюансами",
        "Сочетания: Рыба на гриле, креветки, овощные пасты"
      ]
    },
  ]);

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

  // Флаг для отслеживания первой инициализации
  const isInitialized = useRef(false);
  
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
    // Проверяем корректность activeYearRange
    if (!activeYearRange || activeYearRange.length !== 2 || isNaN(activeYearRange[0]) || isNaN(activeYearRange[1])) {
      return wines; // Возвращаем все вина при некорректном activeYearRange
    }
    
    // Шаг 1: Фильтрация по чекбоксам (тип вина)
    let filtered = wines;
    
    if (activeTypes.length > 0) {
      filtered = filtered.filter(wine => 
        wine.type && activeTypes.includes(wine.type)
      );
    }
    
    // Шаг 2: Фильтрация по чекбоксам (сладость)
    if (activeSweetness.length > 0) {
      filtered = filtered.filter(wine => 
        wine.sweetness && activeSweetness.includes(wine.sweetness)
      );
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
      default:
        sorted.sort((a, b) => a.id - b.id);
    }
    
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
            paginationData.currentItems.map((wine) => (
              <WineCard 
                key={wine.id}
                header={wine.name}
                imgSrc={wine.image}
                to={`/Каталог/${wine.id}`}
                state={{wine}}
              />
            ))
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
              {paginationData.currentItems.map((wine) => (
                <div key={wine.id} className="mx-auto">
                  <WineCard 
                    header={wine.name}
                    imgSrc={wine.image}
                    to={`/Каталог/${wine.id}`}
                    state={{wine}}
                  />
                </div>
              ))}
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
}

export default Shop;
