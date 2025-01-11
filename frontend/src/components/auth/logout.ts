import {AuthUtils} from "../../utils/auth-utils";
import {CommonUtils} from "../../utils/common-utils";
import {RouteType} from "../../types/route.type";

export class Logout {
    constructor(previousRouteObject: RouteType | undefined) {
        if (!localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')) {
            if (previousRouteObject) {
                CommonUtils.removeStales(previousRouteObject);
            }
            AuthUtils.removeUserInfo();
            location.href = '#/login';
            return;
        }
        AuthUtils.logout(previousRouteObject).then();
    }
}