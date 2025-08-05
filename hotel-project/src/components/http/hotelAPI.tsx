import { $authHost, $host } from "./index";

// Используем ту же утилиту для FormData
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

// API для номеров (совместимость с существующими методами)
export const fetchRoom = async () => {
  const { data } = await $host.get('api/room');
  return data;
};

export const fetchOneRoom = async (id: number) => {
  const { data } = await $host.get(`api/room/${id}`);
  return data;
};

export const createRoom = async (roomData: any) => {
  const formData = createFormDataWithFiles(roomData);
  const { data } = await $authHost.post('api/room', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateRoom = async (id: number, roomData: any) => {
  const formData = createFormDataWithFiles(roomData);
  const { data } = await $authHost.put(`api/room/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteRoom = async (id: number) => {
  const { data } = await $authHost.delete(`api/room/${id}`);
  return data;
};

// Новый метод для переключения активности
export const toggleRoomActive = async (id: number) => {
  const { data } = await $authHost.patch(`api/room/${id}/toggle-active`);
  return data;
};