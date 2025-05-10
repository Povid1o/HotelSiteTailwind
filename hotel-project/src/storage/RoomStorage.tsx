import { makeAutoObservable } from "mobx";

// Определяем интерфейсы для данных
interface RoomType {
  id: number;
  name: string;
  // другие свойства
}

interface RoomClass {
  id: number;
  name: string;
  // другие свойства
}

interface Room {
  id: number;
  name: string;
  // другие свойства
}

export default class RoomStorage {
  private _types: RoomType[] = [];
  private _clases: RoomClass[] = [];
  private _rooms: Room[] = [];
  private _selectedType: RoomType | Record<string, never> = {};
  private _selectedClase: RoomClass | Record<string, never> = {};

  constructor() {
    makeAutoObservable(this);
  }

  setTypes(types: RoomType[]) {
    this._types = types;
  }

  setClases(clases: RoomClass[]) {
    this._clases = clases;
  }

  setRooms(rooms: Room[]) {
    this._rooms = Array.isArray(rooms) ? rooms : [];
  }

  setSelectedType(type: RoomType) {
    this._selectedType = type;
  }

  setSelectedClase(clase: RoomClass) {
    this._selectedClase = clase;
  }

  get types(): RoomType[] {
    return this._types;
  }

  get clases(): RoomClass[] {
    return this._clases;
  }

  get rooms(): Room[] {
    return this._rooms;
  }

  get selectedType(): RoomType | Record<string, never> {
    return this._selectedType;
  }

  get selectedClase(): RoomClass | Record<string, never> {
    return this._selectedClase;
  }
}