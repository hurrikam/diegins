'use strict';

import { Request, Response } from 'express';
import Command from '../command';
import { GET_JOB_CONFIGURATIONS } from '../../common/api/endpoints';
import JobConfigurationRepository from '../jobs/jobConfigurationRepository';
import { GET } from '../httpMethods';

export default class GetJobConfigurationsCommand implements Command {

    public readonly endpoint = GET_JOB_CONFIGURATIONS;
    public readonly method = GET;

    public constructor(private readonly jobRepository: JobConfigurationRepository) {
        if (!jobRepository) {
            throw new Error('jobRepository not specified');
        }
    }

    public execute(request: Request, response: Response): void {
        response.send(this.jobRepository.jobConfigurations);
    }
}
