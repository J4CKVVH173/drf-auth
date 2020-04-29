import {Auth, IAuthConfig} from "./types";
import {AxiosInstance} from 'axios';

import Communicate from "communicate-api";

import {LocalStorage} from "./utils/LocalStorage";
import {Headers} from "./utils/Headers";
import {Url} from "./utils/Url";
import {Password} from "./Password";

/**
 * Класс предоставляет интерфейс взаимодействия с библиотекой `django-rest-auth`.
 */
export default class DRFAuth extends Auth {
    readonly authPath: string;

    readonly session: AxiosInstance;
    readonly password: Password;

    private headers: Headers;
    private localStorage: LocalStorage;
    private url: Url;

    constructor(authConfig?: IAuthConfig) {
        super();
        if (authConfig) {
            this.authPath = authConfig.authPath || 'rest-auth';
        } else {
            this.authPath = 'rest-auth';
        }

        this.session = new Communicate(authConfig ? authConfig.axiosConfig : undefined).session;
        this.localStorage = new LocalStorage();
        this.headers = new Headers(this.session);
        this.url = new Url();
        this.password = new Password({session: this.session, authPath: this.authPath});

        // проверяем, если уже есть токен, то устанавливаем его
        if (this.localStorage.checkToken()) {
            this.headers.setTokenHeader((this.localStorage.getToken() as string))
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
        const url = this.url.urlPathGenerate(this.authPath, loginPath);
        try {
            const {data} = await this.session.post(url, {username, password});
            this.headers.setTokenHeader(data.key);
            this.localStorage.saveToken(data.key);
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
        const url = this.url.urlPathGenerate(this.authPath, logoutPath);
        try {
            const response = await this.session.post(url);
            return {status: response.status, data: response.data};
        } catch ({response}) {
            throw {data: response.data, status: response.status, statusText: response.statusText};
        } finally {
            this.headers.deleteTokenHeader();
            this.localStorage.deleteToken();
        }
    }

    /**
     * Метод для получения информации о пользователи по токену. (Токен должен быть уже установлен в заголовке)
     */
    async user(): Promise<object> {
        const userPath = 'user';
        const url = this.url.urlPathGenerate(this.authPath, userPath);
        try {
            const response = await this.session.get(url);
            return {status: response.status, data: response.data};
        } catch ({response}) {
            throw {data: response.data, status: response.status, statusText: response.statusText};
        }
    }
}
