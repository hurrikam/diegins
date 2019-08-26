'use strict';

import axios from 'axios';
import JobConfiguration from '../../common/models/jobConfiguration';
import {
    GET_JOB_CONFIGURATION,
    GET_JOB_CONFIGURATIONS,
    SAVE_JOB_CONFIGURATION
} from '../../common/api/endpoints';
import { JOB_CONFIGURATION } from '../routes';

function getFullUrl(endpoint: string): string {
    return window.location.origin + endpoint;
}

export function getJobStepIds(): Promise<Array<string>> {
    return new Promise((resolve, reject) => setTimeout(() => resolve(['sample']), 1000));
}

export async function getJobConfiguration(jobId: string): Promise<JobConfiguration> {
    const apiUrl = getFullUrl(GET_JOB_CONFIGURATION)
        .replace(':jobId', jobId);
    try {
        const response = await axios.get(apiUrl);
        return response.data as JobConfiguration;
        // tslint:disable-next-line:no-empty
    } catch (error) {
    }
}

export async function getJobConfigurations(): Promise<Array<JobConfiguration>> {
    const apiUrl = getFullUrl(GET_JOB_CONFIGURATIONS);
    try {
        const response = await axios.get(apiUrl);
        return response.data as Array<JobConfiguration>;
    } catch (error) {
        return [];
    }
}

export function saveJobConfiguration(jobConfiguration: JobConfiguration): Promise<any> {
    const apiUrl = getFullUrl(SAVE_JOB_CONFIGURATION);
    return axios.post(apiUrl, jobConfiguration);
}

export function openJobConfiguration(jobId: string): void {
    const configurationUrl = getFullUrl(JOB_CONFIGURATION)
        .replace(':jobId', jobId);
    window.location.href = configurationUrl;
}
