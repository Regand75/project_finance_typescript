import {HttpUtils} from "../utils/http-utils";
import config from "../../config/config";
import {
    OperationRequest,
    OperationResponseType,
    OperationsResponseType
} from "../types/operations-response.type";
import {ResultRequestType} from "../types/result-request.type";

export class OperationsService {

    public static async getOperations(params: string = ''): Promise<OperationsResponseType> {
        const result: ResultRequestType<OperationsResponseType> = await HttpUtils.request<OperationsResponseType>(config.host + '/operations' + params);
        if (result.redirect || result.error || !result.response) {
            if ('error' in result) {
                console.log('Ошибка: ', result.message);
                if (result.validation && result.validation.length > 0) {
                    result.validation.forEach((validationError: { key: string, message: string }) =>
                        console.error(`Поле: ${validationError.key}, Ошибка: ${validationError.message}`)
                    );
                }
            }
            return false;
        }
        if (
            result.response &&
            'id' in result.response &&
            'type' in result.response &&
            'amount' in result.response &&
            'date' in result.response &&
            'comment' in result.response &&
            'category' in result.response
        ) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при запросе операций. Обратитесь в поддержку');
        return false;
    }

    public static async getOperation(params: string = ''): Promise<OperationResponseType> {
        const result: ResultRequestType<OperationResponseType> = await HttpUtils.request<OperationResponseType>(config.host + '/operations' + params);
        if (result.redirect || result.error || !result.response) {
            if ('error' in result) {
                console.log('Ошибка: ', result.message);
                if (result.validation && result.validation.length > 0) {
                    result.validation.forEach((validationError: { key: string, message: string }) =>
                        console.error(`Поле: ${validationError.key}, Ошибка: ${validationError.message}`)
                    );
                }
            }
            return false;
        }
        if (
            result.response &&
            'id' in result.response &&
            'type' in result.response &&
            'amount' in result.response &&
            'date' in result.response &&
            'comment' in result.response &&
            'category' in result.response
        ) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при запросе операции. Обратитесь в поддержку');
        return false;
    }

    public static async updateOperation(param: string, data: OperationRequest): Promise<OperationResponseType> {
        const result: ResultRequestType<OperationResponseType> = await HttpUtils.request<OperationResponseType>(config.host + '/operations' + param, 'PUT', data);
        if (result.redirect || result.error || !result.response) {
            if ('error' in result) {
                console.log('Ошибка: ', result.message);
                if (result.validation && result.validation.length > 0) {
                    result.validation.forEach((validationError: { key: string, message: string }) =>
                        console.error(`Поле: ${validationError.key}, Ошибка: ${validationError.message}`)
                    );
                }
                return false;
            }
            if (
                result.response &&
                'id' in result.response &&
                'type' in result.response &&
                'amount' in result.response &&
                'date' in result.response &&
                'comment' in result.response &&
                'category' in result.response
            ) {
                return result.response; // Успешный ответ
            }
        }
        alert('Возникла ошибка при обновлении операции. Обратитесь в поддержку');
        return false;
    }

    public static async createOperation(data: OperationRequest): Promise<void> {
        const result = await HttpUtils.request(config.host + '/operations', 'POST', data);
        if (result.redirect || result.error || !result.response) {
            if (result.status !== 400) {
                return alert('Возникла ошибка при создании операции. Обратитесь в поддержку');
            } else if (result.status === 400) {
                return alert('Такая запись уже существует');
            }
        }
        return result.response;
    }

    public static async deleteOperation(params = ''): Promise<void> {
        const result = await HttpUtils.request(config.host + '/operations' + params, 'DELETE');
        if (result.redirect || result.error || !result.response) {
            return alert('Возникла ошибка при удалении операции. Обратитесь в поддержку');
        }
        return result.response;
    }

    public static async getCategories(params = '') {
        const result = await HttpUtils.request(config.host + '/categories' + params);
        if (result.redirect || result.error || !result.response) {
            return alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку');
        }
        return result.response;
    }

    public static async getCategory(params = '') {
        const result = await HttpUtils.request(config.host + '/categories' + params);
        if (result.redirect || result.error || !result.response) {
            return alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        }
        return result.response;
    }

    public static async createCategory(partPath, data) {
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

    public static async updateCategory(partPath, data) {
        const result = await HttpUtils.request(config.host + '/categories' + partPath, 'PUT', data);
        if (result.redirect || result.error || !result.response) {
            return alert('Возникла ошибка при обновлении категории. Обратитесь в поддержку');
        }
        return result.response;
    }

    public static async deleteCategory(params = '') {
        const result = await HttpUtils.request(config.host + '/categories' + params, 'DELETE');
        if (result.redirect || result.error || !result.response) {
            return alert('Возникла ошибка при удалении категории. Обратитесь в поддержку');
        }
        return result.response;
    }
}