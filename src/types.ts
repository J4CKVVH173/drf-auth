import {IUserConfig} from "communicate-api/build/src/communicate";

export abstract class Auth {
    abstract login(username: string, password: string): Promise<object>;

    abstract logout(): Promise<object>;

    urlGenerate(...rest: string[]): string {
        let path: string = '';
        for (const pathPart of rest) {
            if (pathPart.slice(-1) === '/') path += pathPart;
            else path += pathPart + '/';
        }
        return path;
    }
}

export interface IAuthConfig {
    authPath?: string;
    axiosConfig?: IUserConfig;
}
