'use strict';

import { Request, Response } from 'express';
import Command from '../command';
import { GET_JOB_INFOS } from '../../common/api/endpoints';
import JobRunner from '../jobs/jobRunner';
import { GET } from '../httpMethods';

export default class GetJobInfosCommand implements Command {

    public readonly endpoint = GET_JOB_INFOS;
    public readonly method = GET;

    public constructor(private readonly jobRunner: JobRunner) {
        if (!jobRunner) {
            throw new Error('jobRunner not specified');
        }
    }

    public execute(request: Request, response: Response): void {
        const jobInstanceInfos = this.jobRunner.getJobInfos();
        response.send(jobInstanceInfos);
    }
}
