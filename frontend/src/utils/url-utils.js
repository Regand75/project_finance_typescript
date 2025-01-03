export class UrlUtils {
    static getUrlHashPart() {
        const url = new URL(window.location.href);
        return url.hash.split('/')[1];
    }
}