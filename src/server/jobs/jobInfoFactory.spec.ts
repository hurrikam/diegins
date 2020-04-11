'use strict';

import { getJobInfoFromJobRunner } from './jobInfoFactory';
import JobRunner from './jobRunner';
import JobInfo from '../../common/models/jobInfo';
import JobStatus from '../../common/models/jobStatus';
import Job from './job';
import JobEnvironmentVariables from './jobEnvironmentVariables';
import JobEventEmitter from './jobEventEmitter';
import { EventEmitter } from 'events';
import JobResult from '../../common/models/jobResult';

const TEST_JOB_ID = 'test_job_id';

function createTestJobRunner(): JobRunner {
    const jobEventEmitter = new EventEmitter() as JobEventEmitter;
    return new JobRunner(
        {
            id: TEST_JOB_ID,
            number: 1,
            steps: []
        } as Job,
        {} as JobEnvironmentVariables,
        jobEventEmitter
    );
}

describe('getJobInfoFromJobRunner', () => {

    test('throws an error if no JobRunner is passed', () => {
        expect(() => getJobInfoFromJobRunner(undefined))
            .toThrow('No jobRunner specified');
    });

    test('returns the expected JobInfo when a JobRunner has not run yet', () => {
        const jobId = 'test_job_id';
        const jobRunner = createTestJobRunner();
        const jobInfo = getJobInfoFromJobRunner(jobRunner);
        expect(jobInfo)
            .toEqual({
                id: jobId,
                currentStepIndex: -1,
                number: 1,
                result: undefined,
                status: JobStatus.Scheduled,
                stepCount: 0
            } as JobInfo);
    });

    test('returns the expected JobInfo when a JobRunner has started running', () => {
        const jobId = 'test_job_id';
        const jobRunner = createTestJobRunner();
        jobRunner.run();
        const jobInfo = getJobInfoFromJobRunner(jobRunner);
        expect(jobInfo)
            .toEqual({
                id: jobId,
                currentStepIndex: -1,
                number: 1,
                result: undefined,
                status: JobStatus.Running,
                stepCount: 0
            } as JobInfo);
    });

    test('returns the expected JobInfo when a JobRunner has finished running', async () => {
        const jobId = 'test_job_id';
        const jobRunner = createTestJobRunner();
        await jobRunner.run();
        const jobInfo = getJobInfoFromJobRunner(jobRunner);
        expect(jobInfo)
            .toEqual({
                id: jobId,
                currentStepIndex: -1,
                number: 1,
                result: JobResult.Succeeded,
                status: JobStatus.Finished,
                stepCount: 0
            } as JobInfo);
    });
});
