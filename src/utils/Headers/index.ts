import {IHeaders} from "./types";
import {AxiosInstance} from "axios";

export class Headers implements IHeaders {
    session: AxiosInstance;

    constructor(session: AxiosInstance) {
        this.session = session; // получаем локальную ссылку на объект сессии
    }

    /**
     * Метод устанавливает токен в заголовок запросов сессии.
     * @param token - токен который будет добален в сессию
     */
    setTokenHeader(token: string): void {
        this.session.defaults.headers.common['Authorization'] = `Token ${token}`;
    }

    /**
     * Метод удаляет токен из заголовков сессии.
     */
    deleteTokenHeader(): void {
        delete (this.session.defaults.headers.common['Authorization']);
    }
}
