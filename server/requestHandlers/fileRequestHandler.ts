import * as fs from 'fs';
import * as http from 'http';
import * as server from '../index';
import { IncomingMessage, ServerResponse } from 'http';
import { RequestHandler } from './requestHandler';
import { StringUtils } from '../../common/stringUtils';

const URL_PATH_DELIMITER = '/';
const DEFAULT_FILE_PATH = server.ServerFolders.CLIENT_FILES_ROOT + 'index.html';
const DEFAULT_MIME_TYPE = server.MimeTypes.TEXT_HTML;

export class FileRequestHandler implements RequestHandler {

    private allowedPaths = [
        server.ServerFolders.CLIENT_FILES_ROOT,
        server.ServerFolders.COMMON_FILES_ROOT,
        server.ServerFolders.NODE_MODULES_ROOT
    ];

    public tryHandle(request: IncomingMessage, response: ServerResponse): boolean {
        let filePath = this.normalizePath(request.url);
        if (!this.isPathAllowed(filePath)) {
            return false;
        }
        if (!fs.existsSync(filePath)) {
            return false;
        }
        let mimeType = this.getFileMimeType(filePath);
        response.setHeader('Content-Type', mimeType);
        response.end(fs.readFileSync(filePath));
        return true;
    }

    public normalizePath(path: string): string {
        if (StringUtils.isUndefinedOrBlank(path)) {
            return DEFAULT_FILE_PATH;
        }
        if (StringUtils.startsWith(path, URL_PATH_DELIMITER)) {
            path = path.substr(URL_PATH_DELIMITER.length);
        }
        if (!path) {
            return DEFAULT_FILE_PATH;
        }
        return path;
    }

    public isPathAllowed(path: string): boolean {
        if (StringUtils.isUndefinedOrBlank(path)) {
            return true;
        }
        return this.allowedPaths.some((allowedPath) => {
            return StringUtils.startsWith(path, allowedPath); 
        });
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
}
