import { MimeTypes } from './mimeTypes';

const DefaultMimeType = '';

export class ExtensionToMimeConverter {

    private map: { [extension: string]: string; } = {};

    public constructor() {
        this.map['css'] = MimeTypes.TextCss;
        this.map['html'] = MimeTypes.TextHtml;
        this.map['js'] = MimeTypes.ApplicationJavaScript;
        this.map['png'] = MimeTypes.ImagePng;
    }

    public convert(extension: string): string {
        var mimeType = this.map[extension];
        if (!mimeType) {
            return DefaultMimeType;
        }
        return mimeType;
    }
}