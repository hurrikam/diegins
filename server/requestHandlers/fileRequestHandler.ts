import * as fs from 'fs';
import * as http from 'http';
import * as server from '../index';
import { IncomingMessage, ServerResponse } from 'http';
import { RequestHandler } from './requestHandler';

const CLIENT_FILES_ROOT = 'client/';
const NODE_MODULES_ROOT = 'node_modules/';
const RESPONSE_STATUS_OK = 200;
const DEFAULT_FILE = 'index.html';
const DEFAULT_MIME_TYPE = server.MimeTypes.TEXT_HTML;

export class FileRequestHandler implements RequestHandler {

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
        let fileExtensionHelper = new server.FileExtensionHelper();
        let extension = fileExtensionHelper.getFileExtension(fileRelativePath);
        let extensionToMimeConverter = new server.ExtensionToMimeConverter();
        return extensionToMimeConverter.convert(extension);
    }

    private isFileRequest(fileRelativePath: string): boolean {
        let filePath = this.getFileFullPath(fileRelativePath);
        return fs.existsSync(filePath);
    }

    public tryHandle(request: IncomingMessage, response: ServerResponse): boolean {
        let requestUrlNormalizer = new server.RequestUrlNormalizer();
        let url = requestUrlNormalizer.normalize(request.url);
        if (!this.isFileRequest(url)) {
            return false;
        }
        let filePath = this.getFileFullPath(url);
        let mimeType = this.getFileMimeType(url);
        response.setHeader('Content-Type', mimeType);
        response.end(fs.readFileSync(filePath));
        return true;
    }
}
