import { MimeTypes } from './mimeTypes';

export const DEFAULT_MIME_TYPE = '';

export class ExtensionToMimeConverter {

    private map: { [extension: string]: string; } = {};

    public constructor() {
        this.map['css'] = MimeTypes.TEXT_CSS;
        this.map['html'] = MimeTypes.TEXT_HTML;
        this.map['js'] = MimeTypes.APPLICATION_JAVASCRIPT;
        this.map['png'] = MimeTypes.IMAGE_PNG;
    }

    public convert(extension: string): string {
        let mimeType = this.map[extension];
        if (!mimeType) {
            return DEFAULT_MIME_TYPE;
        }
        return mimeType;
    }
}
