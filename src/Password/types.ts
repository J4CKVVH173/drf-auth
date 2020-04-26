import {AxiosInstance} from 'axios';
import {Url} from "../utils/Url";

export interface IPassword {
    reset(email: string): Promise<object>;

    change(newPass1: string, newPass2: string): Promise<Object>;

    confirm(uid: string, token: string, newPass1: string, newPass2: string): Promise<Object>;
}

export interface IPasswordConstructor {
    session: AxiosInstance;
    authPath: string;
}
