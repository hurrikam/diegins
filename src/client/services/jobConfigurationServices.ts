'use strict';

import axios from 'axios';
import JobConfiguration from '../../common/models/jobConfiguration';
import {
    GET_JOB_CONFIGURATION,
    GET_JOB_CONFIGURATIONS,
    SAVE_JOB_CONFIGURATION,
    CREATE_JOB_CONFIGURATION,
    GET_JOB_STEP_IDS
} from '../../common/api/endpoints';
import { JOB_CONFIGURATION, RUN_JOB } from '../routes';

function getFullUrl(endpoint: string): string {
    return window.location.origin + endpoint;
}

async function postJobConfiguration(jobConfiguration: JobConfiguration, endpoint: string): Promise<void> {
    const apiUrl = getFullUrl(endpoint);
    try {
        await axios.post(apiUrl, jobConfiguration);
    } catch (error) {
        return Promise.reject(new Error(error.response.data));
    }
}

export async function createJobConfiguration(jobConfiguration: JobConfiguration): Promise<void> {
    return postJobConfiguration(jobConfiguration, CREATE_JOB_CONFIGURATION);
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

export async function getJobStepIds(): Promise<Array<string>> {
    const apiUrl = getFullUrl(GET_JOB_STEP_IDS);
    try {
        const response = await axios.get(apiUrl);
        return response.data as Array<string>;
    } catch (error) {
        return Promise.reject(new Error(error.response.data));
    }
}

export function saveJobConfiguration(jobConfiguration: JobConfiguration): Promise<any> {
    return postJobConfiguration(jobConfiguration, SAVE_JOB_CONFIGURATION);
}

export function openJobConfiguration(jobId: string): void {
    const configurationUrl = getFullUrl(JOB_CONFIGURATION)
        .replace(':jobId', jobId);
    window.location.href = configurationUrl;
}

export function openJobRunner(jobId: string): void {
    const configurationUrl = getFullUrl(RUN_JOB)
        .replace(':jobId', jobId);
    window.location.href = configurationUrl;
}
