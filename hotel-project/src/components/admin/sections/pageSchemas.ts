/** Какие разделы содержимого редактируются на какой странице и из каких полей они состоят. */
export type FieldType = 'text' | 'area' | 'image' | 'select';

export interface Field {
  key: string;
  label: string;
  type?: FieldType;
  rows?: number;
  options?: string[];
  hint?: string;
  placeholder?: string;
}

export interface ListSpec {
  key: string;
  /** Название одного пункта: «Этап», «Сорт»… */
  item: string;
  /** Поле, по которому подписываем пункт в списке. */
  titleKey: string;
  fields: Field[];
  add: string;
  max?: number;
}

export type Kind = 'hero' | 'about' | 'gallery' | 'contacts' | 'privacy' | 'form';

export interface Block {
  kind: Kind;
  section: string;
  title: string;
  note?: string;
  head?: Field[];
  list?: ListSpec;
  /** Показывать переключатель «Показывать блок на сайте». */
  toggle?: boolean;
}

const hero = (section: string, title = 'Шапка страницы'): Block => ({ kind: 'hero', section, title, note: 'Фото, заголовок и подпись в верхней части страницы.' });
const SHAPES_FOR_SCHEMA = ['Банка', 'Бутылка', 'Жестяная баночка'];
const COLORS_FOR_SCHEMA = ['Терракота', 'Песочный', 'Коричневый', 'Шалфей', 'Хвоя'];
const PHOTO_HINT = 'Лучше горизонтальное фото, JPG, PNG или WebP до 10 МБ.';

const facts = (where: string): Block => ({
  kind: 'form', section: 'factsSection', title: 'Цифры',
  note: `Полоса с 2–4 цифрами ${where}. Цифры можете знать только вы, поэтому пока блока нет — он появится, когда заполнено хотя бы два пункта.`,
  list: {
    key: 'items', item: 'Цифра', titleKey: 'value', add: '+ Добавить цифру', max: 4,
    fields: [
      { key: 'value', label: 'Число или слово', placeholder: 'Например, 12' },
      { key: 'label', label: 'Подпись', placeholder: 'Например, гектаров виноградников' },
    ],
  },
});

const cta = (section: string, defTitle: string): Block => ({
  kind: 'form', section, title: 'Плашка в конце страницы', toggle: true,
  note: 'Тёмная полоса с кнопкой внизу страницы.',
  head: [
    { key: 'title', label: 'Заголовок', placeholder: defTitle },
    { key: 'text', label: 'Текст', type: 'area', rows: 2 },
    { key: 'button', label: 'Надпись на кнопке' },
  ],
});

