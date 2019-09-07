'use strict';

import JobStepRepository from './jobStepRepository';
import JobConfiguration from '../../common/models/jobConfiguration';
import Job from './job';
import JobParameterValues from '../../common/models/jobParameterValues';

export default class JobCreator {

    constructor(private readonly jobStepRepository: JobStepRepository) {
        if (!jobStepRepository) {
            throw new Error('jobStepRepository not specified');
        }
    }

    public create(
        jobNumber: number,
        jobConfiguration: JobConfiguration,
        jobParameterValues?: JobParameterValues): Job {
        if (!jobConfiguration) {
            throw new Error('jobConfiguration not specified');
        }
        if (jobNumber <= 0) {
            throw new Error('jobNumber must be positive');
        }
        const steps = jobConfiguration.stepConfigurations
            .map(stepConfiguration => this.jobStepRepository.createJobStep(stepConfiguration.stepId))
            .filter(step => step);
        const stepsData = jobConfiguration.stepConfigurations
            .map(stepConfiguration => stepConfiguration.data);
        return {
            id: jobConfiguration.id,
            number: jobNumber,
            parameterValues: jobParameterValues,
            steps,
            stepsData
        };
    }
}
