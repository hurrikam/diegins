import fs = require('fs');
import http = require('http');
import * as server from './index';

const FilesRootPath = './client/';
const ResponseStatusOK = 200;
const DefaultFile = 'index.html';
const DefaultMimeType = server.MimeTypes.TextHtml;

export class FileRequestHandler {

    private extensionToMimeConverter: server.ExtensionToMimeConverter;
    private fileExtensionHelper: server.FileExtensionHelper;

    public constructor() {
        this.extensionToMimeConverter = new server.ExtensionToMimeConverter();
        this.fileExtensionHelper = new server.FileExtensionHelper();
    }

    private getFileFullPath(fileRelativePath: string) {
        if (!fileRelativePath) {
            fileRelativePath = DefaultFile;
        }
        return FilesRootPath + fileRelativePath;
    }

    private getFileMimeType(fileRelativePath: string): string {
        if (!fileRelativePath) {
            return DefaultMimeType;
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
        response.writeHead(ResponseStatusOK, { 'Content-Type': mimeType });
        response.end(fs.readFileSync(filePath));
    }
}