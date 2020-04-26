/**
 * Класс для реализации ввспомогательных методов для работы с URL.
 */
export class Url {
    /**
     * Метод для генерации урла на основании переданных аргументов.
     * @param rest - массив строк, который будет соединен в url
     */
    urlPathGenerate(...rest: string[]): string {
        let path: string = '';
        for (const pathPart of rest) {
            if (pathPart.slice(-1) === '/') path += pathPart;
            else path += pathPart + '/';
        }
        return path;
    }
}
