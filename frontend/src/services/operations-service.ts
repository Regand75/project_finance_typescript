import {HttpUtils} from "../utils/http-utils";
import config from "../config/config";
import {
    OperationRequest,
    OperationResponseType, OperationsErrorResponse,
    OperationsResponseType, OperationsSuccessResponse
} from "../types/operations-response.type";
import {ResultRequestType} from "../types/result-request.type";
import {
    CategoriesResponseType, CategoryErrorResponse,
    CategoryRequest,
    CategoryResponseType, CategorySuccessResponse
} from "../types/categories-response.type";

export class OperationsService {

    public static async getOperations(params: string = ''): Promise<OperationsResponseType> {
        const result: ResultRequestType<OperationsResponseType> = await HttpUtils.request<OperationsResponseType>(config.host + '/operations' + params);
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        } else if (
            result.response &&
            'id' in result.response &&
            'type' in result.response &&
            'amount' in result.response &&
            'date' in result.response &&
            'comment' in result.response &&
            'category' in result.response
        ) {
            return result.response; // Успешный ответ
        } else  if ((result.response as OperationsSuccessResponse[]).length === 0) {
            return (result.response as OperationsSuccessResponse[]);
        }
        alert('Возникла ошибка при запросе операций. Обратитесь в поддержку');
        return false;
    }

    public static async getOperation(params: string = ''): Promise<OperationResponseType> {
        const result: ResultRequestType<OperationResponseType> = await HttpUtils.request<OperationResponseType>(config.host + '/operations' + params);
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        } else if (
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
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        } else if (
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
        alert('Возникла ошибка при обновлении операции. Обратитесь в поддержку');
        return false;
    }

    public static async createOperation(data: OperationRequest): Promise<OperationResponseType> {
        const result: ResultRequestType<OperationResponseType> = await HttpUtils.request<OperationResponseType>(config.host + '/operations', 'POST', data);
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                if (result.status !== 400){
                    console.log('Ошибка: ', result.response.message);
                } else if (result.status === 400) {
                    alert('Такая запись уже существует');
                }
            }
            return false;
        } else if (
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
        alert('Возникла ошибка при создании операции. Обратитесь в поддержку');
        return false;
    }

    public static async deleteOperation(params: string = ''): Promise<OperationsErrorResponse | false> {
        const result: ResultRequestType<OperationsErrorResponse> = await HttpUtils.request<OperationsErrorResponse>(config.host + '/operations' + params, 'DELETE');
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        } else if (result.response && !result.response.error){
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при удалении операции. Обратитесь в поддержку');
        return false;
    }

    public static async getCategories(params: string = ''): Promise<CategoriesResponseType> {
        const result: ResultRequestType<CategoriesResponseType> = await HttpUtils.request<CategoriesResponseType>(config.host + '/categories' + params);
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        } else if (
            result.response &&
            'id' in result.response &&
            'title' in result.response
        ) {
            return result.response; // Успешный ответ
        } else  if ((result.response as CategorySuccessResponse[]).length === 0) {
            return (result.response as CategorySuccessResponse[]);
        }
        alert('Возникла ошибка при запросе категорий. Обратитесь в поддержку');
        return false;
    }

    public static async getCategory(params: string = ''): Promise<CategoryResponseType> {
        const result: ResultRequestType<CategoryResponseType> = await HttpUtils.request<CategoryResponseType>(config.host + '/categories' + params);
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        } else if (
            result.response &&
            'id' in result.response &&
            'title' in result.response
        ) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при запросе категории. Обратитесь в поддержку');
        return false;
    }

    public static async createCategory(partPath: string, data: CategoryRequest): Promise<CategoryResponseType> {
        const result: ResultRequestType<CategoryResponseType> = await HttpUtils.request<CategoryResponseType>(config.host + '/categories' + partPath, 'POST', data);
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                if (result.status !== 400){
                    console.log('Ошибка: ', result.response.message);
                } else if (result.status === 400) {
                    alert('Такая запись уже существует');
                }
            }
            return false;
        } else if (
            result.response &&
            'id' in result.response &&
            'title' in result.response
        ) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при создании категории. Обратитесь в поддержку');
        return false;
    }

    public static async updateCategory(partPath: string, data: CategoryRequest): Promise<CategoryResponseType> {
        const result: ResultRequestType<CategoryResponseType> = await HttpUtils.request<CategoryResponseType>(config.host + '/categories' + partPath, 'PUT', data);
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        } else if (
            result.response &&
            'id' in result.response &&
            'title' in result.response
        ) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при обновлении категории. Обратитесь в поддержку');
        return false;
    }

    public static async deleteCategory(params = ''): Promise<CategoryErrorResponse | false> {
        const result: ResultRequestType<CategoryErrorResponse> = await HttpUtils.request<CategoryErrorResponse>(config.host + '/categories' + params, 'DELETE');
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        } else if (result.response && !result.response.error){
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при удалении категории. Обратитесь в поддержку');
        return false;
    }
}