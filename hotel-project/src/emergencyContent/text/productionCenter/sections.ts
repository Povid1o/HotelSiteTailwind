export interface ProductionSectionsEmergency {
  headerTitle: string;
  headerSubtitle: string;
  slogan: string;
  aboutTitle: string;
  about1Title: string;
  about1Desc: string;
  about2Title: string;
  about2Desc: string;
  videosTitle1: string;
  videosTitle2: string;
  productsTitle: string;
  whereToBuyTitle: string;
  addresses: string[];
  extraServicesTitle: string;
}

export const productionSectionsEmergency: ProductionSectionsEmergency = {
  headerTitle: 'Центр производства локальных продуктов',
  headerSubtitle: 'БОЛЬШИЕ ХУТОРА',
  slogan: 'Мы пишем красивые слоганы',
  aboutTitle: 'О ПРОЕКТЕ',
  about1Title: 'О ЧЕМ ЦЕНТР ПРОИЗВОДСТВА',
  about1Desc: 'Не очень много текста. Может 2-3 предложения. С этим размером шрифта всё понятнее',
  about2Title: 'НАША ФИЛОСОФИЯ',
  about2Desc: 'Не очень много текста. Может 2-3 предложения. С этим размером шрифта всё понятнее',
  videosTitle1: 'Название видео',
  videosTitle2: 'Название видео',
  productsTitle: 'Продукты',
  whereToBuyTitle: 'где купить',
  addresses: [
    'Основной магазин на территории винодельни: Адрес',
    'Партнерские точки продаж: Адрес',
    'Возможность заказа/доставки: Адрес',
    'Контактная информация для оптовых покупателей: Адрес',
  ],
  extraServicesTitle: 'дополнительные услуги',
};
