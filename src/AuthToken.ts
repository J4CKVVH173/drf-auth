import {Auth, IAuthConfig} from "./types";
import {AxiosInstance} from 'axios';
import Communicate from "communicate-api";
import {LocalStorage} from "./utils/LocalStorage";
import {Headers} from "./utils/Headers";

export default class AuthToken extends Auth {
    readonly authPath: string;

    session: AxiosInstance;
    headers: Headers;
    localStorage: LocalStorage;

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

        // проверяем, если уже есть токен, то устанавливаем его
        if (this.localStorage.hasToken()) {
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
        const url = this.urlGenerate(this.authPath, loginPath);
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
        const url = this.urlGenerate(this.authPath, logoutPath);
        try {
            const promise = this.session.post(url);
            const response = await promise;
            return {status: response.data, data: response.data};
        } catch ({response}) {
            throw {data: response.data, status: response.status, statusText: response.statusText};
        } finally {
            this.headers.deleteTokenHeader();
            this.localStorage.deleteToken();
        }
    }
}
