import {AuthUtils} from "./auth-utils";
import {ResultRequestType} from "../types/result-request.type";

export class HttpUtils {
    public static async request<T = any>(url: string, method: string = 'GET', body: any = null, retries: number = 1): Promise<ResultRequestType<T>> {
        const result: ResultRequestType<T> = {
            error: false,
            response: null,
        };
        const params: RequestInit  = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };
        let token: string | null = localStorage.getItem(AuthUtils.accessTokenKey);
        if (token) {
            params.headers as Record<string, string>['x-auth-token'] = token;
        }
        if (body) {
            params.body = JSON.stringify(body);
        }
        let response: Response | null = null;
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
                    const updateTokenResult: boolean = await AuthUtils.processUnauthorizedResponse();
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