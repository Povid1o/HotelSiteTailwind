/**
 * Демо-данные для «Винных Террас»: наполняет страницы Главная / Винодельня / Отель / Ресторан /
 * Мероприятия / Витрина / Контакты ровно так, как показано на макете, а также добавляет
 * новости, мероприятия и вина.
 *
 *   npm run seed:demo
 *
 * Что делает и чего НЕ делает:
 *  - номера и блюда: добавляет, только если их в базе почти нет (меньше 3 номеров / 6 блюд);
 *    уже наполненные данные не трогает (полный набор с фото из интернета — `npm run seed:content`);
 *  - страницы: перезаписывает разделы, описанные ниже, остальные поля страницы сохраняет;
 *  - новости, мероприятия, вина: добавляет по названию — повторный запуск дублей не создаёт;
 *  - картинки — иллюстрации-заглушки из seed/demo-images (копируются в static/…), без интернета.
 *
 * ВСЁ здесь — выдуманный пример: цифры, имена, отзывы, цены и даты замените своими
 * до публикации сайта.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sequelize = require('../db');
const {
  Room, RoomImage, RoomProperty, RoomConvenience, RoomPrice, RoomNote, DishCategory, Dish, DishImage,
  Page, News, EventCategory, Event, EventImage, WineType, WineSweetness, Wine, WineDescription, WineImage
} = require('../models/models');
const seedEvents = require('../seed/seedEvents');
const localProducts = require('../seed/localProducts');
const { sanitizeNewsHtml, textStats } = require('../utils/newsHtml');

const SRC = path.join(__dirname, '..', 'seed', 'demo-images');
const STATIC = path.join(__dirname, '..', 'static');

/** Копирует картинку-заглушку в static/<папка>/ и возвращает адрес для сайта. */
const photo = (name, folder = 'pages') => {
  const file = `demo-${name}.jpg`;
  const target = path.join(STATIC, folder);
  fs.mkdirSync(target, { recursive: true });
  fs.copyFileSync(path.join(SRC, `${name}.jpg`), path.join(target, file));
  return `/static/${folder}/${file}`;
};

/* ---------- даты «ближайших» выходных ---------- */
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const upcoming = (weekday, skip = 0) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  do d.setDate(d.getDate() + 1); while (d.getDay() !== weekday);
  d.setDate(d.getDate() + skip * 7);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
};
const daysAgo = (n, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d;
};

