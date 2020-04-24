import {AxiosInstance} from 'axios';

export interface IHeaders {
    session: AxiosInstance;

    setTokenHeader(token: string): void;

    deleteTokenHeader(): void;
}
