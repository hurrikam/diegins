import path = require('path');

export const FILE_EXTENSION_DELIMITER = '.';

export class FileExtensionHelper {

    public getFileExtension(filePath: string): string {
        if (!filePath || filePath.trim().length === 0) {
            throw new Error('The filePath parameter cannot be an empty string');
        }
        let extension = path.extname(filePath);
        if (extension.indexOf(FILE_EXTENSION_DELIMITER) === 0) {
            extension = extension.substr(FILE_EXTENSION_DELIMITER.length);
        }
        return extension;
    }
}
