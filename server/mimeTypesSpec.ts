import assert = require('assert');
import { MimeTypes } from './mimeTypes';

describe('MimeTypes', () => {

    it('All MIME types are properly defined', () => {
        assert.strictEqual(MimeTypes.APPLICATION_JAVASCRIPT, 'application/javascript');
        assert.strictEqual(MimeTypes.IMAGE_PNG, 'image/png');
        assert.strictEqual(MimeTypes.TEXT_CSS, 'text/css');
        assert.strictEqual(MimeTypes.TEXT_HTML, 'text/html');
    });
});
