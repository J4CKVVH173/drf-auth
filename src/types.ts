import {IUserConfig} from "communicate-api/build/src/communicate";

export abstract class Auth {
    abstract login(username: string, password: string): Promise<object>;
    abstract logout(): Promise<object>;

    abstract user(): Promise<object>;
}

export interface IAuthConfig {
    authPath?: string;
    axiosConfig?: IUserConfig;
}
