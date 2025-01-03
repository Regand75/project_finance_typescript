import {HttpUtils} from "../utils/http-utils.js";
import config from "../../config/config.js";

export class OperationsService {

    static async getOperations(params = '') {
        const result = await HttpUtils.request(config.host + '/operations' + params);
        if (result.redirect || result.error || !result.response) {
            return alert('Возникла ошибка при запросе операций. Обратитесь в поддержку');
        }
        return result.response;
    }

    static async getOperation(params = '') {
        const result = await HttpUtils.request(config.host + '/operations' + params);
        if (result.redirect || result.error || !result.response) {
            return alert('Возникла ошибка при запросе операции. Обратитесь в поддержку');
        }
        return result.response;
    }

    static async updateOperation(param, data) {
        const result = await HttpUtils.request(config.host + '/operations' + param, 'PUT', data);
        if (result.redirect || result.error || !result.response) {
            return alert('Возникла ошибка при обновлении операции. Обратитесь в поддержку');
        }
        return result.response;
    }

    static async createOperation(data) {
        const result = await HttpUtils.request(config.host + '/operations', 'POST', data);
        if (result.redirect || result.error || !result.response) {
            if (result.status !== 400) {
                return alert('Возникла ошибка при создании операции. Обратитесь в поддержку');
            } else if (result.status !== 400) {
                return alert('Такая запись уже существует');
            }
        }
        return result.response;
    }

    static async deleteOperation(params = '') {
        const result = await HttpUtils.request(config.host + '/operations' + params, 'DELETE');
        if (result.redirect || result.error || !result.response) {
            return alert('Возникла ошибка при удалении операции. Обратитесь в поддержку');
        }
        return result.response;
    }

    static async getCategories(params = '') {
        const result = await HttpUtils.request(config.host + '/categories' + params);
        if (result.redirect || result.error || !result.response) {
            return alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку');
        }
        return result.response;
    }

    static async getCategory(params = '') {
        const result = await HttpUtils.request(config.host + '/categories' + params);
        if (result.redirect || result.error || !result.response) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }
        return result.response;
    }

    static async createCategory(partPath, data) {
        const result = await HttpUtils.request(config.host + '/categories' + partPath, 'POST', data);
        if (result.redirect || result.error || !result.response) {
            if (result.status !== 400) {
                return alert('Возникла ошибка при создании категории. Обратитесь в поддержку');
            } else if (result.status === 400) {
                return alert('Такая запись уже существует');
            }
        }
        return result.response;
    }

    static async updateCategory(partPath, data) {
        const result = await HttpUtils.request(config.host + '/categories' + partPath, 'PUT', data);
        if (result.redirect || result.error || !result.response) {
            return alert('Возникла ошибка при обновлении категории. Обратитесь в поддержку');
        }
        return result.response;
    }

    static async deleteCategory(params = '') {
        const result = await HttpUtils.request(config.host + '/categories' + params, 'DELETE');
        if (result.redirect || result.error || !result.response) {
            return alert('Возникла ошибка при удалении категории. Обратитесь в поддержку');
        }
        return result.response;
    }
}