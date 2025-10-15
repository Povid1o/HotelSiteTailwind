export interface WineEmergency {
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

export const winesEmergency: WineEmergency[] = [
  {
    id: 1,
    name: 'Вино игристое Sempre Prosecco Brut белое брют',
    image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1027925-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxNTE2N3xpbWFnZS9hdmlmfGltYWdlcy9oNTEvaDY3LzEwOTM3ODA4MzU1MzU4LmF2aWZ8MzQ0ZTE5NzNhNDM1ODgzNGYxNDkzMDg5NWQwNWYzODUzYjc2NzY3M2RlZTVmNTNjNWUxNzJkNDlmYzBlMjMwZg',
    type: 'Белое', year: 1985, sweetness: 'Полусладкое', alcohol: '11.5-12.5', sugar: '35-45', temperature: '6-8', price: 3200,
    description: [
      'Виноград: Шардоне, Пино Блан',
      'Цвет: Светло-соломенный с золотистыми бликами',
      'Аромат: Ноты зеленого яблока, груши и свежей выпечки',
      'Вкус: Элегантная игристость с медовыми нюансами',
      'Сочетания: Устрицы, легкие десерты, фруктовые тарталетки',
    ],
  },
  {
    id: 2,
    name: 'Вино Ведерниковъ Губернаторское Красностоп Золотовский красное сухое',
    image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1020457-3-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxNzY2MHxpbWFnZS9hdmlmfGltYWdlcy9oZDgvaDAyLzExNjMxNjU2MzM3NDM4LmF2aWZ8MTMzNmViYTUzMDY2ODlhYTZhNjliYTM5ODUyMjM4NmVkNWU5ZTVkNjczOGUyOGUzODA1ZDc3ZTc1ZjBiZTllYw',
    type: 'Красное', year: 1980, sweetness: 'Полусладкое', alcohol: '13-14', sugar: '25-35', temperature: '16-18', price: 8700,
    description: [
      'Виноград: Красностоп',
      'Цвет: Глубокий гранатовый с кирпичными отблесками',
      'Аромат: Выдержанные тона чернослива, кожи и специй',
      'Вкус: Мягкие танины и длительное послевкусие',
      'Сочетания: Дичь, зрелые сыры, мясные пироги',
    ],
  },
  {
    id: 3,
    name: 'Вино JP. Chenet Original Colombard-Chardonnay белое полусухое',
    image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1021991-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wxNDAwNXxpbWFnZS9hdmlmfGltYWdlcy9oMGMvaDM0LzEwNTQzMjUxMjI2NjU0LmF2aWZ8MDAwNDQ2ZWZkNTUxNWQ4OGI2YzQ0NjA4ZTY1ODg3OTQ0ZmJlMzc2MTViYjBhNzIxYWRkMTMyNWU5ODE2NzY5Zg',
    type: 'Белое', year: 1975, sweetness: 'Полусладкое', alcohol: '11-12', sugar: '30-40', temperature: '8-10', price: 4500,
    description: [
      'Виноград: Ркацители, Рислинг',
      'Цвет: Янтарный с золотистыми переливами',
      'Аромат: Сухофрукты, мед и миндальные ноты',
      'Вкус: Маслянистая текстура с карамельным оттенком',
      'Сочетания: Фуа-гра, голубые сыры, ореховые десерты',
    ],
  },
  {
    id: 4,
    name: 'Вино игристое Абрау-Дюрсо Русское Игристое красное полусладкое',
    image: 'https://jmrkpxyvei.a.trbcdn.net/medias/1001719-1-1200Wx1200H-avif?context=bWFzdGVyfGltYWdlc3wyMzQ3MnxpbWFnZS9hdmlmfGltYWdlcy9oYzkvaGYyLzExNDIwNTQ4NjYxMjc4LmF2aWZ8MjY5ZWQzYjkxZDBlNDllODMwM2ZjNmU4MzU4MjczYmY2Njk1ZmZmMTE3YjQ3YmI5YzIyYzRjNTk2NWFhYjg3ZQ',
    type: 'Красное', year: 1990, sweetness: 'Полусладкое', alcohol: '12-13', sugar: '35-45', temperature: '10-12', price: 2800,
    description: [
      'Виноград: Каберне Совиньон, Саперави',
      'Цвет: Ярко-рубиновый с фиолетовыми отблесками',
      'Аромат: Малина, вишня и легкие дрожжевые ноты',
      'Вкус: Игристое ягодное настроение с бархатистой пеной',
      'Сочетания: Клубника в шоколаде, ягодные муссы',
    ],
  },
];
