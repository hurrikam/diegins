'use strict';

import { EventEmitter } from 'events';
import { promises as fs } from 'fs';
import JobConfigurationRepository from './jobs/jobConfigurationRepository';
import JobStepRepository from './jobs/jobStepRepository';
import JobScheduler from './jobs/jobScheduler';
import JobCreator from './jobs/jobCreator';
import JobRepository from './jobs/jobRepository';
import JobLogger from './jobs/jobLogger';
import JobLogReader from './jobs/jobLogReader';
import JobEventEmitter from './jobs/jobEventEmitter';
import { JOB_STEPS_ROOT } from './jobs/jobFileConstants';
import FileSystemService from './services/fileSystemService';

let jobEventEmitter: JobEventEmitter;
let jobInstanceCreator: JobCreator;
let jobConfigurationRepository: JobConfigurationRepository;
let jobScheduler: JobScheduler;
let jobRepository: JobRepository;
let jobStepRepository: JobStepRepository;
let jobLogger: JobLogger;
let jobLogReader: JobLogReader;

export async function initializeServices(): Promise<void> {
    const fileSystemService = {
        mkdir: fs.mkdir,
        readdir: fs.readdir,
        readFile: fs.readFile,
        writeFile: fs.writeFile
    } as FileSystemService;
    jobEventEmitter = new EventEmitter();
    jobConfigurationRepository = new JobConfigurationRepository(fileSystemService);
    await jobConfigurationRepository.initialize();
    jobStepRepository = new JobStepRepository(JOB_STEPS_ROOT);
    jobStepRepository.initialize();
    jobInstanceCreator = new JobCreator(jobStepRepository);
    jobRepository = new JobRepository();
    const lastJobNumber = await jobRepository.getLastJobNumber();
    jobScheduler = new JobScheduler(
        jobInstanceCreator,
        lastJobNumber,
        jobEventEmitter,
        fileSystemService);
    jobLogger = new JobLogger(jobEventEmitter);
    jobLogReader = new JobLogReader(fs.readFile);
}

export function getJobEventEmitter(): JobEventEmitter {
    return jobEventEmitter;
}

export function getJobConfigurationRepository(): JobConfigurationRepository {
    return jobConfigurationRepository;
}

export function getJobLogReader(): JobLogReader {
    return jobLogReader;
}

export function getJobRepository(): JobRepository {
    return jobRepository;
}

export function getJobScheduler(): JobScheduler {
    return jobScheduler;
}

export function getJobStepRepository(): JobStepRepository {
    return jobStepRepository;
}
