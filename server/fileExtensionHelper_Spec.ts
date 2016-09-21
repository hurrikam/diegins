import { expect } from 'chai';
import { FILE_EXTENSION_DELIMITER, FileExtensionHelper } from './fileExtensionHelper';

describe('fileExtensionHelper', () => {

    describe('FILE_EXTENSION_DELIMITER', () => {

        it('should be equal to .', () => {
            expect(FILE_EXTENSION_DELIMITER).to.equal('.');
        });
    });

    describe('getFileExtension', () => {

        const extensionHelper = new FileExtensionHelper();
        const invalidFilePathMessage = 'The filePath parameter cannot be an empty string';

        it('will throw the expected exception when a null file path is passed', () => { 
            expect(() => {
                extensionHelper.getFileExtension(null);
            }).to.throw(invalidFilePathMessage);
        });

        it('will throw the expected exception when an undefined file path is passed', () => {
            expect(() => {
                extensionHelper.getFileExtension(undefined);
            }).to.throw(invalidFilePathMessage);
        });

        it('will throw the expected exception when an empty file path is passed', () => {
            expect(() => {
                extensionHelper.getFileExtension('');
            }).to.throw(invalidFilePathMessage);
        });

        it('will throw the expected exception when a white file path is passed', () => {
            expect(() => {
                extensionHelper.getFileExtension(' ');
            }).to.throw(invalidFilePathMessage);
        });

        it('will return a file extension without extension delimiter', () => {
            expect(extensionHelper.getFileExtension('/test/file.ext')).to.equal('ext');
        });

        it('will return an empty string for a file with no extension', () => {
            expect(extensionHelper.getFileExtension('/test/file_no_ext')).to.equal('');
        });
    });
});
