import path = require('path');

const FILE_EXTENSION_DELIMITER = '.';

export class FileExtensionHelper {

    public GetFileExtension(filePath: string) {
        if (!filePath) {
            throw new Error('The filePath parameter cannot be an empty string');
        }
        let extension = path.extname(filePath);
        if (extension.indexOf(FILE_EXTENSION_DELIMITER) === 0) {
            return extension.substr(FILE_EXTENSION_DELIMITER.length);
        }
    }
}
