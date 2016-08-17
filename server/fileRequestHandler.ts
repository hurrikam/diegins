import fs = require('fs');
import http = require('http');
import * as server from './index';

const CLIENT_FILES_ROOT = './client/';
const NODE_MODULES_ROOT = 'node_modules/';
const RESPONSE_STATUS_OK = 200;
const DEFAULT_FILE = 'index.html';
const DEFAULT_MIME_TYPE = server.MimeTypes.TEXT_HTML;

export class FileRequestHandler {

    private extensionToMimeConverter: server.ExtensionToMimeConverter;
    private fileExtensionHelper: server.FileExtensionHelper;

    public constructor() {
        this.extensionToMimeConverter = new server.ExtensionToMimeConverter();
        this.fileExtensionHelper = new server.FileExtensionHelper();
    }

    private getFileFullPath(fileRelativePath: string) {
        if (!fileRelativePath) {
            fileRelativePath = DEFAULT_FILE;
        }
        if (fileRelativePath.indexOf(NODE_MODULES_ROOT) === 0) {
            return fileRelativePath;
        }
        return CLIENT_FILES_ROOT + fileRelativePath;
    }

    private getFileMimeType(fileRelativePath: string): string {
        if (!fileRelativePath) {
            return DEFAULT_MIME_TYPE;
        }
        let extension = this.fileExtensionHelper.GetFileExtension(fileRelativePath);
        return this.extensionToMimeConverter.convert(extension);
    }

    public isFileRequest(fileRelativePath: string): boolean {
        let filePath = this.getFileFullPath(fileRelativePath);
        return fs.existsSync(filePath);
    }

    public serveFile(fileRelativePath: string, response: http.ServerResponse): void {
        let filePath = this.getFileFullPath(fileRelativePath);
        let mimeType = this.getFileMimeType(fileRelativePath);
        response.writeHead(RESPONSE_STATUS_OK, { 'Content-Type': mimeType });
        response.end(fs.readFileSync(filePath));
    }
}
