'use strict';

import JobRunner from './jobRunner';
import Job from './job';
import { EventEmitter } from 'events';
import JobEventEmitter from './jobEventEmitter';
import { JOB_STARTED_EVENT, JOB_FINISHED_EVENT } from './jobEvents';
import JobInfo from '../../common/models/jobInfo';
import JobResult from '../../common/models/jobResult';
import JobStatus from '../../common/models/jobStatus';
import JobStep from './jobStep';
import JobEnvironmentVariables from './jobEnvironmentVariables';

function createSuccessfulStep(): JobStep {
    return {
        // tslint:disable-next-line:no-empty
        cancel: () => {},
        execute: () => Promise.resolve(JobResult.Succeeded)
    };
}

function createTestJob(): Job {
    return {
        id: 'test_job',
        number: 1,
        steps: [
            createSuccessfulStep(),
            createSuccessfulStep()
        ],
        stepsData: new Array(2)
    };
}

function createTestJobArguments(): JobEnvironmentVariables {
    return {
        number: 1,
        workingDirectory: ''
    };
}

function createFailingTestJob(): Job {
    return {
        id: 'test_job',
        number: 1,
        steps: [{
            // tslint:disable-next-line:no-empty
            cancel: () => {},
            execute: () => {
                throw new Error();
            }
        } as JobStep],
        stepsData: new Array(1)
    };
}

describe('JobRunner', () => {

    describe('run', () => {

        test('throws an error if a job has been run already', async () => {
            const job = createTestJob();
            const jobArguments = createTestJobArguments();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobRunner = new JobRunner(job, jobArguments, jobEventEmitter);
            await jobRunner.run();
            await expect(jobRunner.run()).rejects.toEqual(new Error('The job cannot be restarted'));
        });

        test('emits the job started event', () => {
            const job = createTestJob();
            const jobArguments = createTestJobArguments();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobRunner = new JobRunner(job, jobArguments, jobEventEmitter);
            const jobStartedHandler = jest.fn();
            jobEventEmitter.on(JOB_STARTED_EVENT, jobStartedHandler);
            jobRunner.run();
            expect(jobStartedHandler).toHaveBeenCalledTimes(1);
            expect(jobStartedHandler).toHaveBeenCalledWith({
                id: 'test_job',
                number: 1,
                result: undefined,
                status: JobStatus.Running,
                stepCount: 2,
                currentStepIndex: -1
            } as JobInfo);
        });

        test('reports success if all steps executed with no error', async () => {
            const job = createTestJob();
            const jobArguments = createTestJobArguments();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobRunner = new JobRunner(job, jobArguments, jobEventEmitter);
            const jobFinishedHandler = jest.fn();
            jobEventEmitter.on(JOB_FINISHED_EVENT, jobFinishedHandler);
            const jobRunPromise = jobRunner.run();
            await expect(jobRunPromise).resolves.toBeUndefined();
            expect(jobRunner.result).toBe(JobResult.Succeeded);
            expect(jobRunner.status).toBe(JobStatus.Finished);
            expect(jobFinishedHandler).toHaveBeenCalledTimes(1);
            expect(jobFinishedHandler).toHaveBeenCalledWith({
                id: 'test_job',
                number: 1,
                result: JobResult.Succeeded,
                status: JobStatus.Finished,
                stepCount: 2,
                currentStepIndex: 1
            } as JobInfo);
        });

        test('reports failure when a step fails', async () => {
            const job = createFailingTestJob();
            const jobArguments = createTestJobArguments();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobRunner = new JobRunner(job, jobArguments, jobEventEmitter);
            const jobFinishedHandler = jest.fn();
            jobEventEmitter.on(JOB_FINISHED_EVENT, jobFinishedHandler);
            const jobRunPromise = jobRunner.run();
            await expect(jobRunPromise).resolves.toBeUndefined();
            expect(jobRunner.result).toBe(JobResult.Failed);
            expect(jobRunner.status).toBe(JobStatus.Finished);
            expect(jobFinishedHandler).toHaveBeenCalledTimes(1);
            expect(jobFinishedHandler).toHaveBeenCalledWith({
                id: 'test_job',
                number: 1,
                result: JobResult.Failed,
                status: JobStatus.Finished,
                stepCount: 1,
                currentStepIndex: 0
            } as JobInfo);
        });
    });

    describe('cancel', () => {

        test('abort the current step and reports cancellation', async () => {
            const job = createTestJob();
            const jobArguments = createTestJobArguments();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobRunner = new JobRunner(job, jobArguments, jobEventEmitter);
            const jobFinishedHandler = jest.fn();
            jobEventEmitter.on(JOB_FINISHED_EVENT, jobFinishedHandler);
            const jobRunPromise = jobRunner.run();
            jobRunner.cancel();
            await expect(jobRunPromise).resolves.toBeUndefined();
            expect(jobRunner.result).toBe(JobResult.Canceled);
            expect(jobRunner.status).toBe(JobStatus.Finished);
            expect(jobFinishedHandler).toHaveBeenCalledTimes(1);
            expect(jobFinishedHandler).toHaveBeenCalledWith({
                id: 'test_job',
                number: 1,
                result: JobResult.Canceled,
                status: JobStatus.Finished,
                stepCount: 2,
                currentStepIndex: 0
            } as JobInfo);
        });
    });
});
