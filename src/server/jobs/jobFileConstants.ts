'use strict';

import { resolve, join } from 'path';

export const DIST_FOLDER = resolve(join(__dirname, '../../../dist'));
export const JOB_CONFIGURATIONS_FOLDER = resolve(join(__dirname, '../../../job_configurations'));
export const JOB_CONFIGURATION_FILE_EXTENSION = '.json';
export const JOB_LOG_FILE_NAME = 'log.txt';
export const JOB_STEPS_ROOT = resolve(join(__dirname, '../jobSteps'));
export const JOB_WORKING_DIR_NAME = 'workdir';
export const JOBS_FOLDER = resolve(join(__dirname, '../../../jobs'));
