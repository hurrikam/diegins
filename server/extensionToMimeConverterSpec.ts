import assert = require('assert');
import { DEFAULT_MIME_TYPE, ExtensionToMimeConverter } from './extensionToMimeConverter';
import { MimeTypes } from './mimeTypes';

describe('DEFAULT_MIME_TYPE', () => {

    it('is an empty string', () => {
        assert.strictEqual(DEFAULT_MIME_TYPE, '');
    });
});

describe('ExtensionToMimeConverter', () => {

    describe('convert()', () => {

        const converter = new ExtensionToMimeConverter();

        it('converts all supported extensions to the correct MIME types', () => {
            assert.strictEqual(converter.convert('css'), MimeTypes.TEXT_CSS);
            assert.strictEqual(converter.convert('html'), MimeTypes.TEXT_HTML);
            assert.strictEqual(converter.convert('js'), MimeTypes.APPLICATION_JAVASCRIPT);
            assert.strictEqual(converter.convert('png'), MimeTypes.IMAGE_PNG);
        });

        it('converts an unsupported extension to the default MIME type', () => {
            assert.strictEqual(converter.convert(''), DEFAULT_MIME_TYPE);
        });
    });
});
