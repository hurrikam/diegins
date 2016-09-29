import { expect } from 'chai';
import { Endpoints } from './endpoints';

describe('Endpoints', () => {

    it('All endpoint names are properly defined', () => {
        expect(Endpoints.GET_JOBS).to.equal('jobs');
        expect(Endpoints.RUN_JOB).to.equal('runjob');
    });
});
