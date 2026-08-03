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
import { STATIC_BASE } from '../components/http';

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
  private _productSaveQueues = new Map<number, Promise<void>>();
  private _savingProductIds = new Set<number>();
  private _productSaveErrors = new Map<number, string>();
  private _productSaveVersions = new Map<number, number>();

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

  isSavingProduct(productId: number): boolean {
    return this._savingProductIds.has(productId);
  }

  getProductSaveError(productId: number): string | null {
    return this._productSaveErrors.get(productId) || null;
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
      void createPromise.catch(() => undefined);
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

  updateProduct = (categoryName: string, productId: number, updatedData: Partial<DishProduct>) => {
    const category = this._dishes.find(cat => cat.category === categoryName);
    const product = category?.products.find(p => p.id === productId);
    if (!product) return Promise.resolve();

    const oldData = { ...product };
    const version = (this._productSaveVersions.get(productId) || 0) + 1;
    const pendingCreate = productId < 0 ? this._pendingCreates.get(productId) : undefined;
    this._productSaveVersions.set(productId, version);
    this._productSaveErrors.delete(productId);
    Object.assign(product, updatedData);
    this._dishes = [...this._dishes];

    const previousSave = this._productSaveQueues.get(productId) || Promise.resolve();
    this._savingProductIds.add(productId);
    const save = previousSave
      .catch(() => undefined)
      .then(async () => {
        try {
          const realId = pendingCreate ? await pendingCreate : product.id;
          if (realId < 0) throw new Error('Создание блюда ещё не завершено');
          const response = await updateDish(categoryName, realId, updatedData);
          if (this._productSaveVersions.get(productId) === version) {
            Object.assign(product, {
              id: response.id,
              name: response.name,
              header: response.header ?? '',
              description: response.description_short ?? '',
              descriptionFull: response.description_full ?? '',
              weight: response.weight ?? '',
              price: Number(response.price) || 0,
              images: (response.images || []).map((image: any) => {
                const url = image?.url || '';
                return url.startsWith('/static/') ? `${STATIC_BASE}${url}` : url;
              }).filter(Boolean),
            });
            this._dishes = [...this._dishes];
          }
        } catch (error: any) {
          const message = error?.response?.data?.message || error?.message || 'Не удалось сохранить блюдо';
          console.error('Error updating dish:', error);
          if (this._productSaveVersions.get(productId) === version) {
            Object.assign(product, oldData);
            this._dishes = [...this._dishes];
            this._productSaveErrors.set(productId, message);
          }
        }
      });

    this._productSaveQueues.set(productId, save);
    void save.finally(() => {
      if (this._productSaveQueues.get(productId) === save) {
        this._productSaveQueues.delete(productId);
        this._savingProductIds.delete(productId);
      }
    });
    return save;
  };
}
