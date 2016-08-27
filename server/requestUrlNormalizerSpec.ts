import { expect } from 'chai';
import { URL_PREFIX, EMPTY_URL, RequestUrlNormalizer } from './requestUrlNormalizer';

describe('URL_PREFIX', () => {

    it('is the slash character', () => {
        expect(URL_PREFIX).to.equal('/');
    });
});

describe('EMPTY_URL', () => {

    it('is an empty string', () => {
        expect(EMPTY_URL).to.equal('');
    });
});

describe('requestUrlNormalizer', () => {

    describe('normalize', () => {

        const normalizer = new RequestUrlNormalizer();

        it('converts null to the empty URL', () => {
            expect(normalizer.normalize(null)).to.equal(EMPTY_URL);
        });

        it('converts undefined to the empty URL', () => {
            expect(normalizer.normalize(undefined)).to.equal(EMPTY_URL);
        });

        it('converts an empty string to the empty URL', () => {
            expect(normalizer.normalize('')).to.equal(EMPTY_URL);
        });
    });
});
