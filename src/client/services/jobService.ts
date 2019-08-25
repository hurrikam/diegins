'use strict';

import axios from 'axios';
import { CANCEL_JOB, RUN_JOB, GET_JOB_INFOS } from '../../common/api/endpoints';
import JobInfo from '../../common/models/jobInfo';

export default class JobService {

    public cancelJob(jobNumber: number): Promise<boolean> {
        const apiUrl = this.getApiUrl(CANCEL_JOB)
            .replace(':jobNumber', jobNumber.toString());
        return axios.delete(apiUrl)
            .then(response => response.data as boolean)
            .catch(() => false);
    }

    public runJob(id: string): Promise<boolean> {
        const apiUrl = this.getApiUrl(RUN_JOB)
            .replace(':jobId', id);
        return axios.get(apiUrl)
            .then(response => response.data as boolean)
            .catch(() => false);
    }

    public getJobInfos(): Promise<JobInfo[]> {
        const apiUrl = this.getApiUrl(GET_JOB_INFOS);
        return axios.get(apiUrl)
            .then(response => response.data as JobInfo[])
            .catch(() => []);
    }

    private getApiUrl(endpoint: string) {
        return window.location.origin + endpoint;
    }
}
