import { expect } from 'chai';
import { ServerFolders } from '../serverFolders';
import { FileRequestHandler } from './fileRequestHandler';

describe('FileRequestHandler', () => {

    const requestHandler = new FileRequestHandler();

    describe('normalizePath', () => {

        const indexPagePath = 'client/index.html';

        it('should return the path to the client index page when called with null', () => {
            expect(requestHandler.normalizePath(null)).to.equal(indexPagePath);
        });

        it('should return the path to the client index page when called with undefined', () => {
            expect(requestHandler.normalizePath(undefined)).to.equal(indexPagePath);
        });

        it('should return the path to the client index page when called with an empty string', () => {
            expect(requestHandler.normalizePath('')).to.equal(indexPagePath);
        });

        it('should return the path to the client index page when called with an blank string', () => {
            expect(requestHandler.normalizePath('   ')).to.equal(indexPagePath);
        });

        it('should return the path to the client index page when called with an URL path delimiter', () => {
            expect(requestHandler.normalizePath('/')).to.equal(indexPagePath);
        });

        it('should return a file path stripped of the leading URL path delimiter', () => {
            expect(requestHandler.normalizePath('/sampleFilePath')).to.equal('sampleFilePath');
        });
    });

    describe('isPathAllowed', () => {

        it('should return true when called with null', () => {
            expect(requestHandler.isPathAllowed(null)).to.be.true;
        });

        it('should return true when called with undefined', () => {
            expect(requestHandler.isPathAllowed(undefined)).to.be.true;
        });

        it('should return true when called with an empty string', () => {
            expect(requestHandler.isPathAllowed('')).to.be.true;
        });

        it('should return true when called with a blank string', () => {
            expect(requestHandler.isPathAllowed('   ')).to.be.true;
        });

        it('should return true when called with a path in the client files folder', () => {
            let samplePath = ServerFolders.CLIENT_FILES_ROOT + 'sampleFile';
            expect(requestHandler.isPathAllowed(samplePath)).to.be.true;
        });

        it('should return true when called with a path in the common files folder', () => {
            let samplePath = ServerFolders.COMMON_FILES_ROOT + 'sampleFile';
            expect(requestHandler.isPathAllowed(samplePath)).to.be.true;
        });

        it('should return true when called with a path in the node modules folder', () => {
            let samplePath = ServerFolders.NODE_MODULES_ROOT + 'sampleFile';
            expect(requestHandler.isPathAllowed(samplePath)).to.be.true;
        });

        it('should return false when called with a root file path', () => {
            expect(requestHandler.isPathAllowed('rootFile')).to.be.false;
        });

        it('should return false when called with any other file path', () => {
            expect(requestHandler.isPathAllowed('sampleFolder/sampleFile')).to.be.false;
        });
    });
});