/* ---------- страницы ---------- */
const buildPages = () => ({
  '/': {
    mainBackground: {
      title: 'Время, которое течёт медленнее',
      description: 'Терруарный retreat среди виноградников — проживание, вино, гастрономия и тишина в одном маршруте.',
      image: photo('home_hero')
    },
    aboutSection: {
      kicker: 'Почему остаться',
      title: 'Терраса, вино и время без расписания',
      description: 'Здесь нет программы на каждый час. Есть терраса с видом на виноградники, неспешный завтрак, дегустация без спешки и вечер у моря. Мы соединили отель, винодельню и ресторан в один маршрут — гость выбирает темп сам.'
    },
    firstGallery: { title: 'Почему остаться', images: [{ src: photo('why_1'), alt: 'Террасы утром' }, { src: photo('why_2'), alt: 'Склон с виноградником' }] },
    secondGallery: { title: 'Винодельня', images: [{ src: photo('winery_teaser'), alt: 'Виноградник на закате' }] },
    factsSection: {
      items: [
        { value: '12 га', label: 'собственных виноградников' },
        { value: '4', label: 'сорта, которые мы растим' },
        { value: '5', label: 'категорий номеров и вилл' },
        { value: '40 мин', label: 'от Новороссийска' }
      ]
    },
    roomsSection: { kicker: 'Проживание', title: 'Номера с видом на террасы' },
    daySection: {
      title: 'Как проходит день на Террасах',
      lead: 'Не список услуг, а ритм: так выглядит обычный день гостя.',
      steps: [
        { time: 'Утро', title: 'Завтрак на террасе', text: 'Неспешный завтрак с видом на виноградники: свежая выпечка, сыры и фрукты.' },
        { time: 'День', title: 'Прогулка по террасам', text: 'Пройдите по рядам и узнайте, как растёт лоза и собирается урожай.' },
        { time: 'Вечер', title: 'Дегустация', text: 'Вина нашей винодельни — в своём темпе и без спешки.' },
        { time: 'Ночь', title: 'Ужин в ресторане', text: 'Сезонное меню, где блюда подобраны в пару к вину.' }
      ]
    },
    packagesSection: {
      title: 'Номер и вино — в одном пакете',
      items: [
        { tag: 'Выходные', name: 'Выходные на Террасах', text: 'Две ночи в номере, завтраки на террасе и дегустация вин с виноделом.', price: 'от 38 000 ₽', link: '/Hotel' },
        { tag: 'Сезон', name: 'Сбор урожая', text: 'Выйдите на ряды вместе с виноделами, соберите часть урожая своими руками и разделите общий ужин.', price: 'от 46 000 ₽', link: '/Hotel' },
        { tag: 'Для двоих', name: 'Вечер на двоих', text: 'Ужин в ресторане из пяти блюд и бутылка вина из нашей коллекции в подарок.', price: 'от 12 500 ₽', link: '/Restaurant' }
      ]
    },
    wineryTeaser: {
      kicker: 'Винодельня',
      title: 'Место рассказывает о себе через вино',
      text: 'Виноградники на террасах видят море и получают утренний свет — так формируется характер каждого сорта. Мы показываем не бутылки, а процесс: землю, время и руки.',
      button: 'Узнать о винодельне →',
      image: photo('winery_teaser')
    },
    atmosphereGallery: {
      title: 'Увидеть своими глазами',
      images: [
        { src: photo('gal_1'), alt: 'Рассвет над террасами' }, { src: photo('gal_2'), alt: 'Бочковой погреб' },
        { src: photo('gal_3'), alt: 'Бокалы на дегустации' }, { src: photo('gal_4'), alt: 'Вечер на террасе' },
        { src: photo('gal_5'), alt: 'Гроздь винограда' }, { src: photo('gal_6'), alt: 'Резервуары винодельни' },
        { src: photo('gal_7'), alt: 'Утро у моря' }
      ]
    },
    restaurantTeaser: {
      kicker: 'Ресторан',
      title: 'Сезонное меню террас',
      text: 'Продукты своей земли и виноделия — меню меняется с урожаем.',
      button: 'Смотреть меню →'
    },
    locationSection: {
      title: 'Абрау-Дюрсо',
      text: 'Краснодарский край, Абрау-Дюрсо. Парковка для гостей бесплатная, трансфер от аэропорта и вокзала — по заявке.',
      mapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=37.55%2C44.67%2C37.66%2C44.73&layer=mapnik',
      routes: [
        { from: 'Из Новороссийска', time: '40 минут' },
        { from: 'Из Геленджика', time: '1 час 10 минут' },
        { from: 'Из аэропорта Анапа', time: '1 час 30 минут' },
        { from: 'Из Краснодара', time: '3 часа 30 минут' }
      ]
    },
    reviewsSection: {
      title: 'Что говорят гости',
      items: [
        { text: 'Приехали на выходные, а остались бы на неделю. Завтрак на террасе и дегустация с виноделом — лучшее, что было в этом году.', author: 'Анна К.', date: 'сентябрь 2026' },
        { text: 'Тихо, красиво и очень вкусно. Номер с купелью на террасе стоит отдельной поездки, сервис без суеты.', author: 'Михаил и Елена', date: 'август 2026' },
        { text: 'Ездили всей семьёй во время сбора урожая: дети выходили на ряды вместе с виноделами и до сих пор вспоминают.', author: 'Ольга Т.', date: 'октябрь 2026' }
      ]
    },
    ctaHome: { title: 'Готовы приехать?', text: 'Выберите номер и даты — мы подтвердим бронирование в течение дня.', button: 'Забронировать номер' }
  },

  '/Vinery': {
    mainBackground: {
      title: 'Винодельня',
      description: 'Терруар, время и ручной труд — то, что стоит за каждой бутылкой.',
      image: photo('vinery_hero')
    },
    factsSection: {
      items: [
        { value: '12 га', label: 'виноградников на террасах' },
        { value: '4', label: 'сорта винограда' },
        { value: '2019', label: 'год первого урожая' },
        { value: '100%', label: 'ручной сбор' }
      ]
    },
    introSection: {
      title: 'Террасы над морем',
      description: 'Лозы растут на склонах, которые видят и море, и горы — разница высот даёт разный свет и разную зрелость. Мы собираем урожай вручную, по террасе за раз, и не торопим ферментацию.',
      text2: 'Винодельня небольшая: мы делаем только те вина, которые можем довести до бутылки сами, и охотно показываем каждый этап гостям.',
      image: photo('intro_1'),
      image2: photo('intro_2')
    },
    productionSection: {
      title: 'От лозы до бутылки',
      lead: 'Выберите этап — или листайте стрелками по порядку.',
      stages: [
        { name: 'Сбор винограда', months: 'сентябрь — октябрь', text: 'Ягоду собирают вручную ранним утром, пока она прохладная. Каждую террасу обходят в момент идеальной зрелости.', image: photo('stage_harvest') },
        { name: 'Ферментация', months: 'октябрь — ноябрь', text: 'Сок бродит в стальных резервуарах при контролируемой температуре — так сохраняются аромат и свежесть.', image: photo('stage_ferment') },
        { name: 'Выдержка', months: 'зима — весна', text: 'Часть вин отдыхает в дубовых бочках в прохладном погребе: время мягко собирает вкус.', image: photo('stage_aging') },
        { name: 'Розлив', months: 'весна — лето', text: 'Вино разливают небольшими партиями и дают бутылке «подружиться» с содержимым перед продажей.', image: photo('stage_bottling') }
      ]
    },
    terroirSection: {
      title: 'Почему вино получается именно здесь',
      items: [
        { title: 'Склон', text: 'Террасы ловят каждый луч: ягода созревает медленно и копит вкус.' },
        { title: 'Море', text: 'Виноградники видят море — оно смягчает жару и ночную прохладу.' },
        { title: 'Утренний свет', text: 'Утреннее солнце приходит на ряды первым — от него зависит характер каждого сорта.' }
      ]
    },
    grapesSection: {
      title: 'Сорта, которые мы растим',
      lead: 'Каждый сорт — отдельный характер. Нажмите на сорт, чтобы увидеть вина.',
      items: [
        { name: 'Совиньон блан', type: 'Белое', note: 'Свежий, с нотами цитруса и свежескошенной травы.', area: '3 га' },
        { name: 'Рислинг', type: 'Белое', note: 'Яркая кислотность, цветочный и минеральный оттенки.', area: '2 га' },
        { name: 'Каберне совиньон', type: 'Красное', note: 'Плотный, с чёрной смородиной и мягкими танинами.', area: '4 га' },
        { name: 'Сира', type: 'Розовое', note: 'Пряный, с оттенками чёрного перца и спелых ягод.', area: '3 га' }
      ]
    },
    winemakerSection: {
      quote: 'Мы показываем не бутылки, а процесс: землю, время и руки.',
      name: 'Андрей Соколов',
      role: 'Главный винодел',
      image: photo('winemaker')
    },
    visitSection: {
      title: 'Три способа познакомиться с винодельней',
      formats: [
        {
          name: 'Экскурсия', sub: 'Террасы и подвал',
          text: 'Пройдёте по рядам, увидите бочки и узнаете, как из ягоды получается вино. Группы небольшие — можно задавать любые вопросы.',
          duration: '60 минут', price: '1 200 ₽',
          includes: 'Прогулка по террасам с гидом\nПосещение бочкового подвала\nБокал молодого вина на финише',
          dates: [upcoming(6), upcoming(0), upcoming(6, 1)].join('\n')
        },
        {
          name: 'Дегустация', sub: 'Шесть вин с виноделом',
          text: 'Экскурсия по террасам и дегустация шести вин — по предварительной записи.',
          duration: '90 минут', price: '2 800 ₽',
          includes: 'Шесть вин нашего урожая\nЗакуски к каждому бокалу\nРассказ винодела о каждом вине',
          dates: [upcoming(5), upcoming(6), upcoming(0, 1)].join('\n')
        },
        {
          name: 'Мастер-класс', sub: 'Соберите свой купаж',
          text: 'Смешайте несколько сортов, подберите пропорции и найдите собственный вкус. Свою бутылку забираете с собой.',
          duration: '2 часа', price: '4 500 ₽',
          includes: 'Купаж из нескольких сортов\nБутылка с вашей этикеткой\nЛёгкий ужин из сыров и закусок',
          dates: [upcoming(6), upcoming(6, 1)].join('\n')
        }
      ]
    },
    winesSection: { kicker: 'Ассортимент', title: 'Вина, которыми мы гордимся' },
    eventsSection: { title: 'Дегустации на террасах' },
    ctaVinery: { title: 'Остановитесь у нас на выходные', text: 'Номера с видом на террасы и ужин в ресторане — всё рядом с виноградником.', button: 'Выбрать даты' }
  },

  '/Hotel': { hero: { title: 'Отель', description: 'Номера с видом на террасы и виноградники: тишина, свет и неспешные утра.', image: photo('hotel_hero') } },
  '/Restaurant': { hero: { title: 'Ресторан', description: 'Сезонное меню из продуктов своей земли и виноделия.', image: photo('restaurant_hero') } },
  '/Events': { hero: { title: 'Мероприятия', description: 'Дегустации, ужины и события на террасах.', image: photo('events_hero') } },
  '/Shop': { shopHero: { title: 'Коллекция вин', description: 'Вина нашей винодельни — урожай за урожаем, небольшими партиями.', image: photo('shop_hero') } },
  [localProducts.PAGE_PATH]: localProducts.buildLocalProducts(),
  '/Contacts': {
    contacts: {
      eyebrow: 'Контакты', title: 'Будем рады видеть вас на террасах',
      address: 'Абрау-Дюрсо, Краснодарский край', phone: '+7 (861) 200-00-00', phoneHref: '+78612000000',
      email: 'info@vineterraces.ru', reception: 'Ежедневно, 08:00 — 22:00'
    }
  }
});

