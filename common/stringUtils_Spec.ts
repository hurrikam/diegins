import { expect } from 'chai';
import { StringUtils } from './stringUtils';

describe('StringUtils', () => {

    describe('isUndefinedOrBlank', () => {

        it('returns true when the test string is undefined', () => {
            expect(StringUtils.isUndefinedOrBlank(undefined)).to.equal(true);
        });

        it('returns true when the test string is null', () => {
            expect(StringUtils.isUndefinedOrBlank(null)).to.equal(true);
        });

        it('returns true when the test string contains only spaces', () => {
            expect(StringUtils.isUndefinedOrBlank('   ')).to.equal(true);
        });

        it('returns false when the test string does not contain only spaces', () => {
            expect(StringUtils.isUndefinedOrBlank(' a ')).to.equal(false);
        });
    });

    describe('startsWith', () => {

        const invalidTestStringMessage = 'testString cannot be undefined or null';

        it('throws the expected exception when the test string is null', () => {
            expect(() => {
                StringUtils.startsWith(null, 'subString');
            }).to.throw(invalidTestStringMessage);
        });

        it('throws the expected exception when the test string is undefined', () => {
            expect(() => {
                StringUtils.startsWith(undefined, 'subString');
            }).to.throw(invalidTestStringMessage);
        });

        it('returns true when the test string starts with the specified substring', () => {
            expect(StringUtils.startsWith('Test String', 'Test')).to.equal(true);
        });

        it('returns false when the test string does not start with the specified substring', () => {
            expect(StringUtils.startsWith('Test String', 'String')).to.equal(false);
        });

        it('returns false when the test string and the substring have different case', () => {
            expect(StringUtils.startsWith('Test String', 'test')).to.equal(false);
        });

        it('returns false when the test string and the substring differ by leading spaces', () => {
            expect(StringUtils.startsWith('Test String', ' Test')).to.equal(false);
        });
    });
});