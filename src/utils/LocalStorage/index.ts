import {ILocalStorage} from "./types";

/**
 * Класс для взаимодействия с локал стореджем.
 */
export class LocalStorage implements ILocalStorage {
    readonly TOKEN: string;

    constructor(tokenName: string = 'Token') {
        this.TOKEN = tokenName;
    }

    /**
     * Метод сохраняет токен в локал сторейдже.
     * @param token - токен для сохранения
     */
    saveToken(token: string): void {
        localStorage.setItem(this.TOKEN, token);
    }

    /**
     * Метод удаляет токен из локал сторейджа.
     */
    deleteToken(): void {
        localStorage.removeItem(this.TOKEN);
    }

    /**
     * Метод получения токена из локал сторейджа.
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN);
    }

    /**
     * Метод проверяет наличие токена в localStorage.
     */
    checkToken(): boolean {
        return Boolean(localStorage.getItem(this.TOKEN));
    }
}
