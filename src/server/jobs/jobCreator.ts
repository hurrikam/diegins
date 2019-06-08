'use strict';

import JobStepRepository from './jobStepRepository';
import JobConfiguration from '../../common/models/jobConfiguration';
import Job from './job';

export default class JobCreator {

    constructor(private readonly jobStepRepository: JobStepRepository) {
        if (!jobStepRepository) {
            throw new Error('jobStepRepository not specified');
        }
    }

    public create(jobConfiguration: JobConfiguration, jobNumber: number): Job {
        if (!jobConfiguration) {
            throw new Error('jobConfiguration not specified');
        }
        if (jobNumber <= 0) {
            throw new Error('jobNumber must be positive');
        }
        const steps = jobConfiguration.stepConfigurations
            .map(stepConfiguration => this.jobStepRepository.createJobStep(stepConfiguration.stepId))
            .filter(step => step);
        return {
            id: jobConfiguration.id,
            number: jobNumber,
            steps
        };
    }
}
