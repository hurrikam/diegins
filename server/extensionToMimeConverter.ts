import * as server from './mimeTypes';

const DefaultMimeType = '';

export class ExtensionToMimeConverter {

    private map: { [extension: string]: string; } = {};

    public constructor() {
        this.map['html'] = server.MimeTypes.TextHtml;
        this.map['css'] = server.MimeTypes.TextCss;
    }

    public convert(extension: string): string {
        var mimeType = this.map[extension];
        if (!mimeType) {
            return DefaultMimeType;
        }
        return mimeType;
    }
}