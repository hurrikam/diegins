'use strict';

import { Request, Response } from 'express';
import Command from '../command';
import { CREATE_JOB_CONFIGURATION } from '../../common/api/endpoints';
import JobConfigurationRepository from '../jobs/jobConfigurationRepository';
import { POST } from '../httpMethods';
import JobConfiguration from '../../common/models/jobConfiguration';

export default class CreateJobConfigurationCommand implements Command {

    public readonly endpoint = CREATE_JOB_CONFIGURATION;
    public readonly method = POST;

    public constructor(private readonly jobConfigurationRepository: JobConfigurationRepository) {
        if (!jobConfigurationRepository) {
            throw new Error('jobConfigurationRepository not specified');
        }
    }

    public async execute(request: Request, response: Response): Promise<void> {
        const jobConfiguration = request.body as JobConfiguration;
        const configurationExists = !!this.jobConfigurationRepository
            .getJobConfiguration(jobConfiguration.id);
        if (configurationExists) {
            response.status(400);
            response.send('A configuration with this ID exists already');
            return;
        }
        try {
            await this.jobConfigurationRepository.saveJobConfiguration(jobConfiguration);
            response.send();
        } catch (error) {
            response.status(400);
            response.send(error.message);
        }
    }
}
