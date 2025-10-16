import { $authHost, $host } from "./index";

// Утилита для создания FormData с файлами
const createFormDataWithFiles = (data: any) => {
  const formData = new FormData();
  
  const processObject = (obj: any, prefix = '') => {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const fieldName = prefix ? `${prefix}[${key}]` : key;
      
      if (value instanceof File) {
        formData.append(fieldName, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${fieldName}[${index}]`, item);
          } else if (typeof item === 'object' && item !== null) {
            processObject(item, `${fieldName}[${index}]`);
          } else {
            formData.append(`${fieldName}[${index}]`, String(item));
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        processObject(value, fieldName);
      } else {
        formData.append(fieldName, String(value));
      }
    });
  };
  
  processObject(data);
  return formData;
};

// API для блюд
export const fetchDishes = async () => {
  const { data } = await $host.get('api/dishes');
  // Приводим ответ бэкенда к форме, ожидаемой фронтом
  // Бэк: { id, name, products: [{ id, name, header, description_short, description_full, weight, price, images:[{url,...}]}] }
  // Фронт ждёт: { category, products: [{ id, name, header, description, descriptionFull, weight, price, images: string[] }] }
  return (Array.isArray(data) ? data : []).map((cat: any) => ({
    category: cat.name,
    products: (Array.isArray(cat.products) ? cat.products : []).map((p: any) => ({
      id: p.id,
      name: p.name,
      header: p.header ?? '',
      description: p.description_short ?? '',
      descriptionFull: p.description_full ?? '',
      weight: p.weight ?? '',
      price: typeof p.price === 'string' ? Number(p.price) : (p.price ?? 0),
      images: (Array.isArray(p.images) ? p.images : []).map((img: any) => img.url).filter(Boolean),
    })),
  }));
};

// Получить список категорий блюд (id, name)
export const fetchDishCategories = async (): Promise<Array<{ id: number; name: string }>> => {
  const { data } = await $host.get('api/dish-categories');
  return data;
};

export const createCategory = async (categoryName: string) => {
  const { data } = await $authHost.post('api/dish-categories', { 
    name: categoryName 
  });
  return data;
};

export const deleteCategory = async (categoryName: string) => {
  // Бэкенд ждёт id в пути. Если сейчас приходит имя — это несовместимо.
  // Оставляем как есть, но фронт должен сначала получить список и взять id.
  const { data } = await $authHost.delete(`api/dish-categories/${encodeURIComponent(categoryName)}`);
  return data;
};

export const updateCategory = async (oldNameOrId: string, newName: string) => {
  const { data } = await $authHost.put(`api/dish-categories/${encodeURIComponent(oldNameOrId)}`, {
    name: newName
  });
  return data;
};

export const createDish = async (categoryName: string, dishData: any) => {
  // Найти id категории по имени
  const categories = await fetchDishCategories();
  const found = categories.find(c => c.name === categoryName);
  if (!found) {
    throw new Error(`Категория не найдена: ${categoryName}`);
  }

  // Сформировать JSON под схему бэкенда
  const payload: any = {
    category_id: found.id,
    name: dishData.name,
    header: dishData.header ?? '',
    description_short: dishData.description ?? '',
    description_full: dishData.descriptionFull ?? '',
    weight: dishData.weight ?? '',
    price: dishData.price ?? 0,
    nutrients: null,
    is_active: true,
    images: Array.isArray(dishData.images) ? [] : [] // пока без загрузки файлов
  };

  const { data } = await $authHost.post('api/dishes', payload);
  return data;
};

export const updateDish = async (categoryName: string, dishId: number, dishData: any) => {
  // Гарантируем category_id
  let categoryId = dishData.category_id;
  if (!categoryId && categoryName) {
    const categories = await fetchDishCategories();
    const found = categories.find(c => c.name === categoryName);
    if (!found) throw new Error(`Категория не найдена: ${categoryName}`);
    categoryId = found.id;
  }

  // Сериализуем изображения только как URL-ы
  const images = Array.isArray(dishData.images)
    ? dishData.images
        .filter((i: any) => typeof i === 'string' && i)
        .map((url: string, index: number) => ({ url, order: index }))
    : [];

  const payload: any = {
    category_id: categoryId,
    name: dishData.name,
    header: dishData.header ?? '',
    description_short: dishData.description ?? '',
    description_full: dishData.descriptionFull ?? '',
    weight: dishData.weight ?? '',
    price: dishData.price ?? 0,
    nutrients: dishData.nutrients ?? null,
    is_active: dishData.is_active ?? true,
    images
  };

  const { data } = await $authHost.put(`api/dishes/${dishId}`, payload);
  return data;
};

export const deleteDish = async (dishId: number) => {
  const { data } = await $authHost.delete(`api/dishes/${dishId}`);
  return data;
};