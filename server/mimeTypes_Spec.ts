import { expect } from 'chai';
import { MimeTypes } from './mimeTypes';

describe('MimeTypes', () => {

    it('All MIME types are properly defined', () => {
        expect(MimeTypes.APPLICATION_JAVASCRIPT).to.equal('application/javascript');
        expect(MimeTypes.APPLICATION_JSON).to.equal('application/json');
        expect(MimeTypes.IMAGE_PNG).to.equal('image/png');
        expect(MimeTypes.TEXT_CSS).to.equal('text/css');
        expect(MimeTypes.TEXT_HTML).to.equal('text/html');
    });
});
