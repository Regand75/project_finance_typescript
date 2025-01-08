"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlUtils = void 0;
class UrlUtils {
    static getUrlHashPart() {
        const url = new URL(window.location.href);
        return url.hash.split('/')[1];
    }
}
exports.UrlUtils = UrlUtils;
