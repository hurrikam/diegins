'use strict';

import { Request, Response } from 'express';
import Command from '../command';
import { GET_JOB_STEP_IDS } from '../../common/api/endpoints';
import { GET } from '../httpMethods';
import JobStepRepository from '../jobs/jobStepRepository';

export default class GetJobStepIdsCommand implements Command {

    public readonly endpoint = GET_JOB_STEP_IDS;
    public readonly method = GET;

    public constructor(private readonly jobStepRepository: JobStepRepository) {
        if (!jobStepRepository) {
            throw new Error('jobStepRepository not specified');
        }
    }

    public execute(request: Request, response: Response): void {
        const jobStepIds = this.jobStepRepository.getJobStepIds();
        response.send(jobStepIds);
    }
}
