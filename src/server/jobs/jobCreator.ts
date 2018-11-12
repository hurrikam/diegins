'use strict';

import Job from './job';
import JobStepRepository from './jobStepRepository';
import JobConfiguration from '../../common/models/jobConfiguration';

export default class JobCreator {

    constructor(private readonly jobStepRepository: JobStepRepository) {
        if (!jobStepRepository) {
            throw new Error('jobStepRepository not specified');
        }
    }

    public create(job: JobConfiguration, jobNumber: number): Job {
        if (!job) {
            throw new Error('job not specified');
        }
        if (jobNumber <= 0) {
            throw new Error('jobNumber must be positive');
        }
        const steps = job.stepIds
            .map(stepId => this.jobStepRepository.createJobStep(stepId))
            .filter(step => step);
        return new Job(job.id, jobNumber, steps);
    }
}
