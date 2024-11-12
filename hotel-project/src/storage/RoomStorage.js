import {makeAutoObservable} from "mobx"

export default class RoomStorage{
  constructor(){
    this._types = []
    this._clases =[]

    this._rooms =[]
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
  setRooms(rooms) {
    this._rooms = Array.isArray(rooms) ? rooms : [];
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
  get rooms() {
    return this._rooms
  }
  get selectedType() {
    return this._selectedType
  }
  get selectedClase() {
    return this._selectedClase
  }

}