async function seedPages() {
  for (const [route, sections] of Object.entries(buildPages())) {
    const page = await Page.findOne({ where: { path: route } });
    if (!page && route === localProducts.PAGE_PATH) {
      await Page.create({ name: localProducts.PAGE_NAME, path: route, is_active: true, content_json: sections });
      console.log(`  страница ${route}: создана (${Object.keys(sections).length} разделов)`);
      continue;
    }
    if (!page) { console.warn(`  ! страница ${route} не найдена — пропускаю (выполните npm run db:bootstrap)`); continue; }
    const current = page.content_json && typeof page.content_json === 'object' ? page.content_json : {};
    // шапки других страниц: сохраняем уже написанные заголовки, меняем только фото
    const merged = { ...current, ...sections };
    await page.update({ content_json: merged });
    console.log(`  страница ${route}: ${Object.keys(sections).join(', ')}`);
  }
}

/* ---------- новости ---------- */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const text = (t) => ({ type: 'text', text: t });
const para = (t) => ({ type: 'paragraph', content: [text(t)] });
/** Блоки новости → [html, Tiptap-документ]. Блок: ['h2', 'текст'] | ['p', ...] | ['ul', [...пункты]] | ['quote', 'текст']. */
const article = (blocks) => {
  const html = []; const content = [];
  blocks.forEach(([kind, value]) => {
    if (kind === 'h2') { html.push(`<h2>${esc(value)}</h2>`); content.push({ type: 'heading', attrs: { level: 2 }, content: [text(value)] }); }
    else if (kind === 'p') { html.push(`<p>${esc(value)}</p>`); content.push(para(value)); }
    else if (kind === 'quote') { html.push(`<blockquote><p>${esc(value)}</p></blockquote>`); content.push({ type: 'blockquote', content: [para(value)] }); }
    else if (kind === 'ul') {
      html.push(`<ul>${value.map((v) => `<li><p>${esc(v)}</p></li>`).join('')}</ul>`);
      content.push({ type: 'bulletList', content: value.map((v) => ({ type: 'listItem', content: [para(v)] })) });
    }
  });
  return { html: html.join(''), json: { type: 'doc', content } };
};

