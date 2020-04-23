import {IUserConfig} from "communicate-api/build/src/communicate";

export abstract class Auth {
    abstract login(username: string, password: string): Promise<object>;

    abstract logout(): void;

    abstract setHeader(token: string): void;

    abstract deleteHeader(): void;

    urlGenerate(...rest: string[]): string {
        let path: string = '';
        for (const pathPart of rest) {
            if (pathPart.slice(-1) === '/') path += pathPart;
            else path += pathPart + '/';
        }
        return path;
    }
}

export interface IAuthConfig extends IUserConfig {
    authPath?: string;
}

export interface ICookie {
    setCookie(name: string, value: string | number, options?: ICookieConf): void;

    getCookie(name: string): string | undefined;

    deleteCookie(name: string): void;
}

export interface ICookieConf {
    path?: string;
    domain?: string;
    expires?: string | Date;
    secure?: string;
    samesite?: string;
    ["max-age"]?: number;
}