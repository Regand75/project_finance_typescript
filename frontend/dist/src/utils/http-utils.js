"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpUtils = void 0;
const auth_utils_1 = require("./auth-utils");
class HttpUtils {
    static async request(url, method = 'GET', body = null, retries = 1) {
        const result = {
            error: false,
            response: null,
        };
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        let token = localStorage.getItem(auth_utils_1.AuthUtils.accessTokenKey);
        if (token) {
            headers['x-auth-token'] = token;
        }
        const params = {
            method: method,
            headers: headers, // Устанавливаем headers здесь
        };
        if (body) {
            params.body = JSON.stringify(body);
        }
        let response = null;
        try {
            response = await fetch(url, params);
            result.response = await response.json();
        }
        catch (e) {
            result.error = true;
            return result;
        }
        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            result.status = response.status;
            if (response.status === 401 && retries > 0) {
                if (!token) {
                    location.href = '#/login';
                    return result;
                }
                else {
                    const updateTokenResult = await auth_utils_1.AuthUtils.processUnauthorizedResponse();
                    if (updateTokenResult) {
                        return await this.request(url, method, body, retries - 1);
                    }
                    else {
                        location.href = '#/login';
                        return result;
                    }
                }
            }
        }
        return result;
    }
}
exports.HttpUtils = HttpUtils;
