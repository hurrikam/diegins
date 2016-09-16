import { expect } from 'chai';
import { Endpoints } from './endpoints';

describe('Endpoints', () => {

    it('All endpoint names are properly defined', () => {
        expect(Endpoints.GET_JOBS).to.equal('jobs');
    });
});
