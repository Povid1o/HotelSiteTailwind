import { $authHost, $host } from "./index";

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

export const fetchWines = async () => {
  const { data } = await $host.get('api/wines');
  return data;
};

export const createWine = async (wineType: string, sweetness: string, wineData: any) => {
  const formData = createFormDataWithFiles({
    type: wineType,
    sweetness: sweetness,
    ...wineData
  });

  const { data } = await $authHost.post('api/wines', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateWine = async (wineId: number, wineData: any) => {
  const formData = createFormDataWithFiles(wineData);
  const { data } = await $authHost.put(`api/wines/${wineId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteWine = async (wineId: number) => {
  const { data } = await $authHost.delete(`api/wines/${wineId}`);
  return data;
};