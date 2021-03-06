﻿'use strict';

import { Request, Response } from 'express';
import Command from '../command';
import { CANCEL_JOB } from '../../common/api/endpoints';
import JobScheduler from '../jobs/jobScheduler';
import { DELETE } from '../httpMethods';
import { CancelJobCommandParameters } from '../../common/api/commandsParameters';

export default class CancelJobCommand implements Command {

    public readonly endpoint = CANCEL_JOB;
    public readonly method = DELETE;

    public constructor(private readonly jobScheduler: JobScheduler) {
        if (!jobScheduler) {
            throw new Error('jobScheduler not specified');
        }
    }

    public execute(request: Request, response: Response): void {
        const parameters = request.params as CancelJobCommandParameters;
        const jobNumber = parseInt(parameters.jobNumber, 10);
        const jobRunner = this.jobScheduler.getJobRunners()
            .find(runner => runner.jobNumber === jobNumber);
        if (jobRunner) {
            jobRunner.cancel();
            response.end();
            return;
        }
        response.status(404);
        response.send(`No job with number ${jobNumber} exists in the list of scheduled jobs`);
    }
}
