const URL_PREFIX = '/';
const EMPTY_URL = '';

export class RequestUrlNormalizer {

    public normalize(url: string): string {
        if (!url) {
            return EMPTY_URL;
        }
        if (url === URL_PREFIX) {
            return EMPTY_URL;
        }
        if (url.indexOf(URL_PREFIX) === 0) {
            let normalizedUrlLength = url.length - URL_PREFIX.length;
            return url.substr(URL_PREFIX.length, normalizedUrlLength);
        }
        return url;
    }
}
