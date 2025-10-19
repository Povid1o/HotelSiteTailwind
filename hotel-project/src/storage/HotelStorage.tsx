import { makeAutoObservable } from 'mobx';
import { 
  fetchRoom, 
  createRoom, 
  updateRoom, 
  deleteRoom, 
  toggleRoomActive,
  fetchOneRoom,
  uploadFile
} from '../components/http/hotelAPI';
import { STATIC_BASE } from '../components/http';
import { API_BASE } from '../components/http/index';

interface RoomPrice {
  title: string;
  price: string;
}

interface HotelRoom {
  id: number;
  name: string;
  images: (string | File)[];
  properties: string[];
  conviniences: string[];
  description: string;
  price: RoomPrice[];
  checkStandart: { checkIn: string; checkOut: string };
  notes: string[];
  isActive: boolean;
}

export default class HotelStorageNew {
  private _rooms: HotelRoom[] = [];
  private _isLoading = false;
  private _error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Getters
  get rooms(): HotelRoom[] {
    return this._rooms;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get error(): string | null {
    return this._error;
  }

  // Setters
  setRooms(rooms: HotelRoom[]) {
    this._rooms = rooms;
  }

  setLoading(loading: boolean) {
    this._isLoading = loading;
  }

  setError(error: string | null) {
    this._error = error;
  }

  // Helper function to transform backend data to frontend format
  private transformRoomFromBackend(backendRoom: any): HotelRoom {
    // Helper to normalize image URLs
    const normalizeImageUrl = (url: string): string => {
      if (!url) return '';
      // If URL is already absolute (starts with http:// or https://), return as is
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      // If URL is relative, prepend STATIC_BASE
      return `${STATIC_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    return {
      id: backendRoom.id,
      name: backendRoom.name,
      images: backendRoom.images?.map((img: any) => normalizeImageUrl(img.url)) || [],
      properties: backendRoom.properties?.map((prop: any) => prop.property_text) || [],
      conviniences: backendRoom.conveniences?.map((conv: any) => conv.convenience_text) || [],
      description: backendRoom.description || '',
      price: backendRoom.prices?.map((p: any) => ({ title: p.title, price: String(p.price) })) || [],
      checkStandart: {
        checkIn: backendRoom.check_in_time || '14:00',
        checkOut: backendRoom.check_out_time || '12:00'
      },
      notes: backendRoom.notes?.map((note: any) => note.note_text) || [],
      isActive: backendRoom.is_active ?? true,
    };
  }

  // Helper function to transform frontend data to backend format
  private async transformRoomToBackend(frontendRoom: Partial<HotelRoom>): Promise<any> {
    const backendData: any = {};
    
    if (frontendRoom.name !== undefined) backendData.name = frontendRoom.name;
    if (frontendRoom.description !== undefined) backendData.description = frontendRoom.description;
    if (frontendRoom.isActive !== undefined) backendData.is_active = frontendRoom.isActive;
    
    if (frontendRoom.checkStandart) {
      backendData.check_in_time = frontendRoom.checkStandart.checkIn;
      backendData.check_out_time = frontendRoom.checkStandart.checkOut;
    }
    
    // Handle images - upload File objects, normalize URL strings
    if (frontendRoom.images !== undefined) {
      const imageUrls = await Promise.all(
        frontendRoom.images.map(async (img) => {
          // Обработка File объектов
          if (img instanceof File) {
            return await uploadFile(img, 'rooms');
          }
          
          // Обработка строковых URL
          if (typeof img === 'string') {
            // ✅ ФИЛЬТРУЕМ blob URLs! Они не работают на других устройствах
            if (img.startsWith('blob:')) {
              console.warn('⚠️ Skipping blob URL (not valid for other devices):', img);
              return null; // Не сохраняем blob URLs
            }
            return img; // Сохраняем только реальные URL
          }
          
          // Обработка объектов { src: File|string, alt: string, file?: File }
          if (img && typeof img === 'object') {
            const imgObj = img as any;
            // Если есть file property и это File
            if (imgObj.file instanceof File) {
              return await uploadFile(imgObj.file, 'rooms');
            }
            // Если src это строка
            if (typeof imgObj.src === 'string') {
              // ✅ ФИЛЬТРУЕМ blob URLs!
              if (imgObj.src.startsWith('blob:')) {
                console.warn('⚠️ Skipping blob URL from object (not valid for other devices):', imgObj.src);
                return null;
              }
              return imgObj.src;
            }
          }
          
          return null;
        })
      );
      
      // ✅ Удаляем null значения (отфильтрованные blob URLs и пустые строки)
      const validUrls = imageUrls.filter(url => url !== null && url !== '');
      
      console.log('📸 Images to save:', validUrls);
      console.log('📸 Original images count:', frontendRoom.images.length, '| Valid after filtering:', validUrls.length);
      
      // ⚠️ КРИТИЧНО: Отправляем images ТОЛЬКО если есть валидные URL
      // Если все URL были blob: и отфильтровались, НЕ отправляем images вообще,
      // чтобы backend НЕ УДАЛИЛ существующие фото из БД
      if (validUrls.length > 0) {
        backendData.images = validUrls.map((url, index) => ({
          url,
          alt_text: '',
          order: index
        }));
      } else {
        console.warn('⚠️ All images were blob URLs and filtered out. NOT sending images field to preserve existing photos in DB.');
      }
    }
    
    if (frontendRoom.properties !== undefined) {
      backendData.properties = frontendRoom.properties;
    }
    
    if (frontendRoom.conviniences !== undefined) {
      backendData.conveniences = frontendRoom.conviniences;
    }
    
    if (frontendRoom.price !== undefined) {
      backendData.prices = frontendRoom.price.map(p => ({
        title: p.title,
        price: parseFloat(p.price)
      }));
    }
    
    if (frontendRoom.notes !== undefined) {
      backendData.notes = frontendRoom.notes;
    }
    
    return backendData;
  }

  // API методы
  async loadRooms() {
    try {
      this.setLoading(true);
      this.setError(null);
      const backendRooms = await fetchRoom();
      const transformedRooms = backendRooms.map((room: any) => this.transformRoomFromBackend(room));
      this.setRooms(transformedRooms);
    } catch (error: any) {
      this.setError(error.message);
      console.error('Error loading rooms:', error);
    } finally {
      this.setLoading(false);
    }
  }

  async loadOneRoom(id: number) {
    try {
      const backendRoom = await fetchOneRoom(id);
      return this.transformRoomFromBackend(backendRoom);
    } catch (error: any) {
      this.setError(error.message);
      console.error('Error loading room:', error);
    }
  }

  // Локальные методы
  toggleRoomActiveLocal = (roomId: number) => {
    const room = this._rooms.find(r => r.id === roomId);
    if (room) {
      room.isActive = !room.isActive;
      
      toggleRoomActive(roomId).catch(error => {
        console.error('Error toggling room active:', error);
        // Откатываем изменения
        room.isActive = !room.isActive;
      });
    }
  };

  updateRoomLocal = async (roomId: number, updatedData: Partial<HotelRoom>) => {
    const room = this._rooms.find(r => r.id === roomId);
    if (room) {
      const oldData = { ...room };
      
      try {
        // Отправляем данные на backend
        const backendData = await this.transformRoomToBackend(updatedData);
        const response = await updateRoom(roomId, backendData);
        
        // ✅ КРИТИЧНО: Обновляем данные из backend (с реальными URL, без blob://)
        const updatedRoom = this.transformRoomFromBackend(response);
        Object.assign(room, updatedRoom);
        
        // ✅ Принудительно обновляем массив для реактивности MobX
        // Это гарантирует, что все компоненты-наблюдатели увидят изменения
        this._rooms = [...this._rooms];
        
        console.log('✅ Room updated successfully with real URLs:', updatedRoom);
      } catch (error: any) {
        if (error?.response?.status === 413) {
          console.error('❌ File too large! Max size: 100MB');
          alert('Файл слишком большой! Максимальный размер: 100 МБ. Попробуйте загрузить файл меньшего размера или сжать его.');
        } else {
          console.error('❌ Error updating room:', error);
        }
        // Откатываем изменения
        Object.assign(room, oldData);
        throw error; // Пробрасываем ошибку для обработки в UI
      }
    }
  };

  addRoom = async () => {
    const newRoom: HotelRoom = {
      id: Date.now(), // Временный ID
      name: "Новый номер",
      images: [],
      properties: [],
      conviniences: [],
      description: "",
      price: [{ title: 'ночь', price: '0' }],
      checkStandart: { checkIn: "14:00", checkOut: "12:00" },
      notes: [],
      isActive: true,
    };
    
    this._rooms.push(newRoom);
    
    try {
      const backendData = await this.transformRoomToBackend(newRoom);
      const response = await createRoom(backendData);
      const createdRoom = this.transformRoomFromBackend(response);
      Object.assign(newRoom, createdRoom);
    } catch (error) {
      console.error('Error creating room:', error);
      this._rooms = this._rooms.filter(r => r.id !== newRoom.id);
    }
  };

  deleteRoomLocal = (roomId: number) => {
    const roomIndex = this._rooms.findIndex(r => r.id === roomId);
    const room = this._rooms[roomIndex];
    
    if (room) {
      this._rooms.splice(roomIndex, 1);
      
      deleteRoom(roomId).catch(error => {
        console.error('Error deleting room:', error);
        this._rooms.splice(roomIndex, 0, room);
      });
    }
  };
}