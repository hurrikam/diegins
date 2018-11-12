'use strict';

import JobConfigurationRepository from './jobs/jobConfigurationRepository';
import JobStepRepository from './jobs/jobStepRepository';
import JobRunner from './jobs/jobRunner';
import JobCreator from './jobs/jobCreator';

let jobInstanceCreator: JobCreator;
let jobRepository: JobConfigurationRepository;
let jobRunner: JobRunner;
let jobStepRepository: JobStepRepository;

export function initializeService(): void {
    jobRepository = new JobConfigurationRepository();
    jobRepository.initialize();
    jobStepRepository = new JobStepRepository();
    jobStepRepository.initialize();
    jobInstanceCreator = new JobCreator(jobStepRepository);
    jobRunner = new JobRunner(jobInstanceCreator);
}

export function getJobRepository(): JobConfigurationRepository {
    return jobRepository;
}

export function getJobRunner(): JobRunner {
    return jobRunner;
}

export function getJobStepRepository(): JobStepRepository {
    return jobStepRepository;
}
