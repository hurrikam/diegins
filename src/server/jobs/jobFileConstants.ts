'use strict';

import { resolve, join } from 'path';

export const JOB_CONFIGURATIONS_FOLDER = resolve(join(__dirname, '../../../job_configurations'));
export const JOB_CONFIG_FILE_NAME = 'config.json';
export const JOB_LOG_FILE_NAME = 'log.txt';
export const JOBS_FOLDER = resolve(join(__dirname, '../../../jobs'));
export const JOB_STEPS_ROOT = resolve(join(__dirname, '../jobSteps'));
