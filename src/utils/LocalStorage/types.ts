export interface ILocalStorage {
    readonly TOKEN: string;

    deleteToken(): void;

    saveToken(token: string): void;

    getToken(): string | null;

    checkToken(): boolean;
}