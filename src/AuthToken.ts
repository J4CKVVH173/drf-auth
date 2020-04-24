import {Auth, IAuthConfig} from "./types";
import {AxiosInstance} from 'axios';
import Communicate from "communicate-api";
import {IUserConfig} from "communicate-api/build/src/communicate";

export default class AuthToken extends Auth {
    private TOKEN = 'Token';
    readonly authPath: string;

    session: AxiosInstance;

    constructor(authConfig?: IAuthConfig) {
        super();
        if (authConfig) {
            this.authPath = authConfig.authPath || 'rest-auth';
        } else {
            this.authPath = 'rest-auth';
        }
        this.session = new Communicate(authConfig ? authConfig.axiosConfig : undefined).session;
        // проверяем, если уже есть токен, то устанавливаем его
        if (this.hasToken()) {
            this.setHeader((localStorage.getItem(this.TOKEN) as string))
        }
    }

    /**
     * Метод производит аутенфикацию пользователя по логину и паролю и при успешной атенфикации,
     * сохраняет токен в localStorage и устанавливает в заголовок.
     * @param username - имя пользователя
     * @param password - пароль пользователя
     */
    async login(username: string, password: string): Promise<object> {
        const loginPath = 'login';
        const url = this.urlGenerate(this.authPath, loginPath);
        try {
            const {data} = await this.session.post(url, {username, password});
            this.setHeader(data.key);
            this.saveToken(data.key);
            return data;
        } catch ({response}) {
            throw {data: response.data, status: response.status, statusText: response.statusText};
        }
    }

    /**
     * Метод производит логаут для пользователя. Делает запрос на сервер для выхода пользователя,
     * Так же производит удаления токена из хедера и локал сторейдж.
     */
    async logout(): Promise<object> {
        const logoutPath = 'logout';
        const url = this.urlGenerate(this.authPath, logoutPath);
        try {
            const promise = this.session.post(url);
            const response = await promise;
            return {status: response.data, data: response.data};
        } catch ({response}) {
            throw {data: response.data, status: response.status, statusText: response.statusText};
        } finally {
            this.deleteHeader();
            this.deleteToken();
        }
    }

    /**
     * Метод устанавливает токен в заголовок запросов сессии.
     * @param token - токен который будет добален в сессию
     */
    private setHeader(token: string): void {
        this.session.defaults.headers.common['Authorization'] = `Token ${token}`;
    }

    /**
     * Метод удаляет токен из заголовков сессии.
     */
    private deleteHeader(): void {
        delete (this.session.defaults.headers.common['Authorization']);
    }

    /**
     * Метод сохраняет токен в локал сторейдже.
     * @param token - токен для сохранения
     */
    private saveToken(token: string): void {
        localStorage.setItem(this.TOKEN, token);
    }

    /**
     * Метод удаляет токен из локал сторейджа.
     */
    private deleteToken(): void {
        localStorage.removeItem(this.TOKEN);
    }

    /**
     * Метод производит проверку есть ли токен в локал сторайдже клиента.
     */
    hasToken(): boolean {
        return Boolean(localStorage.getItem(this.TOKEN));
    }
}