const NEWS = [
  {
    slug: 'sbor-urozhaya-2026', title: 'Сбор урожая 2026: ягода пришла на неделю раньше', category: 'winery', cover: 'news_harvest', ago: 6,
    excerpt: 'Тёплый сентябрь ускорил созревание — виноделы вышли на террасы ещё до рассвета. Рассказываем, каким будет новый урожай.',
    tags: ['урожай', 'винодельня'],
    body: [
      ['p', 'В этом году первые гроздья сорта совиньон блан мы срезали в начале сентября — почти на неделю раньше прошлогоднего срока. Тёплые дни и прохладные ночи дали ягоде именно тот баланс сахара и кислотности, которого ждёт винодел.'],
      ['h2', 'Как проходит сбор'],
      ['ul', ['Начинаем в пять утра, пока ягода прохладная.', 'Каждую террасу обходим вручную, выбирая зрелые грозди.', 'До прессования виноград не лежит дольше нескольких часов.']],
      ['quote', 'Хороший урожай начинается не в погребе, а на склоне — в тот момент, когда ты решаешь, сегодня ли срезать эту гроздь.'],
      ['p', 'Гости отеля могут присоединиться к сбору: ближайшие даты мы публикуем в разделе «Мероприятия».']
    ]
  },
  {
    slug: 'osennee-menyu-restorana', title: 'Осеннее меню: тыква, дичь и вино к каждому блюду', category: 'restaurant', cover: 'news_menu', ago: 12,
    excerpt: 'Шеф обновил меню к сезону: больше продуктов с нашей земли и подбор вина к каждому блюду.',
    tags: ['ресторан', 'меню'],
    body: [
      ['p', 'С октября в ресторане работает осеннее меню. В нём тёплые супы, запечённая тыква, утиная грудка с вишнёвым соусом и десерты с виноградом нового урожая.'],
      ['h2', 'Что нового'],
      ['ul', ['Сет из пяти блюд с подбором вина к каждому.', 'Сыры и закуски от соседних фермеров.', 'Детское меню без сахара и с натуральными соками.']],
      ['p', 'Столик лучше бронировать заранее — особенно на выходные.']
    ]
  },
  {
    slug: 'dzhazovye-vechera-na-terrase', title: 'Джазовые вечера на террасе — снова по пятницам', category: 'events', cover: 'news_jazz', ago: 18,
    excerpt: 'Живая музыка, бокал игристого и закат над виноградниками. Возвращаем пятничные вечера на открытой террасе.',
    tags: ['музыка', 'терраса'],
    body: [
      ['p', 'Пока погода позволяет, по пятницам на террасе играет джазовый квартет. Гостей встречаем бокалом игристого, а когда холодает — раздаём пледы.'],
      ['p', 'Начало в 19:00, вход свободный для гостей отеля и по билетам для остальных.']
    ]
  },
  {
    slug: 'novyj-nomer-s-kupelyu', title: 'В отеле появился номер с купелью на террасе', category: 'hotel', cover: 'news_room', ago: 25,
    excerpt: 'Подогреваемая купель под открытым небом работает круглый год — даже зимой.',
    tags: ['отель', 'номера'],
    body: [
      ['p', 'Мы открыли новую категорию — «Делюкс с купелью на террасе». Это 42 квадратных метра, камин на биотопливе и деревянная купель с видом на долину.'],
      ['h2', 'Что входит'],
      ['ul', ['Подготовка купели с хвоей и аромамаслами.', 'Завтрак на террасе по желанию.', 'Приветственный бокал вина.']],
      ['p', 'Бронируйте на выходные заранее: этих номеров всего три.']
    ]
  },
  {
    slug: 'masterklass-po-kupazhu', title: 'Мастер-класс по купажу: создайте свой вкус', category: 'winery', cover: 'news_blend', ago: 33,
    excerpt: 'Смешайте несколько сортов и заберите домой бутылку со своей этикеткой.',
    tags: ['мастер-класс', 'дегустация'],
    body: [
      ['p', 'На мастер-классе винодел расскажет, чем отличаются сорта, и поможет подобрать пропорции. Вы смешаете свой купаж, дадите ему название и получите бутылку с этикеткой.'],
      ['p', 'Занятие длится около двух часов, группа — до десяти человек. Запись — через форму на странице винодельни.']
    ]
  },
  {
    slug: 'utrennij-zabeg-po-terrasam', title: 'Утренний забег по виноградным террасам', category: 'events', cover: 'news_run', ago: 41,
    excerpt: 'Десять километров на рассвете — и завтрак с вином для самых быстрых и самых терпеливых.',
    tags: ['спорт', 'забег'],
    body: [
      ['p', 'Маршрут проходит по склонам между рядами лозы и выходит к морю. Старт — в 7:00, подходят и новички: рядом всегда есть более короткая дистанция.'],
      ['p', 'После финиша всех ждёт завтрак на террасе.']
    ]
  },
  {
    slug: 'zima-na-terrasah', title: 'Зима на Террасах: камины, глинтвейн и тишина', category: 'hotel', cover: 'news_winter', ago: 50,
    excerpt: 'Зимой здесь спокойнее всего: номера с каминами, согревающие напитки и пустые виноградники.',
    tags: ['зима', 'отдых'],
    body: [
      ['p', 'С ноября мы работаем в зимнем режиме: подогреваемый бассейн, глинтвейн у камина и дегустации в тёплом подвале.'],
      ['p', 'Для гостей на три ночи и дольше — скидка на проживание и подарочная бутылка вина.']
    ]
  },
  {
    slug: 'v-pogrebe-novye-bochki', title: 'В погребе — новые дубовые бочки', category: 'winery', cover: 'news_cellar', ago: 60,
    excerpt: 'Для выдержки красных вин мы закупили бочки из французского дуба.',
    tags: ['погреб', 'выдержка'],
    body: [
      ['p', 'Новая партия бочек уже в подвале. Сначала в них отдохнёт каберне совиньон, а потом — сира: так вино получает мягкость и лёгкие нотки специй.'],
      ['p', 'Посмотреть погреб можно на экскурсии по винодельне.']
    ]
  }
];

