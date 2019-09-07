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
import JobStep from './jobStep';
import FileSystemService from '../services/fileSystemService';

const TEST_JOB_ID = 'test_job';
const VALID_JOB_FOLDER = join(JOBS_FOLDER, '1', 'workdir');

function createMockFileSystemService(): FileSystemService {
    return {
        mkdir: jest.fn((path: string, options: {}) => {
            if (path === VALID_JOB_FOLDER) {
                return Promise.resolve();
            }
            return Promise.reject('Error while creating the test job folder');
        })
    };
}

function createTestJobConfiguration(): JobConfiguration {
    return {
        id: TEST_JOB_ID,
        parameters: [],
        stepConfigurations: []
    };
}

function createSuccessfulStep(): JobStep {
    return {
        // tslint:disable-next-line:no-empty
        cancel: () => { },
        execute: () => Promise.resolve(JobResult.Succeeded)
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

    describe('run', () => {

        test('throws an exception if no job configuration is passed', async () => {
            const fs = createMockFileSystemService();
            const jobCreator = {} as JobCreator;
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobScheduler = new JobScheduler(jobCreator, 0, jobEventEmitter, fs);
            await expect(jobScheduler.run(undefined))
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
            await jobScheduler.run(jobConfiguration);
            expect(fs.mkdir).toHaveBeenCalledTimes(1);
            expect(fs.mkdir).toHaveBeenCalledWith(VALID_JOB_FOLDER, { recursive: true });
            expect(jobStartedHandler).toHaveBeenCalledTimes(1);
            expect(jobStartedHandler).toHaveBeenCalledWith({
                id: TEST_JOB_ID,
                currentStepIndex: -1,
                number: 1,
                result: undefined,
                stepCount: 1
            } as JobInfo);
        });

        test('reports failure if the job folder cannot be created without starting the job', async () => {
            const fs = createMockFileSystemService();
            const jobCreator = createMockJobCreator();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobStartedHandler = jest.fn();
            jobEventEmitter.on(JOB_STARTED_EVENT, jobStartedHandler);
            const jobFinishedHandler = jest.fn();
            jobEventEmitter.on(JOB_FINISHED_EVENT, jobFinishedHandler);
            const jobScheduler = new JobScheduler(jobCreator, 1, jobEventEmitter, fs);
            const jobConfiguration = createTestJobConfiguration();
            await jobScheduler.run(jobConfiguration);
            expect(fs.mkdir).toHaveBeenCalledTimes(1);
            expect(jobStartedHandler).not.toHaveBeenCalledWith();
            expect(jobFinishedHandler).toHaveBeenCalledTimes(1);
            expect(jobFinishedHandler).toHaveBeenCalledWith({
                id: TEST_JOB_ID,
                currentStepIndex: -1,
                number: 2,
                result: JobResult.Failed,
                stepCount: 0
            } as JobInfo);
        });
    });

    describe('cancel', () => {

        test('aborts a scheduled job', async () => {
            const fs = createMockFileSystemService();
            const jobCreator = createMockJobCreator();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            jobEventEmitter.on(JOB_STARTED_EVENT, () => jobScheduler.cancel(1));
            const jobFinishedHandler = jest.fn();
            jobEventEmitter.on(JOB_FINISHED_EVENT, jobFinishedHandler);
            const jobScheduler = new JobScheduler(jobCreator, 0, jobEventEmitter, fs);
            const jobConfiguration = createTestJobConfiguration();
            await jobScheduler.run(jobConfiguration);
            expect(jobFinishedHandler).toHaveBeenCalledTimes(1);
            expect(jobFinishedHandler).toHaveBeenCalledWith({
                id: TEST_JOB_ID,
                currentStepIndex: 0,
                number: 1,
                result: JobResult.Canceled,
                stepCount: 1
            } as JobInfo);
        });

        test('does nothing if the specified job is not running', () => {
            const fs = createMockFileSystemService();
            const jobCreator = createMockJobCreator();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobScheduler = new JobScheduler(jobCreator, 0, jobEventEmitter, fs);
            jobScheduler.cancel(1);
        });
    });

    describe('getJobInfos', () => {

        test('returns an empty array if no job is running', () => {
            const fs = createMockFileSystemService();
            const jobCreator = createMockJobCreator();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobScheduler = new JobScheduler(jobCreator, 0, jobEventEmitter, fs);
            expect(jobScheduler.getJobInfos()).toHaveLength(0);
        });

        test('returns an array containing information about scheduled jobs', async () => {
            const fs = createMockFileSystemService();
            const jobCreator = createMockJobCreator();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobScheduler = new JobScheduler(jobCreator, 0, jobEventEmitter, fs);
            const jobConfiguration = createTestJobConfiguration();
            await jobScheduler.run(jobConfiguration);
            expect(jobScheduler.getJobInfos()).toEqual([{
                id: TEST_JOB_ID,
                currentStepIndex: 0,
                number: 1,
                result: JobResult.Succeeded,
                stepCount: 1
            } as JobInfo]);
        });
    });
});
