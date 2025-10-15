export interface ProductionStoreItem {
  id: number;
  name: string;
  description: string;
  image: string;
}

export const productionStoreEmergency: ProductionStoreItem[] = [
  { id: 1, name: 'Название продукта1', description: 'Описание продукта', image: '/images/Wine_Background.png' },
  { id: 2, name: 'Название продукта2', description: 'Описание продукта', image: '/images/Wine_Background.png' },
  { id: 3, name: 'Название продукта3', description: 'Описание продукта', image: '/images/Wine_Background.png' },
];
