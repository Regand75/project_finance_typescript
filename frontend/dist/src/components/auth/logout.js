"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = void 0;
const auth_utils_1 = require("../../utils/auth-utils");
const auth_service_1 = require("../../services/auth-service");
class Logout {
    constructor() {
        if (!localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')) {
            location.href = '#/login';
            return;
        }
        this.logout().then();
    }
    async logout() {
        const refreshToken = localStorage.getItem(auth_utils_1.AuthUtils.refreshTokenKey);
        if (refreshToken) {
            await auth_service_1.AuthService.logOut({
                refreshToken: refreshToken,
            });
            auth_utils_1.AuthUtils.removeToken();
            auth_utils_1.AuthUtils.removeUserInfo();
            window.location.href = '#/login';
        }
        else {
            auth_utils_1.AuthUtils.removeUserInfo();
            window.location.href = '#/login';
        }
    }
}
exports.Logout = Logout;
