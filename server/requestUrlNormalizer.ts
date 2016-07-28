const UrlPrefix = '/';
const DefaultReturnUrl = '';

export class RequestUrlNormalizer {

    public constructor() {
    }

    public normalize(url: string): string {
        if (!url) {
            return DefaultReturnUrl;
        }
        if (url == UrlPrefix) {
            return DefaultReturnUrl;
        }
        if (url.indexOf(UrlPrefix) == 0) {
            let normalizedUrlLength = url.length - UrlPrefix.length;
            return url.substr(UrlPrefix.length, normalizedUrlLength);
        }
        return url;
    }
}