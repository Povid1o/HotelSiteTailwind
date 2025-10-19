import { makeAutoObservable } from 'mobx';
import { 
  fetchDishes, 
  createCategory, 
  deleteCategory, 
  updateCategory,
  createDish,
  updateDish,
  deleteDish
} from '../components/http/dishAPI';

interface DishProduct {
  id: number;
  name: string;
  images: (string | File)[];
  header: string;
  description: string;
  descriptionFull: string;
  weight: string;
  price: number;
}

interface DishCategory {
  category: string;
  products: DishProduct[];
}


export default class DishStorage {
  private _dishes: DishCategory[] = [];
  private _isLoading = false;
  private _error: string | null = null;
  private _pendingCreates: Map<number, Promise<number>> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  // Getters
  get dishes(): DishCategory[] {
    return this._dishes;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get error(): string | null {
    return this._error;
  }

  // Setters
  setDishes(dishes: DishCategory[]) {
    this._dishes = dishes;
  }

  setLoading(loading: boolean) {
    this._isLoading = loading;
  }

  setError(error: string | null) {
    this._error = error;
  }

  // API методы
  async loadDishes() {
    try {
      this.setLoading(true);
      this.setError(null);
      console.log('DishStorage: Загружаем блюда...');
      const dishes = await fetchDishes();
      console.log('DishStorage: Получены блюда:', dishes);
      this.setDishes(dishes);
      console.log('DishStorage: Блюда установлены в store');
    } catch (error: any) {
      this.setError(error.message);
      console.error('DishStorage: Ошибка загрузки блюд:', error);
    } finally {
      this.setLoading(false);
    }
  }

  // Локальные методы (для мгновенного UI обновления)
  addCategory = (categoryName: string) => {
    const existingCategories = this._dishes.filter(dish => 
      dish.category === categoryName || dish.category.startsWith(`${categoryName} (`)
    );

    if (existingCategories.length === 0) {
      this._dishes.push({ category: categoryName, products: [] });
      // Вызываем API для синхронизации с сервером
      createCategory(categoryName).catch(error => {
        console.error('Error creating category:', error);
        // В случае ошибки можно откатить изменения
        this._dishes = this._dishes.filter(dish => dish.category !== categoryName);
      });
      return;
    }

    const existingNumbers = existingCategories.map(dish => {
      const match = dish.category.match(/\((\d+)\)$/);
      return match ? parseInt(match[1]) : 0;
    });

    const maxNumber = Math.max(...existingNumbers);
    const finalCategory = `${categoryName} (${maxNumber + 1})`;
    
    this._dishes.push({ category: finalCategory, products: [] });
    
    createCategory(finalCategory).catch(error => {
      console.error('Error creating category:', error);
      this._dishes = this._dishes.filter(dish => dish.category !== finalCategory);
    });
  };

  deleteCategoryLocal = (categoryName: string) => {
    this._dishes = this._dishes.filter(category => category.category !== categoryName);
    
    deleteCategory(categoryName).catch(error => {
      console.error('Error deleting category:', error);
      // В случае ошибки перезагружаем данные с сервера
      this.loadDishes();
    });
  };

  updateCategoryName = (oldName: string, newName: string) => {
    const category = this._dishes.find(cat => cat.category === oldName);
    if (category) {
      category.category = newName;
      
      updateCategory(oldName, newName).catch(error => {
        console.error('Error updating category:', error);
        category.category = oldName; // Откатываем изменения
      });
    }
  };

  addProduct = (categoryName: string) => {
    // Генерируем уникальный временный ID (отрицательное число, чтобы отличить от реальных ID)
    const tempId = -(Date.now() + Math.random() * 1000);
    
    const newProduct: DishProduct = {
      id: tempId,
      name: "Новый продукт",
      images: [],
      header: "Новый продукт",
      description: "",
      descriptionFull: "",
      weight: "",
      price: 0,
    };

    const category = this._dishes.find(cat => cat.category === categoryName);
    if (category) {
      category.products.push(newProduct);
      
      const createPromise = createDish(categoryName, newProduct).then(response => {
        // Заменяем временный ID на реальный
        const product = category.products.find(p => p.id === tempId);
        if (product) {
          product.id = response.id;
        }
        this._pendingCreates.delete(tempId);
        return response.id;
      }).catch((error: any) => {
        if (error?.response?.status === 413) {
          console.error('❌ File too large! Max size: 100MB');
          alert('Файл слишком большой! Максимальный размер: 100 МБ. Попробуйте загрузить файл меньшего размера или сжать его.');
        } else {
          console.error('Error creating dish:', error);
        }
        // Убираем продукт в случае ошибки
        category.products = category.products.filter(p => p.id !== tempId);
        this._pendingCreates.delete(tempId);
        throw error;
      });
      this._pendingCreates.set(tempId, createPromise);
    }
  };

  deleteProduct = (categoryName: string, productId: number) => {
    const category = this._dishes.find(cat => cat.category === categoryName);
    if (category) {
      const productIndex = category.products.findIndex(p => p.id === productId);
      const product = category.products[productIndex];
      
      if (product) {
        category.products.splice(productIndex, 1);
        
        // Если это временный ID (отрицательный), просто отменяем создание
        if (productId < 0) {
          if (this._pendingCreates.has(productId)) {
            this._pendingCreates.delete(productId);
          }
          return; // Не вызываем API для временных ID
        }
        
        // Для реальных ID вызываем API удаления
        deleteDish(productId).catch(error => {
          console.error('Error deleting dish:', error);
          // Возвращаем продукт обратно в случае ошибки
          category.products.splice(productIndex, 0, product);
        });
      }
    }
  };

  updateProduct = async (categoryName: string, productId: number, updatedData: Partial<DishProduct>) => {
    const category = this._dishes.find(cat => cat.category === categoryName);
    if (category) {
      const product = category.products.find(p => p.id === productId);
      if (product) {
        const oldData = { ...product };
        Object.assign(product, updatedData);
        try {
          // Если id временный (отрицательный) и создание ещё не завершено — дождаться
          if (productId < 0 && this._pendingCreates.has(productId)) {
            const realId = await this._pendingCreates.get(productId)!;
            await updateDish(categoryName, realId, updatedData);
            product.id = realId;
          } else if (productId < 0) {
            // Если почему-то промиса нет для временного ID, просто откатить и перезагрузить
            console.warn('Pending create not found for temp id, reloading dishes');
            await this.loadDishes();
          } else {
            // Для реальных ID просто обновляем
            await updateDish(categoryName, productId, updatedData);
          }
        } catch (error: any) {
          if (error?.response?.status === 413) {
            console.error('❌ File too large! Max size: 100MB');
            alert('Файл слишком большой! Максимальный размер: 100 МБ. Попробуйте загрузить файл меньшего размера или сжать его.');
          } else {
            console.error('Error updating dish:', error);
          }
          Object.assign(product, oldData);
        }
      }
    }
  };
}