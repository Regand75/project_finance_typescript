import config from "../../config/config";
import {RefreshResponseType} from "../types/refresh-response.type";
import {UserInfoType} from "../types/user-info.type";

export class AuthUtils {
    static accessTokenKey: string = 'accessToken';
    static refreshTokenKey: string = 'refreshToken';
    static userInfoKey: string = 'userInfo';

    public static async processUnauthorizedResponse(): Promise<boolean> {
        let result: boolean = false;
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: refreshToken,
                }),
            });
            if (response && response.status === 200) {
                const token: RefreshResponseType = await response.json();
                if ('error' in token) {
                    // Ошибка
                    console.error('Ошибка обновления токена:', token.message);
                    if (token.validation && token.validation.length > 0) {
                        token.validation.forEach((validationError: {key: string, message: string}) =>
                            console.error(`Поле: ${validationError.key}, Ошибка: ${validationError.message}`)
                        );
                    }
                } else {
                    // Успешный ответ
                    this.setToken(token.tokens.accessToken, token.tokens.refreshToken);
                    result = true;
                }
            } else {
                console.error('Не удалось обновить токен:', response?.status ?? 'Нет ответа');
            }
        }
        if (!result) {
            this.removeToken();
            this.removeUserInfo();
            if (window.location.hash !== '#/login') {
                location.href = '#/login';
            }
        }
        return result;
    }

    public static setToken(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    public static removeToken(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    public static setUserInfo(info: string | { name: string; lastName: string; id: number }): void {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    public static getUserInfo(): UserInfoType | null {
        const userInfo: string | null = localStorage.getItem(this.userInfoKey);
        return userInfo ? JSON.parse(userInfo) as UserInfoType : null;
    }

    public static removeUserInfo(): void {
        localStorage.removeItem(this.userInfoKey);
    }
}