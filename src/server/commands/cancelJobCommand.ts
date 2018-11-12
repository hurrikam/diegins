'use strict';

import { Request, Response } from 'express';
import Command from '../command';
import { CANCEL_JOB } from '../../common/api/endpoints';
import JobRunner from '../jobs/jobRunner';
import { DELETE } from '../httpMethods';
import { CancelJobCommandParameters } from '../../common/api/commandsParameters';

export default class CancelJobCommand implements Command {

    public readonly endpoint = CANCEL_JOB;
    public readonly method = DELETE;

    public constructor(private readonly jobRunner: JobRunner) {
        if (!jobRunner) {
            throw new Error('jobRunner not specified');
        }
    }

    public execute(request: Request, response: Response): void {
        const parameters = request.params as CancelJobCommandParameters;
        const jobNumber = Number(parameters.jobNumber);
        this.jobRunner.cancelJob(jobNumber);
        response.end();
    }
}