async function seedNews() {
  for (const item of NEWS) {
    const { html, json } = article(item.body);
    const clean = sanitizeNewsHtml(html);
    const stats = textStats(clean);
    const fields = {
      title: item.title, category: item.category, excerpt: item.excerpt, tags: item.tags,
      cover_url: photo(item.cover, 'news'), cover_alt: item.title,
      status: 'published', published_at: daysAgo(item.ago), slug_locked: true,
      seo_title: '', seo_description: item.excerpt.slice(0, 300),
      content_json: json, content_html: clean, word_count: stats.wordCount, reading_minutes: stats.readingMinutes
    };
    const existing = await News.findOne({ where: { slug: item.slug } });
    if (existing) await existing.update(fields); else await News.create({ slug: item.slug, ...fields });
  }
  // черновик и запланированная публикация — чтобы в админке были видны все состояния
  const extras = [
    { slug: 'chernovik-zimnee-menyu', title: 'Черновик: зимнее меню ресторана', category: 'restaurant', status: 'draft', published_at: null, cover: 'news_menu', excerpt: 'Заметки к зимнему меню — не опубликовано.' },
    { slug: 'novogodnie-prazdniki-na-terrasah', title: 'Новогодние праздники на Террасах', category: 'events', status: 'published', published_at: new Date(Date.now() + 14 * 864e5), cover: 'news_jazz', excerpt: 'Программа праздничных дней — выйдет в запланированное время.' }
  ];
  for (const e of extras) {
    const { html, json } = article([['p', e.excerpt]]);
    const fields = {
      title: e.title, category: e.category, excerpt: e.excerpt, tags: [], cover_url: photo(e.cover, 'news'), cover_alt: e.title,
      status: e.status, published_at: e.published_at, slug_locked: e.status === 'published',
      content_json: json, content_html: sanitizeNewsHtml(html), word_count: 6, reading_minutes: 1
    };
    const existing = await News.findOne({ where: { slug: e.slug } });
    if (existing) await existing.update(fields); else await News.create({ slug: e.slug, ...fields });
  }
  console.log(`  новости: ${NEWS.length} опубликованных + черновик + запланированная`);
}

