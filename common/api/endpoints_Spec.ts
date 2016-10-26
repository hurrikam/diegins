import { expect } from 'chai';
import { Endpoints } from './endpoints';

describe('Endpoints', () => {

    it('All endpoint names are properly defined', () => {
        expect(Endpoints.API_ENDPOINT_PREFIX).to.equal('/api/');
        expect(Endpoints.CANCEL_JOB).to.equal('canceljob');
        expect(Endpoints.GET_JOB_INSTANCE_INFOS).to.equal('jobinstanceinfos');
        expect(Endpoints.GET_JOBS).to.equal('jobs');
        expect(Endpoints.RUN_JOB).to.equal('runjob');
    });
});
