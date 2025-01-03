import config from "../../config/config.js";

export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static async processUnauthorizedResponse() {
        let result = false;
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/refresh', {
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
                const token = await response.json();
                if (token && !token.error) {
                    this.setToken(token.tokens.accessToken, token.tokens.refreshToken);
                    result = true;
                }
            } else {
                console.error('Не удалось обновить токен:', response.status);
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

    static setToken(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    static removeToken() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    static setUserInfo(info) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    static getUserInfo() {
        const userInfo = localStorage.getItem(this.userInfoKey);
        return userInfo ? JSON.parse(userInfo) : null;
    }

    static removeUserInfo() {
        localStorage.removeItem(this.userInfoKey);
    }
}