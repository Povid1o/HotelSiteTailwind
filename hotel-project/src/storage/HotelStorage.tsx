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
          if (img instanceof File) {
            // Upload new file and return full URL
            return await uploadFile(img, 'rooms');
          }
          
          if (typeof img === 'string') {
            // If URL is full (starts with http), keep as is - backend will handle it
            // If URL is relative, keep as is
            return img;
          }
          
          return '';
        })
      );
      
      backendData.images = imageUrls.map((url, index) => ({
        url,
        alt_text: '',
        order: index
      }));
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
      Object.assign(room, updatedData);
      
      try {
        const backendData = await this.transformRoomToBackend(updatedData);
        const response = await updateRoom(roomId, backendData);
        // Update with fresh data from backend
        const updatedRoom = this.transformRoomFromBackend(response);
        Object.assign(room, updatedRoom);
      } catch (error) {
        console.error('Error updating room:', error);
        // Откатываем изменения
        Object.assign(room, oldData);
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