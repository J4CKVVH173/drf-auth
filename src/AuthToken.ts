import {Auth} from "./types";
import {IUserConfig} from "communicate-api/build/src/communicate";
import {AxiosInstance} from 'axios';
import Communicate from "communicate-api";
import Cookie from "./Cookie";

export default class AuthToken extends Auth {
    private session: AxiosInstance;
    readonly authPath: string;
    readonly cookie: Cookie;

    constructor(userConfig?: IUserConfig, authPath: string = 'rest-auth') {
        super();
        this.authPath = authPath;
        this.session = new Communicate(userConfig).session;
        this.cookie = new Cookie();
    }

    async login(username: string, password: string): Promise<object> {
        const loginPath = 'login';
        const url = this.urlGenerate(this.authPath, loginPath);
        try {
            const {data} = await this.session.post(url, {username, password});
            this.cookie.setCookie("token", data.key, {"max-age": 2592000})
            this.setHeader(data.key)
            return data;
        } catch ({response}) {
            throw {
                data: response.data, status: response.status, statusText: response.statusText
            }
        }
    }

    logout(): void {
    }

    setHeader(token: string): void {
        this.session.defaults.headers.common['Authorization'] = `Token ${token}`;
    }

    deleteHeader(): void {
        delete (this.session.defaults.headers.common['Authorization']);
    }
}
