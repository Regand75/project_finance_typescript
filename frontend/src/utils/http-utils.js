import {AuthUtils} from "./auth-utils.js";
import config from "../../config/config.js";

export class HttpUtils {
    static async request(url, method = 'GET', body = null, retries = 1) {
        const result = {
            error: false,
            response: null,
        };
        const params = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };
        let token = localStorage.getItem(AuthUtils.accessTokenKey);
        if (token) {
            params.headers['x-auth-token'] = token;
        }
        if (body) {
            params.body = JSON.stringify(body);
        }
        let response = null;
        try {
            response = await fetch(url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            result.status = response.status;
            if (response.status === 401 && retries > 0) {
                if (!token) {
                    result.redirect = '#/login';
                } else {
                    const updateTokenResult = await AuthUtils.processUnauthorizedResponse();
                    if (updateTokenResult) {
                        return await this.request(url, method, body, retries - 1);
                    } else {
                        result.redirect = '#/login';
                    }
                }
            }
        }
        return result;
    }
}