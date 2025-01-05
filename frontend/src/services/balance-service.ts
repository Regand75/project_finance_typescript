import {HttpUtils} from "../utils/http-utils";
import config from "../../config/config";

export class BalanceService {
    static async getBalance() {
        const result = await HttpUtils.request(config.host + '/balance');
        if (result.redirect || result.error || !result.response) {
            return alert('Возникла ошибка при запросе баланса. Обратитесь в поддержку');
        }
        return result.response;
    }
}