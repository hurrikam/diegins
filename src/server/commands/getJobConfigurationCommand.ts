'use strict';

import { Request, Response } from 'express';
import Command from '../command';
import { GET_JOB_CONFIGURATION } from '../../common/api/endpoints';
import JobConfigurationRepository from '../jobs/jobConfigurationRepository';
import { GET } from '../httpMethods';

export default class GetJobConfigurationCommand implements Command {

    public readonly endpoint = GET_JOB_CONFIGURATION;
    public readonly method = GET;

    public constructor(private readonly jobConfigurationRepository: JobConfigurationRepository) {
        if (!jobConfigurationRepository) {
            throw new Error('jobConfigurationRepository not specified');
        }
    }

    public execute(request: Request, response: Response): void {
        const jobId = request.params.jobId;
        const jobConfiguration = this.jobConfigurationRepository.jobConfigurations
            .find(configuration => configuration.id === jobId);
        response.send(jobConfiguration);
    }
}
