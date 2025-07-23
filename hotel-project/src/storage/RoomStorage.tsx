import { makeAutoObservable } from "mobx";

interface Room {
  id: number;
  name: string;
  title: string;
  description: string;
  images: { src: string; alt: string; }[];
  prices: { night: string; week: string; };
  features: string[];
  amenities: string[];
  checkInOut: { checkIn: string; checkOut: string; minStay: string; };
  restrictions: string[];
}

export default class RoomStorage {
  private _rooms: Room[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setRooms(rooms: Room[]) {
    this._rooms = Array.isArray(rooms) ? rooms : [];
  }

  get rooms(): Room[] {
    return this._rooms;
  }

}