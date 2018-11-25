'use strict';

import { EventEmitter } from 'events';
import JobConfigurationRepository from './jobs/jobConfigurationRepository';
import JobStepRepository from './jobs/jobStepRepository';
import JobScheduler from './jobs/jobScheduler';
import JobCreator from './jobs/jobCreator';
import JobRepository from './jobs/jobRepository';
import JobLogger from './jobs/jobLogger';
import JobEventEmitter from './jobs/jobEventEmitter';

let jobEventEmitter: JobEventEmitter;
let jobInstanceCreator: JobCreator;
let jobConfigurationRepository: JobConfigurationRepository;
let jobScheduler: JobScheduler;
let jobRepository: JobRepository;
let jobStepRepository: JobStepRepository;
let jobLogger: JobLogger;

export async function initializeServices(): Promise<void> {
    jobEventEmitter = new EventEmitter();
    jobConfigurationRepository = new JobConfigurationRepository();
    jobConfigurationRepository.initialize();
    jobStepRepository = new JobStepRepository();
    jobStepRepository.initialize();
    jobInstanceCreator = new JobCreator(jobStepRepository);
    jobRepository = new JobRepository();
    const lastJobNumber = await jobRepository.getLastJobNumber();
    jobScheduler = new JobScheduler(jobInstanceCreator, lastJobNumber, jobEventEmitter);
    jobLogger = new JobLogger(jobEventEmitter);
}

export function getJobEventEmitter(): JobEventEmitter {
    return jobEventEmitter;
}

export function getJobConfigurationRepository(): JobConfigurationRepository {
    return jobConfigurationRepository;
}

export function getJobRepository(): JobRepository {
    return jobRepository;
}

export function getJobRunner(): JobScheduler {
    return jobScheduler;
}

export function getJobStepRepository(): JobStepRepository {
    return jobStepRepository;
}
