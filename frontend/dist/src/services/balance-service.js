"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceService = void 0;
const http_utils_1 = require("../utils/http-utils");
const config_1 = __importDefault(require("../../config/config"));
class BalanceService {
    static async getBalance() {
        const result = await http_utils_1.HttpUtils.request(config_1.default.host + '/balance');
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        }
        else if (result.response &&
            'balance' in result.response) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при запросе баланса. Обратитесь в поддержку');
        return false;
    }
}
exports.BalanceService = BalanceService;
