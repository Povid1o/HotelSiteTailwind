const fs = require('fs');
const path = require('path');
const sequelize = require('../db');
const {
  Room, RoomImage, RoomProperty, RoomConvenience, RoomPrice, RoomNote,
  DishCategory, Dish, DishImage,
  EventCategory, Event, EventImage,
  WineType, WineSweetness, Wine, WineDescription, WineImage
} = require('../models/models');

const STATIC_DIR = path.join(__dirname, '..', 'static');

async function downloadImage(url, relativePath) {
  try {
    const fullPath = path.join(STATIC_DIR, relativePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Download image using fetch
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch image from ${url}: ${response.statusText}`);
      return `/static/${relativePath}`;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(fullPath, buffer);
    console.log(`Saved image: ${relativePath}`);
    return `/static/${relativePath}`;
  } catch (err) {
    console.error(`Error downloading ${url}:`, err.message);
    return `/static/${relativePath}`;
  }
}

async function seed() {
  console.log('--- Starting Full Database Seeding ---');
  await sequelize.authenticate();
  console.log('Database connected.');

  // ----------------------------------------------------
  // 1. SEED ROOMS
  // ----------------------------------------------------
  console.log('\nSeeding Rooms...');
  await RoomImage.destroy({ where: {} });
  await RoomProperty.destroy({ where: {} });
  await RoomConvenience.destroy({ where: {} });
  await RoomPrice.destroy({ where: {} });
  await RoomNote.destroy({ where: {} });
  await Room.destroy({ where: {} });

  const roomsData = [
    {
      name: 'Люкс «Панорама Террас»',
      description: 'Просторный премиум-люкс с авторским дизайном в теплых эко-тонах. Главная особенность — частная панорамная терраса с незабываемым видом на виноградники и закат. В номере созданы все условия для полного уединения и восстановления.',
      check_in_time: '15:00',
      check_out_time: '12:00',
      is_active: true,
      properties: ['До 2 гостей', '55 м²', 'Панорамная терраса 20 м²', 'Вид на виноградники'],
      conveniences: [
        'Кровать King-size с ортопедическим матрасом',
        'Индивидуальный винный шкаф с приветственной бутылкой',
        'Кофемашина Nespresso и премиальный чайный сет',
        'Отдельностоящая ванна у окна с видом на закат',
        'Премиальная косметика, халаты и тапочки',
        'Высокоскоростной Wi-Fi & Smart TV 55"'
      ],
      prices: [
        { title: 'Будние дни (Пн-Чт)', price: 24000 },
        { title: 'Выходные дни (Пт-Вс)', price: 29000 }
      ],
      notes: [
        'В стоимость входит авторский завтрак с игристым вином',
        'Безлимитный доступ к подогреваемому бассейну и СПА-зоне',
        'Приветственный сет из фруктов и ремесленных сыров'
      ],
      imageUrls: [
        { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', file: 'rooms/room_lux_panorama_1.jpg', alt: 'Люкс Панорама Террас - Интерьер' },
        { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', file: 'rooms/room_lux_panorama_2.jpg', alt: 'Люкс Панорама Террас - Ванная' },
        { url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80', file: 'rooms/room_lux_panorama_3.jpg', alt: 'Люкс Панорама Террас - Спальня' }
      ]
    },
    {
      name: 'Делюкс с купелью на террасе',
      description: 'Изысканный номер с выходом на персональную приватную террасу, где установлена подогреваемая деревянная купель под открытым небом. Наслаждайтесь расслабляющими процедурами и видом на звездное небо.',
      check_in_time: '15:00',
      check_out_time: '12:00',
      is_active: true,
      properties: ['До 2 гостей', '42 м²', 'Частная терраса с купелью', 'Вид на долину'],
      conveniences: [
        'Теплая деревянная купель на террасе (работает круглый год)',
        'Двуспальная кровать King-size',
        'Камин на биотопливе в номере',
        'Мини-бар с локальной гастрономией',
        'Премиальная звукоизоляция',
        'Акустическая система Marshall'
      ],
      prices: [
        { title: 'Будние дни (Пн-Чт)', price: 19500 },
        { title: 'Выходные дни (Пт-Вс)', price: 24500 }
      ],
      notes: [
        'Подготовка купели с хвоей и аромамаслами входит в стоимость',
        'Возможность подачи романтического завтрака на террасу'
      ],
      imageUrls: [
        { url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80', file: 'rooms/room_deluxe_kupel_1.jpg', alt: 'Делюкс с купелью - Спальня' },
        { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', file: 'rooms/room_deluxe_kupel_2.jpg', alt: 'Делюкс с купелью - Интерьер' }
      ]
    },
    {
      name: 'Вилла у виноградника «Terrace Estate»',
      description: 'Роскошная двухуровневая вилла с собственным садом, подогреваемым бассейно-инфинити и барбекю-зоной. Превосходный выбор для семьи или компании друзей, ценителей наивысшего стандарта комфорта и персонального сервиса.',
      check_in_time: '15:00',
      check_out_time: '12:00',
      is_active: true,
      properties: ['До 6 гостей', '140 м²', 'Собственный инфинити-бассейн', 'Приватная территория 500 м²'],
      conveniences: [
        '3 мастер-спальни с индивидуальными ванными комнатами',
        'Просторная гостиная с обеденной зоной и камином',
        'Персональный подогреваемый бассейн',
        'Профессиональная кухня и барбекю-зона',
        'Услуги персонального батлера 24/7',
        'Частный винный погреб с резервными винами'
      ],
      prices: [
        { title: 'Будние дни (Пн-Чт)', price: 65000 },
        { title: 'Выходные дни (Пт-Вс)', price: 78000 }
      ],
      notes: [
        'Включает приветственный эногастрономический ужин от шеф-повара',
        'Индивидуальный трансфер на автомобиле премиум-класса'
      ],
      imageUrls: [
        { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', file: 'rooms/room_villa_1.jpg', alt: 'Вилла Terrace Estate - Бассейн' },
        { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', file: 'rooms/room_villa_2.jpg', alt: 'Вилла Terrace Estate - Вид' }
      ]
    },
    {
      name: 'Семейный Апартамент с гостиной',
      description: 'Уютный двухкомнатный апартамент с продуманным зонированием для семейного отдыха. Просторная гостиная, большая открытая терраса и все необходимые удобства для проживания с детьми.',
      check_in_time: '15:00',
      check_out_time: '12:00',
      is_active: true,
      properties: ['До 4 гостей', '60 м²', '2 изолированные комнаты', 'Вид на реликтовый парк'],
      conveniences: [
        'Главная спальня King-size и уютная детская спальня',
        'Гостиная зона с раскладным диваном',
        'Мини-кухня с СВЧ-печью, чайником и посудой',
        'Две полноценные ванные комнаты',
        'Детская косметика, халатики и игрушки',
        'Настольные игры и детские каналы'
      ],
      prices: [
        { title: 'Будние дни (Пн-Чт)', price: 21000 },
        { title: 'Выходные дни (Пт-Вс)', price: 26000 }
      ],
      notes: [
        'Детский завтрак и анимационная программа входят в цену',
        'Предоставление детской кроватки по запросу'
      ],
      imageUrls: [
        { url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80', file: 'rooms/room_family_1.jpg', alt: 'Семейный апартамент - Спальня' },
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', file: 'rooms/room_family_2.jpg', alt: 'Семейный апартамент - Гостиная' }
      ]
    },
    {
      name: 'Стандарт Улучшенный с балконом',
      description: 'Лаконичный и стильный номер в стиле современной классики. Отделка из натурального дерева, мягкий текстиль и аккуратный балкон с плетеной мебелью для утреннего кофе.',
      check_in_time: '15:00',
      check_out_time: '12:00',
      is_active: true,
      properties: ['До 2 гостей', '28 м²', 'Балкон с французским остеклением', 'Вид в тихий сад'],
      conveniences: [
        'Двуспальная кровать Queen-size',
        'Комфортное рабочее место',
        'Душевая кабина с тропическим душем',
        'Климат-контроль, сейф и фен',
        'Компактный мини-бар',
        'Скоростной Wi-Fi'
      ],
      prices: [
        { title: 'Будние дни (Пн-Чт)', price: 12500 },
        { title: 'Выходные дни (Пт-Вс)', price: 15500 }
      ],
      notes: [
        'Завтрак "шведский стол" входит в стоимость',
        'Свободное посещение тренажерного зала'
      ],
      imageUrls: [
        { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80', file: 'rooms/room_standard_1.jpg', alt: 'Стандарт Улучшенный - Кровать' },
        { url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80', file: 'rooms/room_standard_2.jpg', alt: 'Стандарт Улучшенный - Детали' }
      ]
    }
  ];

  for (const rData of roomsData) {
    const room = await Room.create({
      name: rData.name,
      description: rData.description,
      check_in_time: rData.check_in_time,
      check_out_time: rData.check_out_time,
      is_active: rData.is_active
    });

    for (let idx = 0; idx < rData.imageUrls.length; idx++) {
      const imgInfo = rData.imageUrls[idx];
      const savedUrl = await downloadImage(imgInfo.url, imgInfo.file);
      await RoomImage.create({
        room_id: room.id,
        url: savedUrl,
        alt_text: imgInfo.alt,
        order: idx + 1
      });
    }

    for (const propText of rData.properties) {
      await RoomProperty.create({ room_id: room.id, property_text: propText });
    }
    for (const convText of rData.conveniences) {
      await RoomConvenience.create({ room_id: room.id, convenience_text: convText });
    }
    for (const priceObj of rData.prices) {
      await RoomPrice.create({ room_id: room.id, title: priceObj.title, price: priceObj.price });
    }
    for (const noteText of rData.notes) {
      await RoomNote.create({ room_id: room.id, note_text: noteText });
    }
    console.log(`Created Room: ${room.name}`);
  }

  // ----------------------------------------------------
  // 2. SEED RESTAURANT DISHES
  // ----------------------------------------------------
  console.log('\nSeeding Restaurant Dishes...');
  await DishImage.destroy({ where: {} });
  await Dish.destroy({ where: {} });
  await DishCategory.destroy({ where: {} });

  const dishCategoriesData = [
    {
      name: 'Закуски',
      dishes: [
        {
          name: 'Тартар из выдержанной говядины с трюфельным кремом',
          header: 'Фирменное блюдо',
          description_short: 'Мраморная говядина 45-дневной выдержки, трюфельный эмульгатор, каперсы и чипсы из пармезана.',
          description_full: 'Классический тартар из фермерской выдержанной говядины с добавлением трюфельного крема, маринованного лука-шалот и перепелиного желтка. Подается с румяной бриошью, запеченной на углях.',
          weight: '180 г',
          price: 1250.00,
          nutrients: { calories: 340, proteins: '24г', fats: '22г', carbs: '8г' },
          image: { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80', file: 'dishes/tartar_beef.jpg', alt: 'Тартар из говядины' }
        },
        {
          name: 'Плато фермерских сыров и вяленого мяса',
          header: 'Идеально к вину',
          description_short: 'Ассорти ремесленных сыров, копа, брезаола, инжирный конфитюр и кедровые орехи.',
          description_full: 'Изысканная винная тарелка: выдержанный крафтовый сыр, твердый сыр из козьего молока, вяленый окорок собственного соления, гречишный мед и запеченные тосты.',
          weight: '320 г',
          price: 1850.00,
          nutrients: { calories: 580, proteins: '32г', fats: '45г', carbs: '12г' },
          image: { url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1000&q=80', file: 'dishes/cheese_platter.jpg', alt: 'Сырная тарелка' }
        },
        {
          name: 'Запеченный камамбер с инжиром и розмарином',
          header: 'Горячая закуска',
          description_short: 'Головка нежного камамбера, запеченная в печи с инжирным соусом и орехами.',
          description_full: 'Тягучий запеченный камамбер из местной сыроварни с карамелизованным инжиром, грецкими орехами и свежим розмарином. Подается с согревающим хрустящим багетом.',
          weight: '220 г',
          price: 1100.00,
          nutrients: { calories: 420, proteins: '18г', fats: '28г', carbs: '22г' },
          image: { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80', file: 'dishes/camembert.jpg', alt: 'Запеченный камамбер' }
        }
      ]
    },
    {
      name: 'Горячие блюда',
      dishes: [
        {
          name: 'Стейк Рибай с печеными овощами',
          header: 'Блюдо от шефа',
          description_short: 'Премиальный стейк зернового откорма на углях соусом из красного вина.',
          description_full: 'Стейк Рибай 28 дней вызревания. Подается с молодыми цукини, томатами черри на ветке, перечным соусом и выдержанным соусом демиглас с добавлением нашего Cabernet Sauvignon.',
          weight: '350 г',
          price: 3400.00,
          nutrients: { calories: 720, proteins: '54г', fats: '48г', carbs: '6г' },
          image: { url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80', file: 'dishes/ribeye_steak.jpg', alt: 'Стейк Рибай' }
        },
        {
          name: 'Дикий лосось на гриле со спаржей',
          header: 'Рыбное блюдо',
          description_short: 'Стейк лосося су-вид, зеленая спаржа и сливочно-винный соус Beurre Blanc.',
          description_full: 'Сочный дикий лосось с золотистой корочкой, обжаренная на сливочном масле хрустящая спаржа, пюре из зеленого горошка и соус на основе белого вина Chardonnay.',
          weight: '260 г',
          price: 2200.00,
          nutrients: { calories: 480, proteins: '38г', fats: '32г', carbs: '10г' },
          image: { url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80', file: 'dishes/salmon_steak.jpg', alt: 'Лосось на гриле' }
        },
        {
          name: 'Утиная грудка с вишневым демиглясом',
          header: 'Блюдо из птицы',
          description_short: 'Утиное филе Магре, пюре из батата и пряный вишнево-винный соус.',
          description_full: 'Филе фермерской утки прожарки medium с аппетитной хрустящей кожицей. Подается с шелковистым пюре из сладкого батата и соусом из пьяной вишни со специями.',
          weight: '280 г',
          price: 1950.00,
          nutrients: { calories: 510, proteins: '32г', fats: '30г', carbs: '24г' },
          image: { url: 'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?auto=format&fit=crop&w=1000&q=80', file: 'dishes/duck_breast.jpg', alt: 'Утиная грудка' }
        }
      ]
    },
    {
      name: 'Десерты',
      dishes: [
        {
          name: 'Авторский Тирамису с винным ликером',
          header: 'Фирменный десерт',
          description_short: 'Нежный крем из маскарпоне, бисквиты савоярди и выдержанный винный десертный ликер.',
          description_full: 'Итальянская классика в авторской подаче с добавлением домашнего ночетто, свежесваренного эспрессо и какао высшей категории.',
          weight: '160 г',
          price: 650.00,
          nutrients: { calories: 380, proteins: '7г', fats: '22г', carbs: '36г' },
          image: { url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1000&q=80', file: 'dishes/tiramisu.jpg', alt: 'Авторский Тирамису' }
        },
        {
          name: 'Шоколадный фондант с ванильным джелато',
          header: 'Горячий десерт',
          description_short: 'Тонкий кекс из темного шоколада с вытекающей горячей начинкой и мороженым.',
          description_full: 'Теплый бисквит из 70% бельгийского шоколада с жидким центром. Подается с шариком домашнего ремесленного мороженого с бурбонской ванилью.',
          weight: '150 г',
          price: 700.00,
          nutrients: { calories: 430, proteins: '8г', fats: '26г', carbs: '42г' },
          image: { url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=80', file: 'dishes/chocolate_fondant.jpg', alt: 'Шоколадный фондант' }
        },
        {
          name: 'Пьяная груша в красном вине со специями',
          header: 'Легкий десерт',
          description_short: 'Груша, томленая в Pinot Noir с пряностями, и прохладный смородиновый сорбет.',
          description_full: 'Сочная груша Конференция, сваренная в красном вине с палочками корицы, звездочками бадьяна и цедрой апельсина. Подается с кисленьким сорбетом.',
          weight: '180 г',
          price: 600.00,
          nutrients: { calories: 240, proteins: '2г', fats: '3г', carbs: '48г' },
          image: { url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80', file: 'dishes/poached_pear.jpg', alt: 'Пьяная груша' }
        }
      ]
    },
    {
      name: 'Напитки & Бар',
      dishes: [
        {
          name: 'Фирменный коктейль «Grapevine Sour»',
          header: 'Авторский микс',
          description_short: 'Виноградный дистиллят, сок лайма, домашний кордиал и легкая бархатистая пена.',
          description_full: 'Авторский коктейль на основе граппы собственного производства с тонким ароматом свежего винограда и идеальным балансом кислинки.',
          weight: '160 мл',
          price: 850.00,
          nutrients: { calories: 180 },
          image: { url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80', file: 'dishes/cocktail_sour.jpg', alt: 'Коктейль Grapevine Sour' }
        },
        {
          name: 'Сангрия на розовом вине с ягодами',
          header: 'Кувшин для компании',
          description_short: 'Розовое сухое вино Rose 2023, свежая малина, клубника, мята и цитрусовый микс.',
          description_full: 'Освежающий кувшин сангрии на основе нашего Rose с изобилием свежих сезонных ягод, мяты и льда.',
          weight: '750 мл',
          price: 2100.00,
          nutrients: { calories: 340 },
          image: { url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80', file: 'dishes/sangria_rose.jpg', alt: 'Сангрия на розовом вине' }
        }
      ]
    }
  ];

  for (const catData of dishCategoriesData) {
    const category = await DishCategory.create({ name: catData.name });
    for (const dData of catData.dishes) {
      const savedImgUrl = await downloadImage(dData.image.url, dData.image.file);
      const dish = await Dish.create({
        category_id: category.id,
        name: dData.name,
        header: dData.header,
        description_short: dData.description_short,
        description_full: dData.description_full,
        weight: dData.weight,
        price: dData.price,
        nutrients: dData.nutrients,
        is_active: true
      });
      await DishImage.create({
        dish_id: dish.id,
        url: savedImgUrl,
        alt_text: dData.image.alt,
        order: 1
      });
      console.log(`Created Dish: ${dish.name} (${category.name})`);
    }
  }

  // ----------------------------------------------------
  // 3. SEED EVENTS
  // ----------------------------------------------------
  console.log('\nSeeding Events...');
  await EventImage.destroy({ where: {} });
  await Event.destroy({ where: {} });

  const categoriesFromDb = await EventCategory.findAll();
  const catMap = {};
  categoriesFromDb.forEach(c => { catMap[c.header] = c.id; });

  const eventsData = [
    {
      categoryHeader: 'Дегустации',
      title: '«Секреты винтажей: Вертикальная дегустация Pinot Noir»',
      description: 'Шеф-сомелье резиденции проведет гостей через 5 уникальных урожаев сорта Pinot Noir. Вы узнаете, как менялся характер вина от года к году под влиянием погоды и дубовых бочек. В стоимость входит гастрономический сет закусок от шефа.',
      image: { url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80', file: 'events/event_tasting.jpg', alt: 'Дегустация Pinot Noir' }
    },
    {
      categoryHeader: 'Ресторан',
      title: '«Гастрономический сет-ужин: Дикая дичь и выдержанное вино»',
      description: 'Эногастрономический вечер из 6 перемен блюд. Шеф-повар презентует блюда из оленины, утки и локальных сыров в сопровождении редких резервных вин из закрытой коллекции нашей винодельни.',
      image: { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', file: 'events/event_dinner.jpg', alt: 'Гастрономический ужин' }
    },
    {
      categoryHeader: 'Экскурсии',
      title: '«Прогулка по террасам и винному подземелью»',
      description: 'Пешая экскурсия по живописным виноградным склонам с посещением гравитационной винодельни и подземных дубовых погребов. Вы увидите весь путь производства от лозы до бутылки и продегустируете молодое вино из бочки.',
      image: { url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80', file: 'events/event_excursion.jpg', alt: 'Экскурсия по виноградникам' }
    },
    {
      categoryHeader: 'Open-air',
      title: '«Sunset Jazz & Wine: Живая музыка на террасе»',
      description: 'Атмосферный музыкальный вечер под открытым небом на закате. Джазовый квартет, приветственный бокал игристого на входе, согревающие пледы и незабываемый вид на заходящее солнце.',
      image: { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80', file: 'events/event_jazz.jpg', alt: 'Джаз на террасе' }
    },
    {
      categoryHeader: 'Сезонные',
      title: '«Праздник первого урожая: Сбор винограда и пикник»',
      description: 'Примите участие в вековом ритуале сбора винограда! Вас ждет утренний сбор лозы, ручной отжим ягод в деревянных чанах, а затем праздничный пикник на траве с домашними угощениями и молодым вином.',
      image: { url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1200&q=80', file: 'events/event_harvest.jpg', alt: 'Праздник урожая' }
    },
    {
      categoryHeader: 'Акции',
      title: '«Винный уикенд: Проживание + Дегустационный тур»',
      description: 'Специальное комплексное предложение: 2 суток в номере категории Делюкс или Люкс со скидкой 20%, включающее бесплатный визит на дегустационный тур и подарок при заезде.',
      image: { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', file: 'events/event_weekend.jpg', alt: 'Винный уикенд' }
    }
  ];

  for (const evData of eventsData) {
    const catId = catMap[evData.categoryHeader] || Object.values(catMap)[0];
    const savedImgUrl = await downloadImage(evData.image.url, evData.image.file);
    const event = await Event.create({
      category_id: catId,
      title: evData.title,
      description: evData.description
    });
    await EventImage.create({
      event_id: event.id,
      url: savedImgUrl,
      alt_text: evData.image.alt,
      order: 1
    });
    console.log(`Created Event: ${event.title}`);
  }

  // ----------------------------------------------------
  // 4. SEED WINES
  // ----------------------------------------------------
  console.log('\nSeeding Wines...');
  await WineDescription.destroy({ where: {} });
  await WineImage.destroy({ where: {} });
  await Wine.destroy({ where: {} });

  const redType = await WineType.findOne({ where: { name: 'красное' } });
  const whiteType = await WineType.findOne({ where: { name: 'белое' } });
  const roseType = await WineType.findOne({ where: { name: 'розовое' } });

  const drySweet = await WineSweetness.findOne({ where: { name: 'сухое' } });
  const semiDrySweet = await WineSweetness.findOne({ where: { name: 'полусухое' } });
  const semiSweet = await WineSweetness.findOne({ where: { name: 'полусладкое' } });

  const winesData = [
    {
      type_id: redType.id,
      sweetness_id: drySweet.id,
      name: 'Пино Нуар Резерв',
      year: 2021,
      alcohol: '13.5%',
      sugar: '2.0 г/л',
      temperature: '16-18 °C',
      price: 3800.00,
      description: [
        'Глубокий рубиновый цвет с гранатовыми отблесками.',
        'Аромат спелой дикой вишни, подлеска, специй и дымных тонов французского дуба.',
        'Бархатистые танины и продолжительное многогранное послевкусие.'
      ],
      image: { url: 'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?auto=format&fit=crop&w=1000&q=80', file: 'wines/wine_pinot.jpg', alt: 'Пино Нуар Резерв' }
    },
    {
      type_id: whiteType.id,
      sweetness_id: drySweet.id,
      name: 'Шардоне Терруар',
      year: 2022,
      alcohol: '12.5%',
      sugar: '1.5 г/л',
      temperature: '10-12 °C',
      price: 2900.00,
      description: [
        'Светло-золотистый цвет с лимонным блеском.',
        'Букет с тонами спелого персика, цедры грейпфрута и сливочного бриоша.',
        'Свежая минеральность и шелковистая текстура.'
      ],
      image: { url: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&w=1000&q=80', file: 'wines/wine_chardonnay.jpg', alt: 'Шардоне Терруар' }
    },
    {
      type_id: roseType.id,
      sweetness_id: semiDrySweet.id,
      name: 'Розе де Террас',
      year: 2023,
      alcohol: '12.0%',
      sugar: '6.0 г/л',
      temperature: '8-10 °C',
      price: 2400.00,
      description: [
        'Нежный кораллово-розовый оттенок.',
        'Аромат свежей лесной малины, земляники и лепестков розы.',
        'Легкий ягодный вкус с освежающей кислинкой.'
      ],
      image: { url: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=1000&q=80', file: 'wines/wine_rose.jpg', alt: 'Розе де Террас' }
    },
    {
      type_id: redType.id,
      sweetness_id: drySweet.id,
      name: 'Каберне Совиньон Гранд Резерв',
      year: 2020,
      alcohol: '14.2%',
      sugar: '2.5 г/л',
      temperature: '16-18 °C',
      price: 5200.00,
      description: [
        'Насыщенный темный темно-бордовый цвет.',
        'Мощный букет с нотами черной смородины, кожи, эвкалипта и горького шоколада.',
        'Полнотелый благородный вкус с величественной структурой.'
      ],
      image: { url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1000&q=80', file: 'wines/wine_cabernet.jpg', alt: 'Каберне Совиньон Гранд Резерв' }
    }
  ];

  for (const wData of winesData) {
    const savedImgUrl = await downloadImage(wData.image.url, wData.image.file);
    const wine = await Wine.create({
      type_id: wData.type_id,
      sweetness_id: wData.sweetness_id,
      name: wData.name,
      year: wData.year,
      alcohol: wData.alcohol,
      sugar: wData.sugar,
      temperature: wData.temperature,
      price: wData.price,
      is_active: true
    });
    for (let idx = 0; idx < wData.description.length; idx++) {
      await WineDescription.create({
        wine_id: wine.id,
        description_text: wData.description[idx],
        order: idx + 1
      });
    }
    await WineImage.create({
      wine_id: wine.id,
      url: savedImgUrl,
      alt_text: wData.image.alt,
      order: 1
    });
    console.log(`Created Wine: ${wine.name}`);
  }

  console.log('\n--- All Database Seeding Completed Successfully! ---');
}

seed()
  .then(() => {
    sequelize.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding error:', err);
    sequelize.close();
    process.exit(1);
  });
