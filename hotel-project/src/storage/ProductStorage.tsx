import { makeAutoObservable } from "mobx";
import axios from "axios";

// интерфейсы можно вынести в отдельный файл
interface ProductType {
  id: number;
  name: string;
}

interface ProductClass {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  typeId: number;
  classId: number;
}

export default class ProductStorage {
  private _types: ProductType[] = [];
  private _clases: ProductClass[] = [];
  private _products: Product[] = [];
  private _selectedType: ProductType | Record<string, never> = {};
  private _selectedClase: ProductClass | Record<string, never> = {};

  private _isLoading = false;
  private _error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setTypes(types: ProductType[]) {
    this._types = types;
  }
  setClases(clases: ProductClass[]) {
    this._clases = clases;
  }
  setProducts(products: Product[]) {
    this._products = Array.isArray(products) ? products : [];
  }

  setSelectedType(type: ProductType) {
    this._selectedType = type;
  }

  setSelectedClase(clase: ProductClass) {
    this._selectedClase = clase;
  }

  setLoading(loading: boolean) {
    this._isLoading = loading;
  }

  setError(error: string | null) {
    this._error = error;
  }

  async loadProducts() {
    this.setLoading(true);
    this.setError(null);
    try {
      const response = await axios.get<Product[]>(`${process.env.REACT_APP_API_URL}/api/product`);
      this.setProducts(response.data);
    } catch (e: any) {
      console.error("Ошибка загрузки продуктов:", e);
      this.setError(e.message ?? "Ошибка загрузки продуктов");
    } finally {
      this.setLoading(false);
    }
  }

  async updateProduct(id: number, data: Partial<Product>) {
    try {
      const response = await axios.put<Product>(
          `${process.env.REACT_APP_API_URL}/api/product/${id}`,
          data
      );
      const updated = response.data;
      this.setProducts(
          this._products.map((p) => (p.id === id ? { ...p, ...updated } : p))
      );
    } catch (e) {
      console.error("Ошибка обновления продукта:", e);
    }
  }

  async deleteProduct(id: number) {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/product/${id}`);
      this.setProducts(this._products.filter((p) => p.id !== id));
    } catch (e) {
      console.error("Ошибка удаления продукта:", e);
    }
  }

  // геттеры
  get types() {
    return this._types;
  }
  get clases() {
    return this._clases;
  }
  get products() {
    return this._products;
  }
  get selectedType() {
    return this._selectedType;
  }
  get selectedClase() {
    return this._selectedClase;
  }
  get isLoading() {
    return this._isLoading;
  }
  get error() {
    return this._error;
  }
}
