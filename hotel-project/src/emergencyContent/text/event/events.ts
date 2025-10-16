export interface EventNewsItem {
  header: string;
  description: string;
  imgSrc: string;
}

export interface EventCategory {
  categorie: string;
  news: EventNewsItem[];
}

export const eventsEmergency: EventCategory[] = [
  {
    categorie: "Дегустации",
    news: [
      {
        header: "Дегустация новых вин Каберне",
        description: "Опробуйте наш новый продукт, вдохновлённый Италией и созданный из легендарного сорта Каберне",
        imgSrc: "https://excursion-anapa.ru/wp-content/uploads/2021/06/wine_ex.jpg"
      },
      {
        header: "Выпуск нового сорта Пино Гридж",
        description: "Присоединяйтесь к нам для дегустации нашего нового белого вина Пино Гридж, выдержанного в акрайских пещерах",
        imgSrc: "https://www.biltmore.com/wp-content/uploads/2013/04/Spring-Pinot.jpg"
      },
      {
        header: "Дегустация редких вин",
        description: "Попробуйте редкие и уникальные вина со всего мира на нашей эксклюзивной дегустации",
        imgSrc: "https://forumsamogon.ru/wp-content/uploads/e/d/3/ed3727d3c48cd1e573a948cc7a1a23e8.jpg"
      }
    ]
  },
  {
    categorie: "Ресторан",
    news: [
      {
        header: "Новое меню в ресторане",
        description: "Освежающее меню лета готово! Приходите и наслаждайтесь нашими новыми блюдами",
        imgSrc: "https://www.restoclub.ru/uploads/newsinner_thumbnail_big/8/2/d/c/82dc2a20414d4db8f1a82543b48e1e65.jpg"
      },
      {
        header: "Вечеринка в саду ресторана",
        description: "Присоединяйтесь к нам к закату для вечеринки под звёздами с коктейлями и закусками",
        imgSrc: "https://zvezdnychas.ru/wp-content/uploads/8/b/3/8b3e6902ddb8326316de04bad8102180.jpeg"
      },
      {
        header: "Мастер-класс по приготовлению пасты",
        description: "Участвуйте в нашем мастер-классе по приготовлению пасты и узнайте секреты итальянской кухни",
        imgSrc: "https://avatars.dzeninfra.ru/get-zen_doc/1591494/pub_64d9df8cf5e7796d23179af9_64d9f887f5e7796d23497e61/scale_1200"
      }
    ]
  },
  {
    categorie: "Экскурсии",
    news: [
      {
        header: "Экскурсия по винодельне",
        description: "Узнайте интересные факты о виноделии и виноградарстве во время нашей увлекательной экскурсии по виноградникам",
        imgSrc: "https://zdorovnik.com/wp-content/uploads/2023/11/1579849661_4-p-vina-toskani-7-1920x1280.jpg"
      },
      {
        header: "Экскурсия по подземным пещерам",
        description: "Откройте для себя тайны наших подземных пещер, где созревают наши лучшие вина",
        imgSrc: "https://www.syl.ru/misc/i/ai/377763/2426273.jpg"
      },
      {
        header: "Историческая экскурсия по горам",
        description: "Узнайте больше об истории нашего региона во время экскурсии по старинным улицам города",
        imgSrc: "https://thailand-good.ru/wp-content/uploads/5/b/3/5b39679fd63764538df9cd3adde84a9d.jpeg"
      }
    ]
  },
  {
    categorie: "Сезонные",
    news: [
      {
        header: "Сбор винограда",
        description: "Участвуйте в увлекательном процессе сбора винограда и узнайте, как создаётся наш винный продукт",
        imgSrc: "https://wikiway.com/upload/iblock/dbc/rtveli-_-prazdnik-sbora-vinograda.jpg"
      },
      {
        header: "Рождественский рынок",
        description: "Наслаждайтесь рождественской атмосферой на нашем ежегодном рождественском рынке с украшениями, едой и напитками",
        imgSrc: "https://a-a-ah-ru.s3.amazonaws.com/uploads/items/113847/135617/large_5a01d8830e29c102172234.jpg"
      },
      {
        header: "Пасхальный фестиваль",
        description: "Собравшись с родными и близкими, празднуйте пасхальные праздники с нами на нашем ежегодном фестивале",
        imgSrc: "https://moskva.name/wp-content/uploads/2020/03/45579/festival-171-pashalnyj-dar-187-ezhegodnyj-vesennij-festival-pashalnyj-dar-projdet-v-moskve-s-17-po-8230.jpg"
      }
    ]
  },
  {
    categorie: "Open-air",
    news: [
      {
        header: "Концерт под звёздами",
        description: "Наслаждайтесь звучанием живой музыки на нашем концерте под открытым небом с участием известных музыкантов",
        imgSrc: "https://static.demilked.com/wp-content/uploads/2022/08/business-dirty-secrets-13.jpg"
      },
      {
        header: "Кинопоказ на свежем воздухе",
        description: "Приходите со своими друзьями и близкими на наш кинопоказ под открытым небом и наслаждайтесь лучшими фильмами",
        imgSrc: "https://avatars.mds.yandex.net/i?id=b9389cbfa8d337f9cb5c538c5f9e1ebc_l-9211188-images-thumbs&n=13"
      },
      {
        header: "Вечеринка на пляже",
        description: "Отдохните и насладитесь летним воздухом на нашей вечеринке на пляже с коктейлями и закусками",
        imgSrc: "https://www.oluxuryvillas.com/img/article/image/mykonos_nightlife_oluxuryvillas.jpg"
      }
    ]
  }
];

