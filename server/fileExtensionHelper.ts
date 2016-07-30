import path = require('path');

const FileExtensionDelimiter = '.';

export class FileExtensionHelper {

    public GetFileExtension(filePath: string) {
        if (!filePath) {
            throw new Error('The filePath parameter cannot be an empty string');
        }
        let extension = path.extname(filePath);
        if (extension.indexOf(FileExtensionDelimiter) == 0) {
            return extension.substr(FileExtensionDelimiter.length);
        }
    }
}