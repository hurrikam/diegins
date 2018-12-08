'use strict';

import { JOB_STARTED_EVENT, JOB_FINISHED_EVENT, JOB_OUTPUT_EVENT } from './jobEvents';

describe('jobEvents', () => {

    test('defines the expected job events', () => {
        expect(JOB_STARTED_EVENT).toBe('job-started');
        expect(JOB_FINISHED_EVENT).toBe('job-finished');
        expect(JOB_OUTPUT_EVENT).toBe('job-output');
    });
});
