'use strict';

import axios from 'axios';
import {
    CANCEL_JOB,
    GET_JOB_INFOS,
    GET_JOB_LOG,
    RUN_JOB
} from '../../common/api/endpoints';
import JobInfo from '../../common/models/jobInfo';
import { JOB_LOG, JOB_RUNNER } from '../routes';
import JobParameterValues from '../../common/models/jobParameterValues';
import { navigateTo } from './navigationServices';
import { appendToServerUrl } from './urlServices';

export default class JobService {

    public cancelJob(jobNumber: number): Promise<boolean> {
        const apiUrl = appendToServerUrl(CANCEL_JOB)
            .replace(':jobNumber', jobNumber.toString());
        return axios.delete(apiUrl)
            .then(response => response.data as boolean)
            .catch(() => false);
    }

    public runJob(id: string, parameterValues?: JobParameterValues): Promise<boolean> {
        const apiUrl = appendToServerUrl(RUN_JOB)
            .replace(':jobId', id);
        return axios.post(apiUrl, parameterValues)
            .then(response => response.data as boolean)
            .catch(() => false);
    }

    public getJobInfos(): Promise<JobInfo[]> {
        const apiUrl = appendToServerUrl(GET_JOB_INFOS);
        return axios.get(apiUrl)
            .then(response => response.data as JobInfo[])
            .catch(() => []);
    }

    public async getJobLog(jobNumber: number): Promise<string> {
        const apiUrl = appendToServerUrl(GET_JOB_LOG)
            .replace(':jobNumber', jobNumber.toString());
        const response = await axios.get(apiUrl);
        return response.data;
    }
}

export function openJobLog(jobNumber: number): void {
    const path = JOB_LOG.replace(':jobNumber', jobNumber.toString());
    navigateTo(path);
}

export function openJobRunner(jobId: string): void {
    const path = JOB_RUNNER.replace(':jobId', jobId);
    navigateTo(path);
}
