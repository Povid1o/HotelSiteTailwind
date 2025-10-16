import { makeAutoObservable } from 'mobx';
import { fetchWines, createWine, updateWine, deleteWine } from '../components/http/wineAPI';

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
        
        createWine(wineType, sweetness, newWine).then(response => {
          // Заменяем временный ID на реальный
          const wine = assortmentItem.wines.find(w => w.id === tempId);
          if (wine) {
            wine.id = response.id;
          }
        }).catch(error => {
          console.error('Error creating wine:', error);
          assortmentItem.wines = assortmentItem.wines.filter(w => w.id !== tempId);
        });
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
    if (wineCategory) {
      const assortmentItem = wineCategory.assortment.find(item => item.sweetness === sweetness);
      if (assortmentItem) {
        const wine = assortmentItem.wines.find(w => w.id === wineId);
        if (wine) {
          const oldData = { ...wine };
          Object.assign(wine, updatedData);
          
          updateWine(wineId, updatedData, wineType, sweetness).catch(error => {
            console.error('Error updating wine:', error);
            Object.assign(wine, oldData);
          });
        }
      }
    }
  };
}