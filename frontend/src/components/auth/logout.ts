import {AuthUtils} from "../../utils/auth-utils.ts";
import {AuthService} from "../../services/auth-service";

export class Logout {
    constructor() {
        if (!localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')) {
            return location.href = '#/login';
        }
        this.logout().then();
    }

    async logout() {
        const refreshToken = localStorage.getItem(AuthUtils.refreshTokenKey);
        if (refreshToken) {
            await AuthService.logOut({
                refreshToken: refreshToken,
            });
            AuthUtils.removeToken();
            AuthUtils.removeUserInfo();
            window.location.href = '#/login';
        } else {
            AuthUtils.removeUserInfo();
            window.location.href = '#/login';
        }
    }
}