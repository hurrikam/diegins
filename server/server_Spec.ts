import { expect } from 'chai';
import { MINIMUM_SERVER_PORT_NUMBER, MAXIMUM_SERVER_PORT_NUMBER, Server } from './server';

describe('MINIMUM_SERVER_PORT_NUMBER', () => {

    it('should be 0', () => {
        expect(MINIMUM_SERVER_PORT_NUMBER).to.equal(0);
    });
});

describe('MAXIMUM_SERVER_PORT_NUMBER', () => {

    it('should be 65535', () => {
        expect(MAXIMUM_SERVER_PORT_NUMBER).to.equal(65535);
    });
});

describe('Server', () => {

    describe('constructor', () => {

        const portRangeErrorMessage = `The 'port' parameter must be a value in the range (inclusive) ` +
            `${MINIMUM_SERVER_PORT_NUMBER} and ${MAXIMUM_SERVER_PORT_NUMBER}`;

        it('should throw the expected exception when invoked with a port number smaller than the minimum one', () => {
            expect(() => {
                new Server(MINIMUM_SERVER_PORT_NUMBER - 1);
            }).to.throw(portRangeErrorMessage);
        });

        it('should throw the expected exception when invoked with a port number greater than the maximum one', () => {
            expect(() => {
                new Server(MAXIMUM_SERVER_PORT_NUMBER + 1);
            }).to.throw(portRangeErrorMessage);
        });
    });
});
