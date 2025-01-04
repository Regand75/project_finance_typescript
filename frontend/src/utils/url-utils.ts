export class UrlUtils {
    public static getUrlHashPart(): string | undefined {
        const url: URL = new URL(window.location.href);
        return url.hash.split('/')[1];
    }
}