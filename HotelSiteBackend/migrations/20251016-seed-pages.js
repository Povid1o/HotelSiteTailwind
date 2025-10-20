'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    // Seed wine types if empty
    const wineTypes = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM wine_types',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (wineTypes[0].count === 0) {
      await queryInterface.bulkInsert('wine_types', [
        { id: 1, name: 'Красное', created_at: now, updated_at: now },
        { id: 2, name: 'Белое', created_at: now, updated_at: now },
        { id: 3, name: 'Розовое', created_at: now, updated_at: now },
        { id: 4, name: 'Игристое', created_at: now, updated_at: now },
      ]);
    }
    
    // Seed wine sweetness if empty
    const wineSweetness = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM wine_sweetness',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (wineSweetness[0].count === 0) {
      await queryInterface.bulkInsert('wine_sweetness', [
        { id: 1, name: 'Сухое', created_at: now, updated_at: now },
        { id: 2, name: 'Полусухое', created_at: now, updated_at: now },
        { id: 3, name: 'Полусладкое', created_at: now, updated_at: now },
        { id: 4, name: 'Сладкое', created_at: now, updated_at: now },
      ]);
    }

    // Image and video paths (относительно static директории)
    const backgroundImage = '/static/pages/Wine_Background2_AI.png';
    const threeBottles = '/static/pages/ThreeBottles.png';
    const grape = '/static/pages/Grape.png';
    const vineryBackground = '/static/pages/VineryBackground.png';
    const bottleProduce = '/static/pages/BottleProduce.png';
    const wineBarrel = '/static/pages/WineBarrel.png';
    const wineReservour = '/static/pages/WineReservour.png';
    const grapePlant = '/static/pages/GrapePlant.png';
    
    // Gallery images from static folder
    const galleryImages = [
      { src: '/static/pages/gallery/StandartPlus1.jpeg', alt: 'Номер 1' },
      { src: '/static/pages/gallery/StandartPlus2.jpeg', alt: 'Номер 2' },
      { src: '/static/pages/gallery/StandartPlus3.jpeg', alt: 'Номер 3' }
    ];
    
    const hotelVideo = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const hotelPlaceholder = '/static/pages/hotel-main.png';

    // Page 1: Главная
    const mainPageContent = {
      mainBackground: {
        image: backgroundImage,
        title: "Добро пожаловать на Винные Терассы"
      },
      aboutSection: {
        title: "Кто мы?",
        description: 'Отель-винодельня "Винные Террассы" - это уникальное место, сочетающее в себе шарм и гостеприимство с изысканными винами, произведенным нашими виноделами по собственному рецепту. Мы предлагаем гостям возможность насладиться роскошью и комфортом, а также окунуться в удивительный мир виноделия, попробовать уникальные сорта вин и узнать историю их создания.'
      },
      firstGallery: {
        title: "Номерной Фонд",
        images: [...galleryImages]
      },
      secondGallery: {
        title: "Отель расположен в самой живописной локации Абрау",
        images: [...galleryImages]
      },
      videoSection: {
        title: "Посмотрите видео-презентацию",
        videoUrl: hotelVideo
      },
      servicesSection: {
        title: "Ваш отдых - наша ответственность",
        services: [
          {
            name: "Трансфер",
            image: hotelPlaceholder
          },
          {
            name: "Изысканная кухня", 
            image: hotelPlaceholder
          },
          {
            name: "Современный дизайн",
            image: hotelPlaceholder
          },
          {
            name: "Сервис",
            image: hotelPlaceholder
          },
          {
            name: "Качественное вино",
            image: hotelPlaceholder
          }
        ]
      }
    };

    // Page 2: Винодельня
    const vineryPageContent = {
      mainBackground: {
        image: vineryBackground,
        title: "Винодельня"
      },
      introSection: {
        title: "Винодельня",
        description: "Откройте для себя мир превосходных вин в нашей винодельне! Мы предлагаем уникальные и высококачественные сорта вин, созданные с любовью и вниманием к каждой детали. Посетите нашу винодельню и убедитесь в качестве наших вин самостоятельно. Здесь вы сможете насладиться изысканными напитками, отдохнуть и провести время в уютной атмосфере.",
        image: threeBottles,
        buttonText: "Ассортимент вин",
        buttonLink: "/Shop"
      },
      historySection: {
        title: "НАША ИСТОРИЯ",
        leftDates: [
          { year: '1960', description: 'Основание винодельни' },
          { year: '1966', description: 'Первый урожай' },
          { year: '1970', description: 'Выпуск первого вина' }
        ],
        rightDates: [
          { year: '1980', description: 'Расширение производства' },
          { year: '1999', description: 'Международное признание' },
          { year: '2000', description: 'Модернизация производства' }
        ]
      },
      wineSection: {
        firstText: "У нас вы сможете попробовать как классические, так и эксклюзивные вина, созданные по уникальным рецептурам. Наши опытные сомелье помогут вам выбрать вино, которое идеально подойдёт именно для вашего случая.",
        secondText: "Наш каталог включает более 100 наименований вин, среди которых вы обязательно найдете напиток по своему вкусу. Мы гордимся тем, что наши вина получают высокие оценки от экспертов и ценителей со всего мира.",
        buttonText: "Наша винотека",
        buttonLink: "/Shop"
      },
      productionSection: {
        title: "ЭТАПЫ НАШЕГО ПРОИЗВОДСТВА",
        stages: [
          { name: "Сбор винограда", image: grape },
          { name: "Дробление Прессование", image: bottleProduce },
          { name: "Ферментация", image: wineBarrel },
          { name: "Выдержка", image: wineBarrel },
          { name: "Фильтрация", image: wineBarrel },
          { name: "Розлив Созревание", image: wineReservour }
        ]
      },
      regionSection: {
        title: "ВИННЫЙ РЕГИОН",
        firstText: "Краснодарский край — главный винодельческий регион России с разнообразными сортами винограда и высококачественными винами. Здесь выращивают Каберне Совиньон, Мерло, Шардоне и Ркацители.",
        secondText: "Регион сочетает культуру, красоту природы и винодельческое искусство.",
        backgroundImage: grapePlant
      }
    };

    // Insert or update pages
    const existingMain = await queryInterface.sequelize.query(
      'SELECT id FROM pages WHERE path = ?',
      { replacements: ['/'], type: Sequelize.QueryTypes.SELECT }
    );

    if (existingMain.length === 0) {
      await queryInterface.bulkInsert('pages', [{
        name: 'Главная',
        path: '/',
        is_active: true,
        content_json: JSON.stringify(mainPageContent),
        created_at: now,
        updated_at: now
      }]);
    } else {
      await queryInterface.sequelize.query(
        'UPDATE pages SET content_json = ?, updated_at = ? WHERE path = ?',
        { replacements: [JSON.stringify(mainPageContent), now, '/'] }
      );
    }

    const existingVinery = await queryInterface.sequelize.query(
      'SELECT id FROM pages WHERE path = ?',
      { replacements: ['/Vinery'], type: Sequelize.QueryTypes.SELECT }
    );

    if (existingVinery.length === 0) {
      await queryInterface.bulkInsert('pages', [{
        name: 'Винодельня',
        path: '/Vinery',
        is_active: true,
        content_json: JSON.stringify(vineryPageContent),
        created_at: now,
        updated_at: now
      }]);
    } else {
      await queryInterface.sequelize.query(
        'UPDATE pages SET content_json = ?, updated_at = ? WHERE path = ?',
        { replacements: [JSON.stringify(vineryPageContent), now, '/Vinery'] }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove seeded pages
    await queryInterface.bulkDelete('pages', {
      path: ['/', '/Vinery']
    });
  }
};

