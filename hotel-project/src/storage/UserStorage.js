import { makeAutoObservable } from "mobx";


export default class UserStorage {
  constructor() {
    this._isAuth = localStorage.getItem("isAuth") === "true";
    this._user = JSON.parse(localStorage.getItem("user") || "{}");
    makeAutoObservable(this);
  }

  setIsAuth(bool) {
    this._isAuth = bool;
    localStorage.setItem("isAuth", bool.toString());
  }

  setUser(user) {
    this._user = user;
    localStorage.setItem("user", JSON.stringify(user));
  }

  logout() {
    this._isAuth = false;
    this._user = {};
    localStorage.removeItem("isAuth");
    
  }

  get isAuth() {
    return this._isAuth;
  }

  get user() {
    return this._user;
  }
}