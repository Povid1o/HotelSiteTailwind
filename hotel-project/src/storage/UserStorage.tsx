import { makeAutoObservable } from "mobx";
import { $authHost } from "../components/http";

// Определяем интерфейс для пользователя
interface User {
  id?: number;
  email?: string;
  // другие свойства пользователя
  [key: string]: any; // Позволяет добавлять другие произвольные свойства
}

export default class UserStorage {
  private _isAuth: boolean;
  private _user: User;

  constructor() {
    this._isAuth = localStorage.getItem("isAuth") === "true";
    this._user = JSON.parse(localStorage.getItem("user") || "{}");
    makeAutoObservable(this);
  }

  setIsAuth(bool: boolean) {
    this._isAuth = bool;
    localStorage.setItem("isAuth", bool.toString());
  }

  setUser(user: User) {
    this._user = user;
    localStorage.setItem("user", JSON.stringify(user));
  }

  logout() {
    this._isAuth = false;
    this._user = {};
    localStorage.removeItem("isAuth");
    localStorage.removeItem("user"); // Добавлено удаление информации о пользователе
  }

  get isAuth(): boolean {
    return this._isAuth;
  }

  get user(): User {
    return this._user;
  }

  // Проверяем валидность токена на backend и фиксируем флаг авторизации
  async checkAuth(): Promise<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      // Нет токена - значит пользователь не авторизован
      this.logout();
      return false;
    }
    
    try {
      await $authHost.get('api/user/auth');
      this.setIsAuth(true);
      return true;
    } catch (e: any) {
      // Токен невалиден или истек
      console.log('UserStorage.checkAuth: Token invalid or expired, logging out');
      this.logout();
      return false;
    }
  }
}