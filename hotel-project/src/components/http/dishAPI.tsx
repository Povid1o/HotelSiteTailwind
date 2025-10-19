import { $authHost, $host, API_BASE, STATIC_BASE } from "./index";

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

// Загрузка файла на сервер
export const uploadFile = async (file: File, mediaType: string = 'dishes'): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', mediaType);
    
    console.log(`Uploading file: ${file.name} (${file.size} bytes) to ${mediaType}`);
    
    const { data } = await $authHost.post('api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log(`File uploaded successfully: ${data.url}`);
    return data.url;
  } catch (error: any) {
    console.error('File upload error:', error);
    throw new Error(`Failed to upload file: ${error.response?.data?.message || error.message}`);
  }
};

// API для блюд
export const fetchDishes = async () => {
  const { data } = await $host.get('api/dishes');
  console.log('Raw API response:', data);
  
  // Приводим ответ бэкенда к форме, ожидаемой фронтом
  // Бэк: { id, name, products: [{ id, name, header, description_short, description_full, weight, price, images:[{url,...}]}] }
  // Фронт ждёт: { category, products: [{ id, name, header, description, descriptionFull, weight, price, images: string[] }] }
  const processedData = (Array.isArray(data) ? data : []).map((cat: any) => ({
    category: cat.name,
    products: (Array.isArray(cat.products) ? cat.products : []).map((p: any) => ({
      id: p.id,
      name: p.name,
      header: p.header ?? '',
      description: p.description_short ?? '',
      descriptionFull: p.description_full ?? '',
      weight: p.weight ?? '',
      price: typeof p.price === 'string' ? Number(p.price) : (p.price ?? 0),
      images: (Array.isArray(p.images) ? p.images : [])
        .map((img: any) => {
          // Преобразуем относительные URL в полные, избегая двойных слешей
          const src = img?.url || ''
          if (!src) return null
          if (src.startsWith('/static/')) {
            const cleanPath = src.startsWith('/') ? src : `/${src}`
            const fullUrl = `${STATIC_BASE}${cleanPath}`
            console.log(`Converting image URL: ${src} -> ${fullUrl}`)
            return fullUrl
          }
          // already absolute
          return src
        })
        .filter(Boolean),
    })),
  }));
  
  console.log('Processed data:', processedData);
  return processedData;
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
  // Обрабатываем изображения: загружаем файлы и получаем URL
  let images: Array<{url: string, order: number}> = [];
  if (Array.isArray(dishData.images)) {
    for (const img of dishData.images) {
      if (img instanceof File) {
        const url = await uploadFile(img, 'dishes');
        images.push({ url, order: images.length });
      } else if (typeof img === 'string' && img) {
        // ✅ ФИЛЬТРУЕМ blob URLs! Они не работают на других устройствах
        if (img.startsWith('blob:')) {
          console.warn('⚠️ dishAPI: Skipping blob URL (not valid for other devices):', img);
          continue; // Пропускаем blob URLs
        }
        images.push({ url: img, order: images.length });
      }
    }
  }

  const priceNum = Number(dishData.price);
  const payload: any = {
    category_id: found.id,
    name: dishData.name || 'Новое блюдо',
    header: dishData.header ?? '',
    description_short: dishData.description ?? '',
    description_full: dishData.descriptionFull ?? '',
    weight: dishData.weight ?? '',
    price: Number.isFinite(priceNum) ? priceNum : 0,
    nutrients: null,
    is_active: true,
    images
  };

  const { data } = await $authHost.post('api/dishes', payload);
  return data;
};

export const updateDish = async (categoryName: string, dishId: number, dishData: any) => {
  try {
    // Гарантируем category_id
    let categoryId = dishData.category_id;
    if (!categoryId && categoryName) {
      const categories = await fetchDishCategories();
      const found = categories.find(c => c.name === categoryName);
      if (!found) throw new Error(`Категория не найдена: ${categoryName}`);
      categoryId = found.id;
    }

    // Обрабатываем изображения: загружаем файлы и получаем URL
    let images: Array<{url: string, order: number}> = [];
    if (Array.isArray(dishData.images)) {
      console.log(`Processing ${dishData.images.length} images for dish ${dishId}`);
      
      for (const img of dishData.images) {
        if (img instanceof File) {
          try {
            // Загружаем файл на сервер с типом 'dishes'
            const url = await uploadFile(img, 'dishes');
            images.push({ url, order: images.length });
            console.log(`Image uploaded: ${url}`);
          } catch (error) {
            console.error(`Failed to upload image ${img.name}:`, error);
            throw error; // Прерываем процесс при ошибке загрузки
          }
        } else if (typeof img === 'string' && img) {
          // ✅ ФИЛЬТРУЕМ blob URLs! Они не работают на других устройствах
          if (img.startsWith('blob:')) {
            console.warn('⚠️ dishAPI: Skipping blob URL (not valid for other devices):', img);
            continue; // Пропускаем blob URLs
          }
          // Уже загруженный URL
          images.push({ url: img, order: images.length });
          console.log(`Using existing image: ${img}`);
        }
      }
    }

    const priceNum = Number(dishData.price);
    const payload: any = {
      category_id: categoryId,
      name: dishData.name || 'Новое блюдо',
      header: dishData.header ?? '',
      description_short: dishData.description ?? '',
      description_full: dishData.descriptionFull ?? '',
      weight: dishData.weight ?? '',
      price: Number.isFinite(priceNum) ? priceNum : 0,
      nutrients: dishData.nutrients ?? null,
      is_active: dishData.is_active ?? true
    };

    // ⚠️ КРИТИЧНО: Отправляем images ТОЛЬКО если есть валидные изображения после фильтрации
    if (dishData.images !== undefined) {
      if (images.length > 0) {
        payload.images = images;
      } else {
        console.warn('⚠️ All dish images were blob URLs and filtered out. NOT sending images field to preserve existing photos in DB.');
      }
    }

    console.log(`Updating dish ${dishId} with payload:`, payload);
    const { data } = await $authHost.put(`api/dishes/${dishId}`, payload);
    console.log(`Dish ${dishId} updated successfully`);
    return data;
  } catch (error: any) {
    console.error(`Error updating dish ${dishId}:`, error);
    throw error;
  }
};

export const deleteDish = async (dishId: number, retries = 2) => {
  try {
    const { data } = await $authHost.delete(`api/dishes/${dishId}`);
    return data;
  } catch (error: any) {
    // Retry on 500 or 409 errors with exponential backoff
    if (retries > 0 && error.response && [500, 409].includes(error.response.status)) {
      console.warn(`Delete dish ${dishId} failed with ${error.response.status}, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 300 * (3 - retries)));
      return deleteDish(dishId, retries - 1);
    }
    
    // Map error message for better UX
    const message = error.response?.data?.message || error.message || 'Failed to delete dish';
    console.error(`Error deleting dish ${dishId}:`, message);
    throw new Error(message);
  }
};

// Универсальная функция загрузки файлов для разных типов медиа
export const uploadMediaFile = async (file: File, mediaType: 'dishes' | 'wines' | 'rooms' | 'pages' | 'videos'): Promise<string> => {
  return uploadFile(file, mediaType);
};