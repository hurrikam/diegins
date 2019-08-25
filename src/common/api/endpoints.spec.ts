'use strict';

import * as endpoints from './endpoints';

describe('Endpoints', () => {

    test('All endpoint names are properly defined', () => {
        expect(endpoints.CANCEL_JOB).toBe('/api/canceljob/:jobNumber');
        expect(endpoints.GET_JOB_INFOS).toBe('/api/jobs');
        expect(endpoints.GET_JOB_CONFIGURATIONS).toBe('/api/jobdefinitions');
        expect(endpoints.RUN_JOB).toBe('/api/runjob/:jobId');
        expect(endpoints.SAVE_JOB_CONFIGURATION).toBe('/api/jobconfiguration');
    });
});
