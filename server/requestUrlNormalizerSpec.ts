import assert = require('assert');
import { URL_PREFIX, EMPTY_URL, RequestUrlNormalizer } from './requestUrlNormalizer';

describe('URL_PREFIX', () => {

    it('is the slash character', () => {
        assert.strictEqual(URL_PREFIX, '/');
    });
});

describe('EMPTY_URL', () => {

    it('is an empty string', () => {
        assert.strictEqual(EMPTY_URL, '');
    });
});

describe('requestUrlNormalizer', () => {

    describe('normalize()', () => {

        const normalizer = new RequestUrlNormalizer();

        it('converts null to the empty URL', () => {
            assert.strictEqual(normalizer.normalize(null), EMPTY_URL);
        });

        it('converts undefined to the empty URL', () => {
            assert.strictEqual(normalizer.normalize(undefined), EMPTY_URL);
        });

        it('converts an empty string to the empty URL', () => {
            assert.strictEqual(normalizer.normalize(''), EMPTY_URL);
        });
    });
});
