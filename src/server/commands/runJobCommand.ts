'use strict';

import { Request, Response } from 'express';
import Command from '../command';
import { RUN_JOB } from '../../common/api/endpoints';
import JobScheduler from '../jobs/jobScheduler';
import { GET } from '../httpMethods';
import JobConfigurationRepository from '../jobs/jobConfigurationRepository';
import { RunJobCommandParameters } from '../../common/api/commandsParameters';

export default class RunJobCommand implements Command {

    public readonly endpoint = RUN_JOB;
    public readonly method = GET;

    public constructor(
        private readonly jobConfigurationRepository: JobConfigurationRepository,
        private readonly jobScheduler: JobScheduler) {
        if (!jobConfigurationRepository) {
            throw new Error('jobConfigurationRepository not specified');
        }
        if (!jobScheduler) {
            throw new Error('jobScheduler not specified');
        }
    }

    public execute(request: Request, response: Response): void {
        const params = request.params as RunJobCommandParameters;
        const jobId = params.jobId;
        const jobConfiguration = this.jobConfigurationRepository.getJobConfiguration(jobId);

        if (!jobConfiguration) {
            response
                .status(400)
                .send(`Job with ID '${jobId}' does not exist`);
            return;
        }

        this.jobScheduler.run(jobConfiguration);
        response.end();
    }
}