/* ---------- мероприятия ---------- */
const EVENTS = [
  ['Дегустации', 'Мастер-класс по купажу', 'Смешайте несколько сортов под руководством винодела, найдите свою пропорцию и заберите бутылку с собственной этикеткой. Группа до десяти человек.', 'ev_blend', 'Купаж на мастер-классе'],
  ['Ресторан', 'Завтрак на виноградниках', 'Утренний пикник между рядами лозы: свежая выпечка, сыры, фрукты и бокал игристого. Корзины и пледы мы приготовим.', 'ev_breakfast', 'Завтрак среди лоз'],
  ['Спорт', 'Утренний забег по террасам (10 км)', 'Дистанция проходит по склонам между рядами лозы и выходит к морю. После финиша — завтрак на террасе для всех участников.', 'ev_run', 'Забег по террасам'],
  ['Спорт', 'Йога на рассвете среди лоз', 'Мягкая практика на открытой площадке над виноградниками. Подходит новичкам, коврики и чай — с нас.', 'ev_yoga', 'Йога на рассвете'],
  ['Дегустации', 'Вечер игристых вин', 'Пять игристых вин, закуски от шефа и рассказ сомелье о том, как рождаются пузырьки. Идеально для двоих.', 'ev_sparkling', 'Вечер игристых вин'],
  ['Сезонные', 'Зимний вечер: глинтвейн у камина', 'Тёплый глинтвейн по авторскому рецепту, камин, настольные игры и тихая музыка — когда за окном холодно.', 'ev_winter', 'Зимний вечер у камина'],
  ['Open-air', 'Кино под открытым небом', 'Вечерний показ на террасе: пледы, попкорн с трюфельной солью и вино по бокалам. Фильм выбираем голосованием гостей.', 'ev_cinema', 'Кино на террасе'],
  ['Акции', 'Подарочный сертификат на выходные', 'Подарите близким два дня на террасах: проживание, завтраки и дегустация. Сертификат действует шесть месяцев.', 'ev_gift', 'Подарочный сертификат']
];

async function seedMoreEvents() {
  await seedEvents(); // гарантируем, что категории существуют
  const categories = await EventCategory.findAll();
  const byHeader = Object.fromEntries(categories.map((c) => [c.header, c.id]));
  let added = 0;
  for (const [category, title, description, image, alt] of EVENTS) {
    if (await Event.findOne({ where: { title } })) continue;
    const event = await Event.create({ category_id: byHeader[category] || categories[0].id, title, description });
    await EventImage.create({ event_id: event.id, url: photo(image, 'events'), alt_text: alt, order: 1 });
    added += 1;
  }
  console.log(`  мероприятия: добавлено ${added}`);
}

/* ---------- вина ---------- */
const WINES = [
  ['белое', 'сухое', 'Совиньон Блан Террас', 2024, '12.5', '3', '8-10', 1650, 'wine_sauvignon', ['Аромат: цитрус, крыжовник, свежескошенная трава', 'Вкус: чистый, с яркой кислотностью', 'Сочетания: морепродукты, козий сыр, салаты']],
  ['белое', 'полусухое', 'Рислинг Утренний свет', 2023, '11.5', '18', '8-10', 1750, 'wine_riesling', ['Аромат: белые цветы, лайм, минеральные ноты', 'Вкус: мягкий, с долгим послевкусием', 'Сочетания: азиатская кухня, рыба, лёгкие десерты']],
  ['белое', 'сухое', 'Шардоне Бочковое', 2023, '13.0', '4', '10-12', 2300, 'wine_chardonnay', ['Аромат: груша, ваниль, лёгкая сливочность', 'Вкус: округлый, с дубовыми нотами', 'Сочетания: птица, жирная рыба, сливочные соусы']],
  ['красное', 'сухое', 'Сира Резерв', 2022, '13.5', '4', '16-18', 2900, 'wine_syrah', ['Аромат: чёрный перец, ежевика, сухие травы', 'Вкус: плотный, с бархатными танинами', 'Сочетания: мясо на гриле, дичь, выдержанные сыры']],
  ['красное', 'сухое', 'Мерло Классик', 2022, '13.0', '5', '16-18', 2100, 'wine_merlot', ['Аромат: слива, вишня, шоколад', 'Вкус: мягкий, округлый', 'Сочетания: утка, паста с мясным соусом, твёрдые сыры']],
  ['розовое', 'сухое', 'Розе Сира Террас', 2024, '12.0', '5', '8-10', 1500, 'wine_rose', ['Аромат: клубника, персик, цветы', 'Вкус: свежий, лёгкий', 'Сочетания: салаты, закуски, летняя кухня']]
];

