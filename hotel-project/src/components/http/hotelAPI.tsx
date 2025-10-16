import { $authHost, $host } from "./index";

// Helper function to upload files
export const uploadFile = async (file: File, type: string = 'rooms'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  const { data } = await $authHost.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return data.url;
};

// API для номеров
export const fetchRoom = async () => {
  const { data } = await $host.get('api/rooms');
  return data;
};

export const fetchOneRoom = async (id: number) => {
  const { data } = await $host.get(`api/rooms/${id}`);
  return data;
};

export const createRoom = async (roomData: any) => {
  const { data } = await $authHost.post('api/rooms', roomData);
  return data;
};

export const updateRoom = async (id: number, roomData: any) => {
  const { data } = await $authHost.put(`api/rooms/${id}`, roomData);
  return data;
};

export const deleteRoom = async (id: number) => {
  const { data } = await $authHost.delete(`api/rooms/${id}`);
  return data;
};

export const toggleRoomActive = async (id: number) => {
  const { data } = await $authHost.patch(`api/rooms/${id}/toggle-active`);
  return data;
};