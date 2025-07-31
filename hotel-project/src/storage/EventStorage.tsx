import { makeAutoObservable } from "mobx";

interface Event {
  categorie: string;
  news: {
    header: string;
    description: string;
    imgSrc: string;
  }[];
}

export default class EventStorage {
  private _events: Event[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setEvents(events: Event[]) {
    this._events = events;
  }

  get events(): Event[] {
    return this._events;
  }
}