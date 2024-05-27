import {makeAutoObservable} from "mobx"

export default class ProductStorage{
  constructor(){
    this._types = []
    this._clases =[]

    this._products =[
      {id:1, name:'Кофе', price:100, img:"0166f489-c968-46dc-8a0f-6c8d9fa29283.png" },
      {id:2, name:'Чай', price:200, img:"https://i.imgur.com/jJBWmPu.png"},
      {id:3, name:'булка', price:100, img:"https://i.imgur.com/jJBWmPu.png"},
      {id:4, name:'торт', price:200, img:"https://i.imgur.com/jJBWmPu.png"},
      {id:5, name:'DELUXROOM', price:100, img:"https://i.imgur.com/jJBWmPu.png", typeid:1, claseid:1},
      {id:6, name:'Room', price:200, img:"https://i.imgur.com/jJBWmPu.png"},
    ]
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
  setProduct(products){
    this._products = products
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