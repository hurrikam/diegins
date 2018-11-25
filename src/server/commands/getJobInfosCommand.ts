'use strict';

import { Request, Response } from 'express';
import Command from '../command';
import { GET_JOB_INFOS } from '../../common/api/endpoints';
import JobScheduler from '../jobs/jobScheduler';
import { GET } from '../httpMethods';

export default class GetJobInfosCommand implements Command {

    public readonly endpoint = GET_JOB_INFOS;
    public readonly method = GET;

    public constructor(private readonly jobScheduler: JobScheduler) {
        if (!jobScheduler) {
            throw new Error('jobScheduler not specified');
        }
    }

    public execute(request: Request, response: Response): void {
        const jobInstanceInfos = this.jobScheduler.getJobInfos();
        response.send(jobInstanceInfos);
    }
}
