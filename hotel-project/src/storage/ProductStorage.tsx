import {makeAutoObservable} from "mobx"

// Определяем интерфейсы для данных
interface ProductType {
  id: number;
  name: string;
  // другие свойства
}

interface ProductClass {
  id: number;
  name: string;
  // другие свойства
}

interface Product {
  id: number;
  name: string;
  price: number;
  typeId: number;
  classId: number;
  description?: string;    // Описание блюда
  weight?: string;         // Вес блюда
  nutrients?: string;      // БЖУ (белки, жиры, углеводы)
  img?: string;           // Имя файла изображения
  header?: string;         // Заголовок продукта
  descriptionFull?: string; // Полное описание продукта
}

export default class ProductStorage {
  private _types: ProductType[] = [];
  private _clases: ProductClass[] = [];
  private _products: Product[] = [];
  private _selectedType: ProductType | Record<string, never> = {};
  private _selectedClase: ProductClass | Record<string, never> = {};

  constructor() {
    makeAutoObservable(this)
  }

  setTypes(types){
    this._types = types
  }
  setClases(clases){
    this._clases = clases
  }
  setProducts(products) {
    this._products = Array.isArray(products) ? products : []; // Ensure products is an array
  }

  setSelectedType(type) {
    this._selectedType = type
  }

  setSelectedClase(clase) {
    this._selectedClase = clase
  }

  get types(){
    return this._types
  }
  get clases() {
    return this._clases
  }
  get products() {
    return this._products
  }
  get selectedType() {
    return this._selectedType
  }
  get selectedClase() {
    return this._selectedClase
  }

}