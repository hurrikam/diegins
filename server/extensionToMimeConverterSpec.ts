import { expect } from 'chai';
import { DEFAULT_MIME_TYPE, ExtensionToMimeConverter } from './extensionToMimeConverter';
import { MimeTypes } from './mimeTypes';

describe('DEFAULT_MIME_TYPE', () => {

    it('is an empty string', () => {
        expect(DEFAULT_MIME_TYPE).to.equal('');
    });
});

describe('ExtensionToMimeConverter', () => {

    describe('convert', () => {

        const converter = new ExtensionToMimeConverter();

        it('converts all supported extensions to the correct MIME types', () => {
            expect(converter.convert('css')).to.equal(MimeTypes.TEXT_CSS);
            expect(converter.convert('html')).to.equal(MimeTypes.TEXT_HTML);
            expect(converter.convert('js')).to.equal(MimeTypes.APPLICATION_JAVASCRIPT);
            expect(converter.convert('png')).to.equal(MimeTypes.IMAGE_PNG);
        });

        it('converts an unsupported extension to the default MIME type', () => {
            expect(converter.convert('')).to.equal(DEFAULT_MIME_TYPE);
        });
    });
});
