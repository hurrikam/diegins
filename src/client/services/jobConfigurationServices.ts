'use strict';

import axios from 'axios';
import JobConfiguration from '../../common/models/jobConfiguration';
import { SAVE_JOB_CONFIGURATION } from '../../common/api/endpoints';

function getApiUrl(endpoint: string): string {
    return window.location.origin + endpoint;
}

export function getJobStepIds(): Promise<Array<string>> {
    return new Promise((resolve, reject) => setTimeout(() => resolve(['sample']), 1000));
}

export function saveJobConfiguration(jobConfiguration: JobConfiguration): Promise<any> {
    const apiUrl = getApiUrl(SAVE_JOB_CONFIGURATION);
    return axios.post(apiUrl, jobConfiguration);
}
