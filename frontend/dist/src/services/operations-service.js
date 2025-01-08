"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationsService = void 0;
const http_utils_1 = require("../utils/http-utils");
const config_1 = __importDefault(require("../../config/config"));
class OperationsService {
    static async getOperations(params = '') {
        const result = await http_utils_1.HttpUtils.request(config_1.default.host + '/operations' + params);
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        }
        else if (result.response &&
            'id' in result.response &&
            'type' in result.response &&
            'amount' in result.response &&
            'date' in result.response &&
            'comment' in result.response &&
            'category' in result.response) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при запросе операций. Обратитесь в поддержку');
        return false;
    }
    static async getOperation(params = '') {
        const result = await http_utils_1.HttpUtils.request(config_1.default.host + '/operations' + params);
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        }
        else if (result.response &&
            'id' in result.response &&
            'type' in result.response &&
            'amount' in result.response &&
            'date' in result.response &&
            'comment' in result.response &&
            'category' in result.response) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при запросе операции. Обратитесь в поддержку');
        return false;
    }
    static async updateOperation(param, data) {
        const result = await http_utils_1.HttpUtils.request(config_1.default.host + '/operations' + param, 'PUT', data);
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        }
        else if (result.response &&
            'id' in result.response &&
            'type' in result.response &&
            'amount' in result.response &&
            'date' in result.response &&
            'comment' in result.response &&
            'category' in result.response) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при обновлении операции. Обратитесь в поддержку');
        return false;
    }
    static async createOperation(data) {
        const result = await http_utils_1.HttpUtils.request(config_1.default.host + '/operations', 'POST', data);
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                if (result.status !== 400) {
                    console.log('Ошибка: ', result.response.message);
                }
                else if (result.status === 400) {
                    alert('Такая запись уже существует');
                }
            }
            return false;
        }
        else if (result.response &&
            'id' in result.response &&
            'type' in result.response &&
            'amount' in result.response &&
            'date' in result.response &&
            'comment' in result.response &&
            'category' in result.response) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при создании операции. Обратитесь в поддержку');
        return false;
    }
    static async deleteOperation(params = '') {
        const result = await http_utils_1.HttpUtils.request(config_1.default.host + '/operations' + params, 'DELETE');
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        }
        else if (result.response && !result.response.error) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при удалении операции. Обратитесь в поддержку');
        return false;
    }
    static async getCategories(params = '') {
        const result = await http_utils_1.HttpUtils.request(config_1.default.host + '/categories' + params);
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        }
        else if (result.response &&
            'id' in result.response &&
            'title' in result.response) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку');
        return false;
    }
    static async getCategory(params = '') {
        const result = await http_utils_1.HttpUtils.request(config_1.default.host + '/categories' + params);
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        }
        else if (result.response &&
            'id' in result.response &&
            'title' in result.response) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        return false;
    }
    static async createCategory(partPath, data) {
        const result = await http_utils_1.HttpUtils.request(config_1.default.host + '/categories' + partPath, 'POST', data);
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                if (result.status !== 400) {
                    console.log('Ошибка: ', result.response.message);
                }
                else if (result.status === 400) {
                    alert('Такая запись уже существует');
                }
            }
            return false;
        }
        else if (result.response &&
            'id' in result.response &&
            'title' in result.response) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при создании категории. Обратитесь в поддержку');
        return false;
    }
    static async updateCategory(partPath, data) {
        const result = await http_utils_1.HttpUtils.request(config_1.default.host + '/categories' + partPath, 'PUT', data);
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        }
        else if (result.response &&
            'id' in result.response &&
            'title' in result.response) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при обновлении категории. Обратитесь в поддержку');
        return false;
    }
    static async deleteCategory(params = '') {
        const result = await http_utils_1.HttpUtils.request(config_1.default.host + '/categories' + params, 'DELETE');
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        }
        else if (result.response && !result.response.error) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при удалении категории. Обратитесь в поддержку');
        return false;
    }
}
exports.OperationsService = OperationsService;
