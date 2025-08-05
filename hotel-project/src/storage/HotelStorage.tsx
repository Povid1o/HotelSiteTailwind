import { makeAutoObservable } from 'mobx';
import { 
  fetchRoom, 
  createRoom, 
  updateRoom, 
  deleteRoom, 
  toggleRoomActive,
  fetchOneRoom 
} from '../components/http/hotelAPI';

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

  // API методы
  async loadRooms() {
    try {
      this.setLoading(true);
      this.setError(null);
      const rooms = await fetchRoom();
      this.setRooms(rooms);
    } catch (error: any) {
      this.setError(error.message);
      console.error('Error loading rooms:', error);
    } finally {
      this.setLoading(false);
    }
  }

  async loadOneRoom(id: number) {
    try {
      const room = await fetchOneRoom(id);
      return room;
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

  updateRoomLocal = (roomId: number, updatedData: Partial<HotelRoom>) => {
    const room = this._rooms.find(r => r.id === roomId);
    if (room) {
      const oldData = { ...room };
      Object.assign(room, updatedData);
      
      updateRoom(roomId, updatedData).catch(error => {
        console.error('Error updating room:', error);
        // Откатываем изменения
        Object.assign(room, oldData);
      });
    }
  };

  addRoom = () => {
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
    
    createRoom(newRoom).then(response => {
      newRoom.id = response.id;
    }).catch(error => {
      console.error('Error creating room:', error);
      this._rooms = this._rooms.filter(r => r.id !== newRoom.id);
    });
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