import {makeAutoObservable} from "mobx"

export default class ProductStorage{
  constructor(){
    this._types = []
    this._clases =[]

    this._products =[]
    this._selectedType = {}
    this._selectedClase ={}
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