'use strict';

import { Request, Response } from 'express';
import Command from '../command';
import { SAVE_JOB_CONFIGURATION } from '../../common/api/endpoints';
import JobConfigurationRepository from '../jobs/jobConfigurationRepository';
import { POST } from '../httpMethods';
import JobConfiguration from '../../common/models/jobConfiguration';

export default class SaveJobConfigurationsCommand implements Command {

    public readonly endpoint = SAVE_JOB_CONFIGURATION;
    public readonly method = POST;

    public constructor(private readonly jobConfigurationRepository: JobConfigurationRepository) {
        if (!jobConfigurationRepository) {
            throw new Error('jobConfigurationRepository not specified');
        }
    }

    public async execute(request: Request, response: Response): Promise<void> {
        console.log('Received request', request)
        const jobConfiguration = request.body as JobConfiguration;
        try {
            await this.jobConfigurationRepository.saveJobConfiguration(jobConfiguration);
            response.send();
        } catch (error) {
            response.status(400);
            response.send(error);
        }
    }
}
