'use strict';

import { mkdir } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import JobRunner from './jobRunner';
import JobCreator from './jobCreator';
import JobConfiguration from '../../common/models/jobConfiguration';
import JobInfo from '../../common/models/jobInfo';
import { JOBS_FOLDER } from './jobFileConstants';
import JobResult from '../../common/models/jobResult';
import { JOB_FINISHED_EVENT } from './jobEvents';
import JobEventEmitter from './jobEventEmitter';

const mkdirAsync = promisify(mkdir);

export default class JobScheduler {

    private readonly jobRunners = new Array<JobRunner>();

    public constructor(
        private readonly jobCreator: JobCreator,
        private lastJobNumber: number,
        private readonly jobEventEmitter: JobEventEmitter
    ) {
        if (!jobCreator) {
            throw new Error('jobInstanceCreator not specified');
        }
        if (!isFinite(lastJobNumber) || lastJobNumber < 0) {
            throw new Error('lastJobNumber must be a positive number');
        }
        if (!jobEventEmitter) {
            throw new Error('jobEventEmitter not specified');
        }
    }

    public async run(jobConfiguration: JobConfiguration): Promise<void> {
        if (!jobConfiguration) {
            throw new Error('no job configuration specified');
        }
        this.lastJobNumber++;
        try {
            await this.createJobFolder(this.lastJobNumber);
        } catch (error) {
            const jobInfo: JobInfo = {
                id: jobConfiguration.id,
                currentStepIndex: -1,
                number: this.lastJobNumber,
                result: JobResult.Failed,
                stepCount: jobConfiguration.stepConfigurations.length
            };
            this.emitJobFinished(jobInfo);
            return;
        }
        const job = this.jobCreator.create(jobConfiguration, this.lastJobNumber);
        const jobRunner = new JobRunner(job, this.jobEventEmitter);
        this.jobRunners.push(jobRunner);
        await jobRunner.run();
    }

    public cancel(jobNumber: number): void {
        const runningJob = this.jobRunners
            .find(jobRunner => jobRunner.jobNumber === jobNumber);
        if (!runningJob) {
            return;
        }
        runningJob.cancel();
    }

    public getJobInfos(): Array<JobInfo> {
        return this.jobRunners.map(jobRunner => ({
            id: jobRunner.jobId,
            number: jobRunner.jobNumber,
            currentStepIndex: jobRunner.currentStepIndex,
            result: jobRunner.result,
            stepCount: jobRunner.stepCount
        }));
    }

    private createJobFolder(jobNumber: number): Promise<void> {
        const jobFolder = join(JOBS_FOLDER, jobNumber.toString());
        return mkdirAsync(jobFolder);
    }

    private emitJobFinished(jobInfo: JobInfo): void {
        this.jobEventEmitter.emit(JOB_FINISHED_EVENT, jobInfo);
    }
}
