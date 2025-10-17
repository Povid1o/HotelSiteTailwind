import { makeAutoObservable, runInAction } from "mobx";
import { createEvent, deleteEvent, getCategories, getEventById, getEvents, updateCategory, updateEvent } from "../components/http/eventsAPI";

export interface EventImage {
  id?: number;
  url: string;
  alt_text?: string;
  order?: number;
}

export interface EventItem {
  id: number;
  title: string;
  description: string;
  category_id: number;
  images: EventImage[];
}

export interface EventCategoryItem {
  id: number;
  header: string;
  description: string;
  events?: EventItem[];
}

export default class EventStorage {
  private _categories: EventCategoryItem[] = [];
  private _events: EventItem[] = [];
  private _isLoading = false;
  private _error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get categories(): EventCategoryItem[] { return this._categories; }
  get events(): EventItem[] { return this._events; }
  get isLoading(): boolean { return this._isLoading; }
  get error(): string | null { return this._error; }

  setLoading(b: boolean) { this._isLoading = b; }
  setError(e: string | null) { this._error = e; }

  async loadCategories() {
    try {
      this.setLoading(true);
      const data = await getCategories();
      runInAction(() => { this._categories = data; });
    } catch (e: any) {
      runInAction(() => this.setError(e.message));
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  async loadEvents(categoryId?: number) {
    try {
      this.setLoading(true);
      const data = await getEvents(categoryId);
      runInAction(() => { this._events = data; });
    } catch (e: any) {
      runInAction(() => this.setError(e.message));
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  async refreshAll() {
    await Promise.all([this.loadCategories(), this.loadEvents()]);
  }

  async updateCategory(id: number, payload: { header?: string; description?: string }) {
    const updated = await updateCategory(id, payload);
    await this.loadCategories();
    return updated;
  }

  async createEvent(payload: { title: string; description?: string; categoryId: number; images?: any[] }) {
    const ev = await createEvent(payload);
    await this.refreshAll();
    return ev;
  }

  async updateEvent(id: number, payload: { title?: string; description?: string; categoryId?: number; images?: any[] }) {
    const ev = await updateEvent(id, payload);
    await this.refreshAll();
    return ev;
  }

  async deleteEvent(id: number) {
    await deleteEvent(id);
    await this.refreshAll();
  }
}