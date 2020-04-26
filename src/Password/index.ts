import {AxiosInstance} from 'axios';
import {IPassword, IPasswordConstructor} from "./types";

import {Url} from "../utils/Url";

export class Password implements IPassword {
    private url: Url;
    private session: AxiosInstance;
    private authPath: string;
    private passwordPath: string;

    constructor(settings: IPasswordConstructor) {
        this.url = new Url();
        this.session = settings.session;
        this.authPath = settings.authPath;
        this.passwordPath = 'password';
    }

    /**
     * Метод для смены пароля (пользователь должен быть зарегестрирова)
     * @param newPass1 - новый пароль
     * @param newPass2 - повторно новый пароль
     */
    async change(newPass1: string, newPass2: string): Promise<object> {
        const changePath = 'change';
        const url = this.url.urlPathGenerate(this.authPath, this.passwordPath, changePath);
        try {
            const response = await this.session.post(url, {'new_password1': newPass1, 'new_password2': newPass2});
            return {status: response.status, data: response.data};
        } catch ({response}) {
            throw {data: response.data, status: response.status, statusText: response.statusText};
        }
    }

    /**
     * Метод для сброса пароля по адресу почтовой почты
     * @param email - имейл, по которому будет сброшен пароль и на который будет отправлено сообщение  сновым паролем
     */
    async reset(email: string): Promise<object> {
        const resetPath = 'reset';
        const url = this.url.urlPathGenerate(this.authPath, this.passwordPath, resetPath);
        try {
            const response = await this.session.post(url, {email});
            return {status: response.status, data: response.data};
        } catch ({response}) {
            throw {data: response.data, status: response.status, statusText: response.statusText};
        }
    }

    /**
     * Метод для установки нового пароля после его сброса. uid и token придут на email на котором был произведен сброс.
     * @param uid - uid сброшенного аккаунта
     * @param token - токен сброшенного акаунта
     * @param newPass1 - новый пароль
     * @param newPass2 - подтверждение нового пароля
     */
    async confirm(uid: string, token: string, newPass1: string, newPass2: string): Promise<Object> {
        const resetPath = 'reset';
        const confirmPath = 'confirm';
        const url = this.url.urlPathGenerate(this.authPath, this.passwordPath, resetPath, confirmPath);
        try {
            const response = await this.session.post(url, {
                uid,
                token,
                'new_password1': newPass1,
                'new_password2': newPass2
            });
            return {status: response.status, data: response.data};
        } catch ({response}) {
            throw {data: response.data, status: response.status, statusText: response.statusText};
        }
    }
}
