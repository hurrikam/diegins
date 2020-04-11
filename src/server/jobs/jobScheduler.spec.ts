'use strict';

import { join } from 'path';
import JobScheduler from './jobScheduler';
import JobCreator from './jobCreator';
import { EventEmitter } from 'events';
import JobEventEmitter from './jobEventEmitter';
import Job from './job';
import JobConfiguration from '../../common/models/jobConfiguration';
import { JOBS_FOLDER } from './jobFileConstants';
import { JOB_FINISHED_EVENT, JOB_STARTED_EVENT } from './jobEvents';
import JobInfo from '../../common/models/jobInfo';
import JobResult from '../../common/models/jobResult';
import JobStatus from '../../common/models/jobStatus';
import JobStep from './jobStep';
import FileSystemService from '../services/fileSystemService';

const TEST_JOB_ID = 'test_job';
const VALID_JOB_FOLDER = join(JOBS_FOLDER, '1', 'workdir');

function createMockFileSystemService(): FileSystemService {
    return {
        mkdir: jest.fn((path: string, options: {}) => Promise.resolve()),
        readdir: undefined,
        readFile: undefined,
        writeFile: undefined
    };
}

function createTestJobConfiguration(maximumConcurrentJobs?: number): JobConfiguration {
    return {
        id: TEST_JOB_ID,
        maximumConcurrentJobs,
        parameters: [],
        stepConfigurations: []
    };
}

function createSuccessfulStep(): JobStep {
    return {
        // tslint:disable-next-line:no-empty
        cancel: () => { },
        execute: () => new Promise(resolve => setImmediate(resolve, JobResult.Succeeded))
    };
}

function createMockJobCreator(): JobCreator {
    return {
        create: (jobNumber: number, jobConfiguration: JobConfiguration) => ({
            id: jobConfiguration.id,
            number: jobNumber,
            steps: [createSuccessfulStep()],
            stepsData: [undefined]
        } as Job)
    } as JobCreator;
}

describe('JobScheduler', () => {

    describe('schedule', () => {

        test('throws an exception if no job configuration is passed', async () => {
            const fs = createMockFileSystemService();
            const jobCreator = {} as JobCreator;
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobScheduler = new JobScheduler(jobCreator, 0, jobEventEmitter, fs);
            await expect(jobScheduler.schedule(undefined))
                .rejects.toEqual(new Error('no job configuration specified'));
        });

        test('creates a folder for the job and starts the job', async () => {
            const fs = createMockFileSystemService();
            const jobCreator = createMockJobCreator();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobStartedHandler = jest.fn();
            jobEventEmitter.on(JOB_STARTED_EVENT, jobStartedHandler);
            const jobScheduler = new JobScheduler(jobCreator, 0, jobEventEmitter, fs);
            const jobConfiguration = createTestJobConfiguration();
            await jobScheduler.schedule(jobConfiguration);
            const jobRunners = jobScheduler.getJobRunners();
            expect(jobRunners[0].status).toBe(JobStatus.Running);
            expect(fs.mkdir).toHaveBeenCalledTimes(1);
            expect(fs.mkdir).toHaveBeenCalledWith(VALID_JOB_FOLDER, { recursive: true });
            expect(jobStartedHandler).toHaveBeenCalledTimes(1);
            expect(jobStartedHandler).toHaveBeenCalledWith({
                id: TEST_JOB_ID,
                currentStepIndex: -1,
                number: 1,
                result: undefined,
                status: JobStatus.Running,
                stepCount: 1
            } as JobInfo);
        });

        test('does not schedule a job if the job folder and reports failure', async () => {
            const fs = createMockFileSystemService();
            fs.mkdir = jest.fn(() => Promise.reject('Error while creating the test job folder'));
            const jobCreator = createMockJobCreator();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobStartedHandler = jest.fn();
            jobEventEmitter.on(JOB_STARTED_EVENT, jobStartedHandler);
            const jobFinishedHandler = jest.fn();
            jobEventEmitter.on(JOB_FINISHED_EVENT, jobFinishedHandler);
            const jobScheduler = new JobScheduler(jobCreator, 1, jobEventEmitter, fs);
            const jobConfiguration = createTestJobConfiguration();
            await jobScheduler.schedule(jobConfiguration);
            const jobRunners = jobScheduler.getJobRunners();
            expect(jobRunners).toHaveLength(0);
            expect(fs.mkdir).toHaveBeenCalledTimes(1);
            expect(jobStartedHandler).not.toHaveBeenCalled();
            expect(jobFinishedHandler).toHaveBeenCalledTimes(1);
            expect(jobFinishedHandler).toHaveBeenCalledWith({
                id: TEST_JOB_ID,
                currentStepIndex: -1,
                number: 2,
                result: JobResult.Failed,
                status: JobStatus.Finished,
                stepCount: 0
            } as JobInfo);
        });

        test('executes a second job in parallel', async () => {
            const fs = createMockFileSystemService();
            const jobCreator = createMockJobCreator();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobScheduler = new JobScheduler(jobCreator, 0, jobEventEmitter, fs);
            const jobConfiguration = createTestJobConfiguration();
            await jobScheduler.schedule(jobConfiguration);
            await jobScheduler.schedule(jobConfiguration);
            const jobRunners = jobScheduler.getJobRunners();
            expect(jobRunners[1].status).toBe(JobStatus.Running);
        });

        test('queues a job if it cannot run in parallel', async () => {
            const fs = createMockFileSystemService();
            const jobCreator = createMockJobCreator();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobScheduler = new JobScheduler(jobCreator, 0, jobEventEmitter, fs);
            const jobConfiguration = createTestJobConfiguration(1);
            await jobScheduler.schedule(jobConfiguration);
            await jobScheduler.schedule(jobConfiguration);
            const jobRunners = jobScheduler.getJobRunners();
            expect(jobRunners[1].status).toBe(JobStatus.Scheduled);
        });

        test('starts a queued job once a previous one has completed', async () => {
            const fs = createMockFileSystemService();
            const jobCreator = createMockJobCreator();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobScheduler = new JobScheduler(jobCreator, 0, jobEventEmitter, fs);
            const jobConfiguration = createTestJobConfiguration(1);
            await jobScheduler.schedule(jobConfiguration);
            await jobScheduler.schedule(jobConfiguration);
            const firstJobFinishedPromise = new Promise(resolve =>
                jobEventEmitter.on(JOB_FINISHED_EVENT, (jobInfo: JobInfo) => {
                    if (jobInfo.number === 1) {
                        resolve();
                    }
                }));
            await firstJobFinishedPromise;
            const jobRunners = jobScheduler.getJobRunners();
            expect(jobRunners[0].status).toBe(JobStatus.Finished);
            expect(jobRunners[1].status).toBe(JobStatus.Running);
        });
    });
});