export const SCHEMAS: Record<string, Block[]> = {
  'Главная': [
    hero('mainBackground', 'Фон главной'),
    {
      kind: 'form', section: 'aboutSection', title: 'Почему остаться', toggle: true,
      note: 'Текст слева; два фото справа берутся из блока «Фото для „Почему остаться“» ниже.',
      head: [
        { key: 'kicker', label: 'Надзаголовок' },
        { key: 'title', label: 'Заголовок' },
        { key: 'description', label: 'Текст', type: 'area', rows: 4 },
      ],
    },
    { kind: 'gallery', section: 'firstGallery', title: 'Фото для «Почему остаться»', note: 'Показываются первые два фото.' },
    facts('под блоком «Почему остаться»'),
    {
      kind: 'form', section: 'roomsSection', title: 'Заголовок над номерами', toggle: true,
      note: 'Сами номера редактируются в разделе «Отель».',
      head: [{ key: 'kicker', label: 'Надзаголовок' }, { key: 'title', label: 'Заголовок' }],
    },
    {
      kind: 'form', section: 'daySection', title: 'Один день на Террасах', toggle: true,
      note: 'Пока вы ничего не меняли, на сайте показаны четыре примера: завтрак, прогулка, дегустация, ужин. Замените их своими.',
      head: [
        { key: 'title', label: 'Заголовок' },
        { key: 'lead', label: 'Подпись' },
      ],
      list: {
        key: 'steps', item: 'Шаг', titleKey: 'title', add: '+ Добавить шаг', max: 6,
        fields: [
          { key: 'time', label: 'Время суток', placeholder: 'Утро' },
          { key: 'title', label: 'Название', placeholder: 'Завтрак на террасе' },
          { key: 'text', label: 'Описание', type: 'area', rows: 2 },
        ],
      },
    },
    {
      kind: 'form', section: 'packagesSection', title: 'Предложения «номер + вино»', toggle: true,
      note: 'Три примера без цен — замените названия, условия и добавьте цену, когда будете готовы её показать.',
      head: [{ key: 'title', label: 'Заголовок' }],
      list: {
        key: 'items', item: 'Пакет', titleKey: 'name', add: '+ Добавить пакет', max: 6,
        fields: [
          { key: 'tag', label: 'Метка', placeholder: 'Выходные' },
          { key: 'name', label: 'Название' },
          { key: 'text', label: 'Что входит', type: 'area', rows: 3 },
          { key: 'price', label: 'Цена (необязательно)', placeholder: 'от 30 000 ₽' },
          { key: 'link', label: 'Ссылка кнопки', placeholder: '/Hotel', hint: 'Адрес страницы сайта или полная ссылка.' },
        ],
      },
    },
    {
      kind: 'form', section: 'wineryTeaser', title: 'Винодельня: «Место рассказывает о себе через вино»', toggle: true,
      note: 'Крупный блок с фото. Кнопка ведёт на страницу «Винодельня».',
      head: [
        { key: 'kicker', label: 'Надзаголовок' },
        { key: 'title', label: 'Заголовок' },
        { key: 'text', label: 'Текст', type: 'area', rows: 4 },
        { key: 'button', label: 'Надпись на кнопке' },
        { key: 'image', label: 'Фото', type: 'image', hint: `${PHOTO_HINT} Если не загрузить, возьмётся первое фото из блока «Запасное фото» ниже.` },
      ],
    },
    { kind: 'gallery', section: 'secondGallery', title: 'Запасное фото для блока винодельни', note: 'Используется только если в блоке выше нет своего фото.' },
    {
      kind: 'gallery', section: 'atmosphereGallery', title: 'Галерея «Увидеть своими глазами»', toggle: true,
      note: 'Загрузите от 3 до 7 фото. Пока своих фото меньше трёх, на сайте показаны снимки сайта (виноградник, бочки, резервуары и фото из блоков выше).',
    },
    {
      kind: 'form', section: 'restaurantTeaser', title: 'Карточка ресторана', toggle: true,
      note: 'Фото берётся из первого блюда меню.',
      head: [
        { key: 'kicker', label: 'Надзаголовок' },
        { key: 'title', label: 'Заголовок' },
        { key: 'text', label: 'Текст', type: 'area', rows: 2 },
        { key: 'button', label: 'Надпись ссылки' },
      ],
    },
    {
      kind: 'form', section: 'locationSection', title: 'Как добраться', toggle: true,
      note: 'Адрес берётся со страницы «Контакты», если не написан здесь.',
      head: [
        { key: 'title', label: 'Заголовок', placeholder: 'Абрау-Дюрсо' },
        { key: 'text', label: 'Текст под заголовком', type: 'area', rows: 2 },
        { key: 'mapUrl', label: 'Ссылка на карту', hint: 'Яндекс.Карты → «Поделиться» → «Вставить на сайт» → скопируйте адрес из src="…". Подходят адреса yandex.ru/map-widget, Google Maps embed и OpenStreetMap embed.' },
      ],
      list: {
        key: 'routes', item: 'Маршрут', titleKey: 'from', add: '+ Добавить маршрут', max: 6,
        fields: [
          { key: 'from', label: 'Откуда', placeholder: 'Из Новороссийска' },
          { key: 'time', label: 'Сколько ехать', placeholder: '40 минут' },
        ],
      },
    },
    {
      kind: 'form', section: 'reviewsSection', title: 'Отзывы гостей',
      note: 'Только настоящие отзывы, с разрешения автора. Блок появится, когда добавлен хотя бы один — выдумывать отзывы мы не стали.',
      head: [{ key: 'title', label: 'Заголовок', placeholder: 'Что говорят гости' }],
      list: {
        key: 'items', item: 'Отзыв', titleKey: 'author', add: '+ Добавить отзыв', max: 3,
        fields: [
          { key: 'text', label: 'Текст отзыва', type: 'area', rows: 3 },
          { key: 'author', label: 'Имя' },
          { key: 'date', label: 'Когда', placeholder: 'октябрь 2026' },
        ],
      },
    },
    cta('ctaHome', 'Готовы приехать?'),
  ],
  'Местные продукты': [
    {
      kind: 'form', section: 'productsHero', title: 'Верх страницы «Местные продукты»',
      note: 'Вступление и две кнопки. Первая ведёт в ассортимент, вторая — к блоку «Где купить». Пока нет фото, рисуется картинка с банкой и бутылками.',
      head: [
        { key: 'kicker', label: 'Надзаголовок' },
        { key: 'title', label: 'Заголовок' },
        { key: 'text', label: 'Вступление', type: 'area', rows: 3 },
        { key: 'primary', label: 'Первая кнопка', placeholder: 'Смотреть ассортимент' },
        { key: 'secondary', label: 'Вторая кнопка', placeholder: 'Где купить', hint: 'Оставьте пустой, чтобы убрать кнопку.' },
        { key: 'image', label: 'Фото (необязательно)', type: 'image', hint: `Квадратное фото. ${PHOTO_HINT}` },
      ],
    },
    {
      kind: 'form', section: 'tocSection', title: 'Содержание',
      note: 'Заголовок над списком разделов. Сам список собирается из разделов ассортимента ниже: каждый раздел — строка со ссылкой на его полку.',
      head: [
        { key: 'title', label: 'Заголовок' },
        { key: 'lead', label: 'Подпись', type: 'area', rows: 2 },
        { key: 'all', label: 'Надпись на кнопке под списком', placeholder: 'Весь ассортимент на одной странице →' },
      ],
    },
    ...[1, 2, 3, 4].map((n): Block => ({
      kind: 'form', section: `productsCategory${n}`, title: `Раздел ассортимента ${n}`, toggle: true,
      note: n === 4
        ? 'Свободный раздел: чтобы он появился на сайте, впишите название и добавьте хотя бы один товар.'
        : 'Раздел показывается на сайте, если у него есть название и хотя бы один товар. Порядок разделов — по номерам.',
      head: [
        { key: 'name', label: 'Название раздела', placeholder: 'Паштеты' },
        { key: 'toc', label: 'Коротко для содержания', type: 'area', rows: 2, hint: 'Одна-две фразы под названием в списке на странице «Местные продукты».' },
        { key: 'lead', label: 'Подпись над товарами', type: 'area', rows: 2, hint: 'Показывается над карточками на странице ассортимента.' },
      ],
      list: {
        key: 'products', item: 'Товар', titleKey: 'name', add: '+ Добавить товар', max: 12,
        fields: [
          { key: 'name', label: 'Название' },
          { key: 'tag', label: 'Метка на карточке', placeholder: 'Хит', hint: 'Короткое слово: «Новинка», «Набор», «Сезон».' },
          { key: 'text', label: 'Описание', type: 'area', rows: 2 },
          { key: 'size', label: 'Вес или объём', placeholder: '180 г' },
          { key: 'price', label: 'Цена (необязательно)', placeholder: '320 ₽' },
          { key: 'shape', label: 'Рисунок без фото', type: 'select', options: SHAPES_FOR_SCHEMA, hint: 'Если фото не загружено, на карточке рисуется банка, бутылка или жестянка.' },
          { key: 'color', label: 'Цвет рисунка', type: 'select', options: COLORS_FOR_SCHEMA },
          { key: 'image', label: 'Фото товара (необязательно)', type: 'image', hint: `Квадратное фото на нейтральном фоне. ${PHOTO_HINT}` },
        ],
      },
    })),
    {
      kind: 'form', section: 'productionSection', title: 'О производстве', toggle: true,
      note: 'Тёмный блок с рассказом о том, как делаются продукты. Пока нет фото, рисуются полки с банками.',
      head: [
        { key: 'kicker', label: 'Надзаголовок' },
        { key: 'title', label: 'Заголовок' },
        { key: 'text', label: 'Текст', type: 'area', rows: 4 },
        { key: 'image', label: 'Фото (необязательно)', type: 'image', hint: `Квадратное фото. ${PHOTO_HINT}` },
      ],
      list: {
        key: 'points', item: 'Пункт', titleKey: 'text', add: '+ Добавить пункт', max: 5,
        fields: [{ key: 'text', label: 'Короткая фраза с галочкой' }],
      },
    },
    {
      kind: 'form', section: 'whereSection', title: 'Где купить', toggle: true,
      note: 'Карточки «В отеле», «В ресторане» и т. п. Блок появится, когда добавлена хотя бы одна карточка — как у вас устроена продажа, знаете только вы.',
      head: [
        { key: 'title', label: 'Заголовок' },
        { key: 'lead', label: 'Подпись', type: 'area', rows: 2 },
      ],
      list: {
        key: 'items', item: 'Место', titleKey: 'name', add: '+ Добавить место', max: 6,
        fields: [
          { key: 'name', label: 'Название', placeholder: 'В отеле' },
          { key: 'icon', label: 'Значок', type: 'select', options: ['Отель', 'Ресторан', 'Винодельня', 'Магазин'] },
          { key: 'text', label: 'Описание', type: 'area', rows: 2 },
        ],
      },
    },
    cta('ctaProducts', 'Подберите к вину то, что к нему просится'),
    {
      kind: 'form', section: 'catalogSection', title: 'Страница «Ассортимент»: заголовок',
      note: 'Заголовок и подпись в верхней части страницы ассортимента (адрес — /LocalProducts/Catalog).',
      head: [
        { key: 'title', label: 'Заголовок', placeholder: 'Ассортимент' },
        { key: 'lead', label: 'Подпись', type: 'area', rows: 2 },
      ],
    },
    {
      kind: 'form', section: 'pickupSection', title: 'Страница «Ассортимент»: как забрать', toggle: true,
      note: 'Тёмная плашка внизу страницы ассортимента. Появляется, если заполнены заголовок и текст или первая кнопка.',
      head: [
        { key: 'title', label: 'Заголовок' },
        { key: 'text', label: 'Текст', type: 'area', rows: 3 },
        { key: 'button', label: 'Первая кнопка', placeholder: 'Позвонить на ресепшен' },
        { key: 'buttonLink', label: 'Ссылка первой кнопки', placeholder: 'tel:+78612000000', hint: 'Телефон — tel:+7…, почта — mailto:…, страница сайта — /Contacts.' },
        { key: 'button2', label: 'Вторая кнопка', placeholder: 'Как добраться' },
        { key: 'button2Link', label: 'Ссылка второй кнопки', placeholder: '#site-map' },
      ],
    },
  ],
  'Винодельня': [
    hero('mainBackground'),
    facts('под шапкой страницы'),
    {
      kind: 'form', section: 'introSection', title: 'Знакомство с территорией',
      note: 'Заголовок, текст и одно-два фото рядом с ним.',
      head: [
        { key: 'title', label: 'Заголовок', placeholder: 'Террасы над морем' },
        { key: 'description', label: 'Первый абзац', type: 'area', rows: 4 },
        { key: 'text2', label: 'Второй абзац (необязательно)', type: 'area', rows: 3 },
        { key: 'image', label: 'Главное фото', type: 'image', hint: PHOTO_HINT },
        { key: 'image2', label: 'Второе фото (необязательно)', type: 'image', hint: 'Появится рядом с главным.' },
      ],
    },
    {
      kind: 'form', section: 'productionSection', title: 'От лозы до бутылки',
      note: 'Этапы показываются по порядку. Порядок меняется стрелками.',
      head: [
        { key: 'title', label: 'Заголовок', placeholder: 'От лозы до бутылки' },
        { key: 'lead', label: 'Подпись под заголовком', placeholder: 'Выберите этап — или листайте стрелками по порядку.' },
      ],
      list: {
        key: 'stages', item: 'Этап', titleKey: 'name', add: '+ Добавить этап', max: 10,
        fields: [
          { key: 'name', label: 'Название' },
          { key: 'months', label: 'Когда', placeholder: 'сентябрь — октябрь' },
          { key: 'text', label: 'Описание этапа', type: 'area', rows: 3 },
          { key: 'image', label: 'Фото этапа', type: 'image', hint: 'Горизонтальное фото 16:10, JPG, PNG или WebP до 10 МБ.' },
        ],
      },
    },
    {
      kind: 'form', section: 'terroirSection', title: 'Почему вино получается здесь', toggle: true,
      note: 'Три карточки «Склон», «Море», «Утренний свет» — примеры, замените их своими.',
      head: [{ key: 'title', label: 'Заголовок' }],
      list: {
        key: 'items', item: 'Пункт', titleKey: 'title', add: '+ Добавить пункт', max: 4,
        fields: [
          { key: 'title', label: 'Название', placeholder: 'Склон' },
          { key: 'text', label: 'Описание', type: 'area', rows: 2 },
        ],
      },
    },
    {
      kind: 'form', section: 'grapesSection', title: 'Сорта, которые мы растим', toggle: true,
      note: 'Четыре сорта — пример. Оставьте те, что у вас действительно растут, и поправьте описания.',
      head: [
        { key: 'title', label: 'Заголовок' },
        { key: 'lead', label: 'Подпись' },
      ],
      list: {
        key: 'items', item: 'Сорт', titleKey: 'name', add: '+ Добавить сорт', max: 8,
        fields: [
          { key: 'name', label: 'Название сорта' },
          { key: 'type', label: 'Какое вино', type: 'select', options: ['Белое', 'Красное', 'Розовое', 'Игристое'] },
          { key: 'note', label: 'Характер', type: 'area', rows: 2 },
          { key: 'area', label: 'Площадь (необязательно)', placeholder: '12 га' },
        ],
      },
    },
    {
      kind: 'form', section: 'winemakerSection', title: 'Вставка с виноделом', toggle: true,
      note: 'Цитата и портрет. Пока фото нет, показан декоративный снимок бочек. Цитата — пример, напишите свою и укажите имя.',
      head: [
        { key: 'quote', label: 'Цитата', type: 'area', rows: 3 },
        { key: 'name', label: 'Имя и фамилия' },
        { key: 'role', label: 'Должность', placeholder: 'Главный винодел' },
        { key: 'image', label: 'Портрет', type: 'image', hint: 'Вертикальное фото 4:5, JPG, PNG или WebP до 10 МБ.' },
      ],
    },
    {
      kind: 'form', section: 'visitSection', title: 'Три способа познакомиться с винодельней', toggle: true,
      note: 'Экскурсия, дегустация и мастер-класс — примеры без цен, длительности и дат: впишите их сами. Каждый формат — отдельная вкладка на сайте.',
      head: [{ key: 'title', label: 'Заголовок' }],
      list: {
        key: 'formats', item: 'Формат', titleKey: 'name', add: '+ Добавить формат', max: 4,
        fields: [
          { key: 'name', label: 'Название', placeholder: 'Дегустация' },
          { key: 'sub', label: 'Короткая подпись', placeholder: 'Шесть вин с виноделом' },
          { key: 'text', label: 'Описание', type: 'area', rows: 3 },
          { key: 'duration', label: 'Длительность', placeholder: '90 минут' },
          { key: 'price', label: 'Стоимость', placeholder: 'от 2 500 ₽' },
          { key: 'includes', label: 'Что входит', type: 'area', rows: 3, hint: 'Каждый пункт с новой строки.' },
          { key: 'dates', label: 'Ближайшие даты', type: 'area', rows: 3, hint: 'Каждая дата с новой строки, например: «Сб, 7 ноября».' },
        ],
      },
    },
    {
      kind: 'form', section: 'winesSection', title: 'Заголовок над винами', toggle: true,
      note: 'Сами вина редактируются в разделе «Витрина вина».',
      head: [{ key: 'kicker', label: 'Надзаголовок' }, { key: 'title', label: 'Заголовок' }],
    },
    {
      kind: 'form', section: 'eventsSection', title: 'Заголовок над дегустациями', toggle: true,
      note: 'Показывается, если в «Мероприятиях» есть события.',
      head: [{ key: 'title', label: 'Заголовок' }],
    },
    cta('ctaVinery', 'Остановитесь у нас на выходные'),
  ],
  'Витрина вина': [hero('shopHero')],
  'Отель': [hero('hero')],
  'Ресторан': [hero('hero')],
  'Страница ресторана': [hero('hero')],
  'Мероприятия': [hero('hero')],
  'Страница мероприятий': [hero('hero')],
  'Контакты': [{ kind: 'contacts', section: 'contacts', title: 'Контактная информация' }],
  'Политика конфиденциальности': [{ kind: 'privacy', section: 'privacy', title: 'Текст политики' }],
};
