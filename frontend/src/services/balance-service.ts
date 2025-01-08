import {HttpUtils} from "../utils/http-utils";
import config from "../../config/config";
import {BalanceResponseType} from "../types/balance-response.type";
import {ResultRequestType} from "../types/result-request.type";

export class BalanceService {
    public static async getBalance(): Promise<BalanceResponseType> {
        const result: ResultRequestType<BalanceResponseType> = await HttpUtils.request<BalanceResponseType>(config.host + '/balance');
        if (result.error) {
            if (result.response && 'error' in result.response && result.response.error) {
                console.log('Ошибка: ', result.response.message);
            }
            return false;
        } else if (
            result.response &&
            'balance' in result.response
        ) {
            return result.response; // Успешный ответ
        }
        alert('Возникла ошибка при запросе баланса. Обратитесь в поддержку');
        return false;
    }
}