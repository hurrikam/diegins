import { expect } from 'chai';
import { ServerFolders } from './serverFolders';

describe('ServerFolders', () => {

    it('All folder paths are properly defined', () => {
        expect(ServerFolders.CLIENT_FILES_ROOT).to.equal('client/');
        expect(ServerFolders.COMMON_FILES_ROOT).to.equal('common/');
        expect(ServerFolders.NODE_MODULES_ROOT).to.equal('node_modules/');
        expect(ServerFolders.JOBS_ROOT).to.equal('jobs/');
    });
});
