'use strict';

import JobRunner from './jobRunner';
import Job from './job';
import { EventEmitter } from 'events';
import JobEventEmitter from './jobEventEmitter';
import { JOB_STARTED_EVENT, JOB_FINISHED_EVENT } from './jobEvents';
import JobInfo from '../../common/models/jobInfo';
import JobResult from '../../common/models/jobResult';
import JobStep from './jobStep';

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
        ]
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
        } as JobStep]
    };
}

describe('JobRunner', () => {

    describe('run', () => {

        test('throws an error if a job has been run already', async () => {
            const job = createTestJob();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobRunner = new JobRunner(job, jobEventEmitter);
            await jobRunner.run();
            await expect(jobRunner.run()).rejects.toEqual(new Error('The job cannot be restarted'));
        });

        test('emits the job started event', () => {
            const job = createTestJob();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobRunner = new JobRunner(job, jobEventEmitter);
            const jobStartedHandler = jest.fn();
            jobEventEmitter.on(JOB_STARTED_EVENT, jobStartedHandler);
            jobRunner.run();
            expect(jobStartedHandler).toHaveBeenCalledTimes(1);
            expect(jobStartedHandler).toHaveBeenCalledWith({
                id: 'test_job',
                number: 1,
                result: undefined,
                stepCount: 2,
                currentStepIndex: -1
            } as JobInfo);
        });

        test('reports success if all steps executed with no error', async () => {
            const job = createTestJob();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobRunner = new JobRunner(job, jobEventEmitter);
            const jobFinishedHandler = jest.fn();
            jobEventEmitter.on(JOB_FINISHED_EVENT, jobFinishedHandler);
            await expect(jobRunner.run()).resolves.toBe(JobResult.Succeeded);
            expect(jobFinishedHandler).toHaveBeenCalledTimes(1);
            expect(jobFinishedHandler).toHaveBeenCalledWith({
                id: 'test_job',
                number: 1,
                result: JobResult.Succeeded,
                stepCount: 2,
                currentStepIndex: 1
            } as JobInfo);
        });

        test('reports failure when a step fails', async () => {
            const job = createFailingTestJob();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobRunner = new JobRunner(job, jobEventEmitter);
            const jobFinishedHandler = jest.fn();
            jobEventEmitter.on(JOB_FINISHED_EVENT, jobFinishedHandler);
            await expect(jobRunner.run()).resolves.toBe(JobResult.Failed);
            expect(jobFinishedHandler).toHaveBeenCalledTimes(1);
            expect(jobFinishedHandler).toHaveBeenCalledWith({
                id: 'test_job',
                number: 1,
                result: JobResult.Failed,
                stepCount: 1,
                currentStepIndex: 0
            } as JobInfo);
        });
    });

    describe('cancel', () => {

        test('abort the current step and reports cancellation', async () => {
            const job = createTestJob();
            const jobEventEmitter = new EventEmitter() as JobEventEmitter;
            const jobRunner = new JobRunner(job, jobEventEmitter);
            const jobFinishedHandler = jest.fn();
            jobEventEmitter.on(JOB_FINISHED_EVENT, jobFinishedHandler);
            const jobRunPromise = jobRunner.run();
            jobRunner.cancel();
            await expect(jobRunPromise).resolves.toBe(JobResult.Canceled);
            expect(jobFinishedHandler).toHaveBeenCalledTimes(1);
            expect(jobFinishedHandler).toHaveBeenCalledWith({
                id: 'test_job',
                number: 1,
                result: JobResult.Canceled,
                stepCount: 2,
                currentStepIndex: 0
            } as JobInfo);
        });
    });
});
