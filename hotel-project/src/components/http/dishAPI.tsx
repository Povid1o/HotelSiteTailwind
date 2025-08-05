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
  return data;
};

export const createCategory = async (categoryName: string) => {
  const { data } = await $authHost.post('api/dishes/categories', { 
    category: categoryName 
  });
  return data;
};

export const deleteCategory = async (categoryName: string) => {
  const { data } = await $authHost.delete(`api/dishes/categories/${encodeURIComponent(categoryName)}`);
  return data;
};

export const updateCategory = async (oldName: string, newName: string) => {
  const { data } = await $authHost.put(`api/dishes/categories/${encodeURIComponent(oldName)}`, {
    category: newName
  });
  return data;
};

export const createDish = async (categoryName: string, dishData: any) => {
  const formData = createFormDataWithFiles({
    category: categoryName,
    ...dishData
  });

  const { data } = await $authHost.post('api/dishes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateDish = async (dishId: number, dishData: any) => {
  const formData = createFormDataWithFiles(dishData);

  const { data } = await $authHost.put(`api/dishes/${dishId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteDish = async (dishId: number) => {
  const { data } = await $authHost.delete(`api/dishes/${dishId}`);
  return data;
};