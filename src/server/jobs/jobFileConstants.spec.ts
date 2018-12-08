'use strict';

import { resolve, join } from 'path';
import {
    JOB_CONFIGURATIONS_FOLDER,
    JOB_CONFIG_FILE_NAME,
    JOB_LOG_FILE_NAME,
    JOBS_FOLDER,
    JOB_STEPS_ROOT
} from './jobFileConstants';

describe('jobFileContants', () => {

    test('defines the expected job file constants', () => {
        expect(JOB_CONFIGURATIONS_FOLDER).toBe(resolve(join(__dirname, '../../../job_configurations')));
        expect(JOB_CONFIG_FILE_NAME).toBe('config.json');
        expect(JOB_LOG_FILE_NAME).toBe('log.txt');
        expect(JOBS_FOLDER).toBe(resolve(join(__dirname, '../../../jobs')));
        expect(JOB_STEPS_ROOT).toBe(resolve(join(__dirname, '../jobSteps')));
    });
});
