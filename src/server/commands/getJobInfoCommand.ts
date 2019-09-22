'use strict';

import { Request, Response } from 'express';
import Command from '../command';
import { GET_JOB_INFO } from '../../common/api/endpoints';
import JobScheduler from '../jobs/jobScheduler';
import { GET } from '../httpMethods';

export default class GetJobInfoCommand implements Command {

    public readonly endpoint = GET_JOB_INFO;
    public readonly method = GET;

    public constructor(private readonly jobScheduler: JobScheduler) {
        if (!jobScheduler) {
            throw new Error('jobScheduler not specified');
        }
    }

    public execute(request: Request, response: Response): void {
        const jobNumber = parseInt(request.params.jobNumber, 10);
        const jobInfo = this.jobScheduler.getJobInfos()
            .find(job => job.number === jobNumber);
        if (!jobInfo) {
            response.status(404);
            response.send(`No job with number ${jobNumber} found`);
            return;
        }
        response.send(jobInfo);
    }
}
