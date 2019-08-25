'use strict';

import axios from 'axios';
import JobConfiguration from '../../common/models/jobConfiguration';
import { SAVE_JOB_CONFIGURATION, GET_JOB_CONFIGURATIONS } from '../../common/api/endpoints';

function getApiUrl(endpoint: string): string {
    return window.location.origin + endpoint;
}

export function getJobStepIds(): Promise<Array<string>> {
    return new Promise((resolve, reject) => setTimeout(() => resolve(['sample']), 1000));
}

export async function getJobConfigurations(): Promise<Array<JobConfiguration>> {
    const apiUrl = getApiUrl(GET_JOB_CONFIGURATIONS);
    try {
        const response = await axios.get(apiUrl);
        return response.data as Array<JobConfiguration>;
    } catch (error) {
        return [];
    }
}

export function saveJobConfiguration(jobConfiguration: JobConfiguration): Promise<any> {
    const apiUrl = getApiUrl(SAVE_JOB_CONFIGURATION);
    return axios.post(apiUrl, jobConfiguration);
}
