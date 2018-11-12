'use strict';

import { Request, Response } from 'express';
import Command from '../command';
import { RUN_JOB } from '../../common/api/endpoints';
import JobRunner from '../jobs/jobRunner';
import { GET } from '../httpMethods';
import JobConfigurationRepository from '../jobs/jobConfigurationRepository';
import { RunJobCommandParameters } from '../../common/api/commandsParameters';

export default class RunJobCommand implements Command {

    public readonly endpoint = RUN_JOB;
    public readonly method = GET;

    public constructor(
        private readonly jobRepository: JobConfigurationRepository,
        private readonly jobRunner: JobRunner) {
        if (!jobRepository) {
            throw new Error('jobRepository not specified');
        }
        if (!jobRunner) {
            throw new Error('jobRunner not specified');
        }
    }

    public execute(request: Request, response: Response): void {
        const params = request.params as RunJobCommandParameters;
        const jobId = params.jobId;
        const job = this.jobRepository.getJobConfiguration(jobId);

        if (!job) {
            response
                .status(400)
                .send(`Job with ID '${jobId}' does not exist`);
            return;
        }

        this.jobRunner.runJob(job);
        response.end();
    }
}
