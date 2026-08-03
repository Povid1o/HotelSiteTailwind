import { makeAutoObservable } from 'mobx';
import { fetchWines, createWine, updateWine, deleteWine } from '../components/http/wineAPI';
import { API_BASE } from '../components/http';

interface Wine {
  id: number;
  name: string;
  images: (string | File)[];
  year: number;
  alcohol: string;
  sugar: string;
  temperature: string;
  price: number;
  description: string[];
}

interface WineAssortment {
  sweetness: string;
  wines: Wine[];
}

interface WineType {
  type: string;
  assortment: WineAssortment[];
}

export default class WineStorage {
  private _wines: WineType[] = [];
  private _isLoading = false;
  private _error: string | null = null;
  private _pendingCreates = new Map<number, Promise<number>>();
  private _wineSaveQueues = new Map<number, Promise<void>>();
  private _savingWineIds = new Set<number>();
  private _wineSaveErrors = new Map<number, string>();
  private _wineSaveVersions = new Map<number, number>();

  constructor() {
    makeAutoObservable(this);
  }

  // Getters
  get wines(): WineType[] {
    return this._wines;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get error(): string | null {
    return this._error;
  }

  isSavingWine(wineId: number): boolean {
    return this._savingWineIds.has(wineId);
  }

  getWineSaveError(wineId: number): string | null {
    return this._wineSaveErrors.get(wineId) || null;
  }

  // Setters
  setWines(wines: WineType[]) {
    this._wines = wines;
  }

  setLoading(loading: boolean) {
    this._isLoading = loading;
  }

  setError(error: string | null) {
    this._error = error;
  }

  // API методы
  async loadWines() {
    try {
      this.setLoading(true);
      this.setError(null);
      const wines = await fetchWines();
      this.setWines(wines);
    } catch (error: any) {
      this.setError(error.message);
      console.error('Error loading wines:', error);
    } finally {
      this.setLoading(false);
    }
  }

  // Локальные методы
  addWine = (wineType: string, sweetness: string) => {
    // Генерируем уникальный временный ID (отрицательное число)
    const tempId = -(Date.now() + Math.random() * 1000);
    
    const newWine: Wine = {
      id: tempId,
      name: "Новая бутылка",
      images: [],
      year: new Date().getFullYear(),
      alcohol: "12-13",
      sugar: "5-10",
      temperature: "16-18",
      price: 0,
      description: [
        "Виноград: Не указан",
        "Цвет: Не указан",
        "Аромат: Не указан",
        "Вкус: Не указан",
        "Сочетания: Не указано"
      ]
    };

    const wineCategory = this._wines.find(cat => cat.type === wineType);
    if (wineCategory) {
      const assortmentItem = wineCategory.assortment.find(item => item.sweetness === sweetness);
      if (assortmentItem) {
        assortmentItem.wines.push(newWine);
        
        const createPromise = createWine(wineType, sweetness, newWine).then(response => {
          // Заменяем временный ID на реальный
          const wine = assortmentItem.wines.find(w => w.id === tempId);
          if (wine) {
            wine.id = response.id;
          }
          this._pendingCreates.delete(tempId);
          }).catch((error: any) => {
          if (error?.response?.status === 413) {
            console.error('❌ File too large! Max size: 100MB');
            alert('Файл слишком большой! Максимальный размер: 100 МБ. Попробуйте загрузить файл меньшего размера или сжать его.');
          } else {
            console.error('Error creating wine:', error);
          }
          assortmentItem.wines = assortmentItem.wines.filter(w => w.id !== tempId);
          this._pendingCreates.delete(tempId);
          throw error;
        });
        this._pendingCreates.set(tempId, createPromise);
        void createPromise.catch(() => undefined);
      }
    }
  };

  deleteWineLocal = (wineType: string, sweetness: string, wineId: number) => {
    const wineCategory = this._wines.find(cat => cat.type === wineType);
    if (wineCategory) {
      const assortmentItem = wineCategory.assortment.find(item => item.sweetness === sweetness);
      if (assortmentItem) {
        const wineIndex = assortmentItem.wines.findIndex(w => w.id === wineId);
        const wine = assortmentItem.wines[wineIndex];
        
        if (wine) {
          assortmentItem.wines.splice(wineIndex, 1);
          
          // Если это временный ID (отрицательный), не вызываем API
          if (wineId < 0) {
            return; // Просто удаляем локально
          }
          
          // Для реальных ID вызываем API удаления
          deleteWine(wineId).catch(error => {
            console.error('Error deleting wine:', error);
            assortmentItem.wines.splice(wineIndex, 0, wine);
          });
        }
      }
    }
  };

  updateWineLocal = (wineType: string, sweetness: string, wineId: number, updatedData: Partial<Wine>) => {
    const wineCategory = this._wines.find(cat => cat.type === wineType);
    const assortmentItem = wineCategory?.assortment.find(item => item.sweetness === sweetness);
    const wine = assortmentItem?.wines.find(item => item.id === wineId);
    if (!wine) return Promise.resolve();

    const oldData = { ...wine };
    const version = (this._wineSaveVersions.get(wineId) || 0) + 1;
    const pendingCreate = wineId < 0 ? this._pendingCreates.get(wineId) : undefined;
    this._wineSaveVersions.set(wineId, version);
    this._wineSaveErrors.delete(wineId);
    Object.assign(wine, updatedData);
    this._wines = [...this._wines];

    const previousSave = this._wineSaveQueues.get(wineId) || Promise.resolve();
    this._savingWineIds.add(wineId);
    const save = previousSave
      .catch(() => undefined)
      .then(async () => {
        try {
          const realId = pendingCreate ? await pendingCreate : wine.id;
          if (realId < 0) throw new Error('Создание вина ещё не завершено');
          const response = await updateWine(realId, updatedData, wineType, sweetness);
          if (this._wineSaveVersions.get(wineId) === version) {
            Object.assign(wine, {
              id: response.id,
              name: response.name,
              year: response.year,
              alcohol: response.alcohol ?? '',
              sugar: response.sugar ?? '',
              temperature: response.temperature ?? '',
              price: Number(response.price) || 0,
              description: (response.description || []).map((item: any) => item.description_text || item),
              images: (response.images || []).map((item: any) => {
                const url = item?.url || '';
                return url.startsWith('/static/') || url.startsWith('/uploads/') ? `${API_BASE}${url}` : url;
              }).filter(Boolean),
            });
            this._wines = [...this._wines];
          }
        } catch (error: any) {
          const message = error?.response?.data?.message || error?.message || 'Не удалось сохранить вино';
          console.error('Error updating wine:', error);
          if (this._wineSaveVersions.get(wineId) === version) {
            Object.assign(wine, oldData);
            this._wines = [...this._wines];
            this._wineSaveErrors.set(wineId, message);
          }
        }
      });

    this._wineSaveQueues.set(wineId, save);
    void save.finally(() => {
      if (this._wineSaveQueues.get(wineId) === save) {
        this._wineSaveQueues.delete(wineId);
        this._savingWineIds.delete(wineId);
      }
    });
    return save;
  };
}