async function seedMoreWines() {
  const types = Object.fromEntries((await WineType.findAll()).map((t) => [t.name, t.id]));
  const sweets = Object.fromEntries((await WineSweetness.findAll()).map((t) => [t.name, t.id]));
  let added = 0;
  for (const [type, sweet, name, year, alcohol, sugar, temperature, price, image, notes] of WINES) {
    if (await Wine.findOne({ where: { name } })) continue;
    if (!types[type] || !sweets[sweet]) { console.warn(`  ! нет типа «${type}» или сладости «${sweet}» — вино «${name}» пропущено`); continue; }
    const wine = await Wine.create({ type_id: types[type], sweetness_id: sweets[sweet], name, year, alcohol, sugar, temperature, price, is_active: true });
    for (const [index, line] of notes.entries()) await WineDescription.create({ wine_id: wine.id, description_text: line, order: index + 1 });
    await WineImage.create({ wine_id: wine.id, url: photo(image, 'wines'), alt_text: name, order: 1 });
    added += 1;
  }
  console.log(`  вина: добавлено ${added}`);
}


/* ---------- номера и меню: только если их в базе почти нет ---------- */
const ROOMS = [
  ['Люкс «Панорама Террас»', 'Просторный люкс в тёплых тонах с частной панорамной террасой: вид на виноградники и закат, много света и тишины.', ['До 2 гостей', '55 м²', 'Панорамная терраса', 'Вид на виноградники'], ['Кровать King-size', 'Винный шкаф с приветственной бутылкой', 'Кофемашина и чайный сет', 'Ванна у окна', 'Wi-Fi и Smart TV'], [['Будние дни (Пн–Чт)', 24000], ['Выходные (Пт–Вс)', 29000]], ['Завтрак с игристым входит в стоимость', 'Бассейн и спа-зона без ограничений'], 'room_1', 'view_1'],
  ['Делюкс с купелью на террасе', 'Номер с приватной террасой и подогреваемой деревянной купелью под открытым небом — работает круглый год.', ['До 2 гостей', '42 м²', 'Купель на террасе', 'Вид на долину'], ['Кровать King-size', 'Камин на биотопливе', 'Мини-бар с местными продуктами', 'Звукоизоляция'], [['Будние дни (Пн–Чт)', 19500], ['Выходные (Пт–Вс)', 24500]], ['Подготовка купели с хвоей входит в стоимость'], 'room_2', 'view_2'],
  ['Вилла у виноградника', 'Двухуровневая вилла с садом, бассейном и барбекю-зоной — для семьи или компании друзей.', ['До 6 гостей', '140 м²', 'Собственный бассейн', 'Закрытая территория'], ['Три спальни с ванными', 'Кухня-гостиная', 'Барбекю-зона', 'Парковка'], [['Будние дни (Пн–Чт)', 65000], ['Выходные (Пт–Вс)', 78000]], ['Персональный администратор', 'Завтрак можно подать в саду'], 'room_3', 'view_3'],
  ['Семейный апартамент', 'Две спальни и просторная гостиная: удобно с детьми, есть уголок для игр и кухонная зона.', ['До 4 гостей', '68 м²', 'Две спальни', 'Балкон'], ['Детские кроватки по запросу', 'Кухонная зона', 'Игровой уголок', 'Smart TV'], [['Будние дни (Пн–Чт)', 21000], ['Выходные (Пт–Вс)', 26000]], ['Детям до 6 лет проживание бесплатно'], 'room_4', 'view_4'],
  ['Стандарт улучшенный', 'Уютный номер с балконом и видом на сад. Всё необходимое для спокойного отдыха.', ['До 2 гостей', '28 м²', 'Балкон', 'Вид на сад'], ['Двуспальная кровать', 'Чайный набор', 'Сейф', 'Wi-Fi'], [['Будние дни (Пн–Чт)', 12500], ['Выходные (Пт–Вс)', 15500]], ['Завтрак включён'], 'room_5', 'view_5']
];

