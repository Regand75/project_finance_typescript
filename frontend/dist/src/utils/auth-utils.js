"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUtils = void 0;
const config_1 = __importDefault(require("../../config/config"));
class AuthUtils {
    static async processUnauthorizedResponse() {
        var _a;
        let result = false;
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config_1.default.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: refreshToken,
                }),
            });
            if (response && response.ok) {
                const token = await response.json();
                if ('tokens' in token) {
                    this.setToken(token.tokens.accessToken, token.tokens.refreshToken);
                    result = true;
                }
            }
            else {
                console.error('Не удалось обновить токен:', (_a = response === null || response === void 0 ? void 0 : response.status) !== null && _a !== void 0 ? _a : 'Нет ответа');
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
exports.AuthUtils = AuthUtils;
AuthUtils.accessTokenKey = 'accessToken';
AuthUtils.refreshTokenKey = 'refreshToken';
AuthUtils.userInfoKey = 'userInfo';
