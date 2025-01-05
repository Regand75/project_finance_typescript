import {HttpUtils} from "../utils/http-utils";
import config from "../../config/config";
import {LoginResponseType, SignupResponseType} from "../types/auth-response.type";
import {ResultRequestType} from "../types/result-request.type";

export class AuthService {

    public static async login(data: any): Promise<LoginResponseType> {
        const result: ResultRequestType<LoginResponseType> = await HttpUtils.request<LoginResponseType>(config.host + '/login', 'POST', data);
        if (result.error || !result.response) {
            if ('error' in result) {
                console.log('Ошибка: ', result.message);
                if (result.validation && result.validation.length > 0) {
                    result.validation.forEach((validationError: {key: string, message: string}) =>
                        console.error(`Поле: ${validationError.key}, Ошибка: ${validationError.message}`)
                    );
                }
            }
            return;
        }
        if ('tokens' in result.response && 'user' in result.response) {
            if (
                result.response.tokens.accessToken &&
                result.response.tokens.refreshToken &&
                result.response.user.name &&
                result.response.user.lastName &&
                result.response.user.id
            ) {
                return result.response; // Успешный ответ
            }
        }
        return;
    }

    public static async signup(data: any): Promise<SignupResponseType> {
        const result: ResultRequestType<SignupResponseType> = await HttpUtils.request<SignupResponseType>(config.host + '/signup', 'POST', data);
        if (result.error || !result.response) {
            if ('error' in result) {
                console.log('Ошибка: ', result.message);
                if (result.validation && result.validation.length > 0) {
                    result.validation.forEach((validationError: {key: string, message: string}) =>
                        console.error(`Поле: ${validationError.key}, Ошибка: ${validationError.message}`)
                    );
                }
            }
            return;
        }
        if ('user' in result.response) {
            if (
                result.response.user.id &&
                result.response.user.email &&
                result.response.user.name &&
                result.response.user.lastName
            ) {
                return result.response; // Успешный ответ
            }
        }
        return;
    }

    public static async logOut(data: any): Promise<void> {
        await HttpUtils.request(config.host + '/logout', 'POST', data);
    }
}