async function seedRooms() {
  const count = await Room.count();
  if (count >= 3) { console.log(`  номера: уже есть (${count}) — не трогаю`); return; }
  for (const [name, description, props, conveniences, prices, notes, img1, img2] of ROOMS) {
    if (await Room.findOne({ where: { name } })) continue;
    const room = await Room.create({ name, description, check_in_time: '15:00', check_out_time: '12:00', is_active: true });
    await RoomImage.create({ room_id: room.id, url: photo(img1, 'rooms'), alt_text: `${name} — интерьер`, order: 1 });
    await RoomImage.create({ room_id: room.id, url: photo(img2, 'rooms'), alt_text: `${name} — вид`, order: 2 });
    for (const t of props) await RoomProperty.create({ room_id: room.id, property_text: t });
    for (const t of conveniences) await RoomConvenience.create({ room_id: room.id, convenience_text: t });
    for (const [title, price] of prices) await RoomPrice.create({ room_id: room.id, title, price });
    for (const t of notes) await RoomNote.create({ room_id: room.id, note_text: t });
  }
  console.log('  номера: добавлено 5');
}

const DISHES = {
  'Закуски': ['dish_starter', [
    ['Тартар из говядины с трюфельным кремом', 'Фирменное блюдо', 'Мраморная говядина, трюфельный крем, каперсы, чипсы из пармезана.', '180 г', 1250],
    ['Плато фермерских сыров', 'Идеально к вину', 'Ремесленные сыры, вяленое мясо, инжирный конфитюр и орехи.', '320 г', 1850],
    ['Запечённый камамбер с инжиром', 'Горячая закуска', 'Камамбер с розмарином, мёдом и свежим инжиром.', '220 г', 990]]],
  'Горячие блюда': ['dish_main', [
    ['Стейк рибай с печёными овощами', 'Блюдо от шефа', 'Говядина зернового откорма, овощи на углях, соус из красного вина.', '320 г', 2900],
    ['Лосось на гриле со спаржей', 'Рыбное блюдо', 'Дикий лосось, спаржа, лимонный соус с каперсами.', '260 г', 2100],
    ['Утиная грудка с вишнёвым соусом', 'Блюдо из птицы', 'Утка средней прожарки, пюре из сельдерея, вишнёвый демигляс.', '250 г', 1950]]],
  'Десерты': ['dish_dessert', [
    ['Тирамису с винным ликёром', 'Фирменный десерт', 'Классический тирамису с нотой десертного вина.', '150 г', 650],
    ['Шоколадный фондан с джелато', 'Горячий десерт', 'Тёплый фондан с ванильным джелато и ягодами.', '170 г', 720],
    ['Груша в красном вине со специями', 'Лёгкий десерт', 'Груша, томлёная в каберне с корицей и звёздчатым анисом.', '180 г', 590]]],
  'Напитки и бар': ['dish_drink', [
    ['Коктейль «Grapevine Sour»', 'Авторский микс', 'Виноградный сок, лимон, лёгкая горчинка и белок.', '200 мл', 790],
    ['Сангрия на розовом вине', 'Кувшин для компании', 'Розовое вино, ягоды и цитрусы — на 3–4 человека.', '1 л', 1900]]]
};

async function seedDishes() {
  const count = await Dish.count();
  if (count >= 6) { console.log(`  меню: уже есть (${count} блюд) — не трогаю`); return; }
  for (const [categoryName, [image, dishes]] of Object.entries(DISHES)) {
    const [category] = await DishCategory.findOrCreate({ where: { name: categoryName }, defaults: { name: categoryName } });
    for (const [name, header, short, weight, price] of dishes) {
      if (await Dish.findOne({ where: { name } })) continue;
      const dish = await Dish.create({ category_id: category.id, name, header, description_short: short, description_full: `${short} Подаём с хлебом собственной выпечки.`, weight, price, nutrients: null, is_active: true });
      await DishImage.create({ dish_id: dish.id, url: photo(image, 'dishes'), alt_text: name, order: 1 });
    }
  }
  console.log('  меню: добавлено 11 блюд');
}

async function main() {
  await sequelize.authenticate();
  console.log('Заполняю базу демо-данными…');
  await seedPages();
  await seedNews();
  await seedMoreEvents();
  await seedMoreWines();
  await seedRooms();
  await seedDishes();
  console.log('Готово. Все тексты, цифры, имена, отзывы и цены — выдуманные примеры: замените своими.');
}

main()
  .then(() => sequelize.close())
  .catch(async (error) => { console.error('Ошибка:', error.message); await sequelize.close().catch(() => undefined); process.exit(1); });
