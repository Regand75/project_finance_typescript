import {HttpUtils} from "../utils/http-utils.js";
import config from "../../config/config.js";

export class AuthService {

    static async login(data) {
        const result = await HttpUtils.request(config.host + '/login', 'POST', data);
        if (result.error || !result.response || (result.response && (!result.response.tokens.accessToken || !result.response.tokens.refreshToken || !result.response.user.name || !result.response.user.lastName || !result.response.user.id))) {
            return false;
        }
        return result.response;
    }

    static async signup(data) {
        const result = await HttpUtils.request(config.host + '/signup', 'POST', data);
        if (result.error || !result.response.user || (result.response.user && (!result.response.user.email || !result.response.user.id || !result.response.user.lastName || !result.response.user.name))) {
            return false;
        }
        return result.response;
    }

    static async logOut(data) {
        await HttpUtils.request(config.host + '/logout', 'POST', data);
    }
}