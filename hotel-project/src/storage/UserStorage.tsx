import { makeAutoObservable } from "mobx";
import { $authHost } from "../components/http";
import { logout as requestLogout } from "../components/http/userAPI";

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
    this.clearLocalSession();
    void requestLogout().catch(() => undefined);
  }

  // Used when the server already reported that there is no session: asking it
  // to log out as well would only produce a rejected request for every guest.
  clearLocalSession() {
    this._isAuth = false;
    this._user = {};
    localStorage.removeItem("isAuth");
    localStorage.removeItem("user");
  }

  get isAuth(): boolean {
    return this._isAuth;
  }

  get user(): User {
    return this._user;
  }

  // Проверяем валидность токена на backend и фиксируем флаг авторизации
  async checkAuth(): Promise<boolean> {
    try {
      const { data } = await $authHost.get('api/user/auth', { skipAuthRedirect: true } as any);
      this.setUser(data);
      this.setIsAuth(true);
      return true;
    } catch (e: any) {
      // Только 401 означает, что сессии нет. Сетевой сбой на телефоне не
      // должен выбрасывать администратора из панели.
      if (e?.response?.status === 401) this.clearLocalSession();
      return false;
    }
  }
}
