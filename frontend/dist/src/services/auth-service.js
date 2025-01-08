"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_utils_1 = require("../utils/http-utils");
const config_1 = __importDefault(require("../../config/config"));
class AuthService {
    static async login(data) {
        const result = await http_utils_1.HttpUtils.request(config_1.default.host + '/login', 'POST', data);
        if (result.error) {
            if (result.response && 'error' in result.response) {
                this.logError(result.response);
            }
            return false;
        }
        else if (result.response && 'tokens' in result.response && 'user' in result.response) {
            if (result.response.tokens.accessToken &&
                result.response.tokens.refreshToken &&
                result.response.user.name &&
                result.response.user.lastName &&
                result.response.user.id) {
                return result.response; // Успешный ответ
            }
        }
        return false;
    }
    static async signup(data) {
        const result = await http_utils_1.HttpUtils.request(config_1.default.host + '/signup', 'POST', data);
        if (result.error) {
            if (result.response && 'error' in result.response) {
                this.logError(result.response);
            }
            return false;
        }
        else if (result.response && 'user' in result.response) {
            if (result.response.user.id &&
                result.response.user.email &&
                result.response.user.name &&
                result.response.user.lastName) {
                return result.response; // Успешный ответ
            }
        }
        return false;
    }
    static async logOut(data) {
        await http_utils_1.HttpUtils.request(config_1.default.host + '/logout', 'POST', data);
    }
    static logError(response) {
        var _a;
        console.log('Ошибка: ', response.message);
        if (((_a = response.validation) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            response.validation.forEach((validationError) => console.error(`Поле: ${validationError.key}, Ошибка: ${validationError.message}`));
        }
    }
}
exports.AuthService = AuthService;
