import { makeAutoObservable, runInAction } from "mobx";
import { createEvent, deleteEvent, getCategories, getEvents, updateCategory, updateEvent } from "../components/http/eventsAPI";

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
  private _eventSaveQueues = new Map<number, Promise<void>>();
  private _savingEventIds = new Set<number>();
  private _eventSaveErrors = new Map<number, string>();
  private _eventSaveVersions = new Map<number, number>();

  constructor() {
    makeAutoObservable(this);
  }

  get categories(): EventCategoryItem[] { return this._categories; }
  get events(): EventItem[] { return this._events; }
  get isLoading(): boolean { return this._isLoading; }
  get error(): string | null { return this._error; }
  isSavingEvent(id: number): boolean { return this._savingEventIds.has(id); }
  getEventSaveError(id: number): string | null { return this._eventSaveErrors.get(id) || null; }

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

  updateEvent(id: number, payload: { title?: string; description?: string; categoryId?: number; images?: any[] }) {
    const category = this._categories.find(item => item.events?.some(event => event.id === id));
    const event = category?.events?.find(item => item.id === id);
    if (!event) return Promise.resolve();

    const oldData = { ...event };
    const version = (this._eventSaveVersions.get(id) || 0) + 1;
    this._eventSaveVersions.set(id, version);
    this._eventSaveErrors.delete(id);
    Object.assign(event, payload);
    if (payload.categoryId !== undefined) event.category_id = payload.categoryId;
    this._categories = [...this._categories];

    const previousSave = this._eventSaveQueues.get(id) || Promise.resolve();
    this._savingEventIds.add(id);
    const save = previousSave
      .catch(() => undefined)
      .then(async () => {
        try {
          const response = await updateEvent(id, payload);
          if (this._eventSaveVersions.get(id) === version) {
            Object.assign(event, response);
            this._categories = [...this._categories];
          }
        } catch (error: any) {
          const message = error?.response?.data?.message || error?.message || 'Не удалось сохранить мероприятие';
          console.error('Error updating event:', error);
          if (this._eventSaveVersions.get(id) === version) {
            Object.assign(event, oldData);
            this._categories = [...this._categories];
            this._eventSaveErrors.set(id, message);
          }
        }
      });

    this._eventSaveQueues.set(id, save);
    void save.finally(() => {
      if (this._eventSaveQueues.get(id) === save) {
        this._eventSaveQueues.delete(id);
        this._savingEventIds.delete(id);
      }
    });
    return save;
  }

  async deleteEvent(id: number) {
    await deleteEvent(id);
    await this.refreshAll();
  }
}
