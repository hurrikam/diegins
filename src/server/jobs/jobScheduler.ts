'use strict';

import { join } from 'path';
import JobRunner from './jobRunner';
import JobCreator from './jobCreator';
import JobConfiguration from '../../common/models/jobConfiguration';
import JobInfo from '../../common/models/jobInfo';
import { JOBS_FOLDER, JOB_WORKING_DIR_NAME } from './jobFileConstants';
import JobResult from '../../common/models/jobResult';
import { JOB_FINISHED_EVENT } from './jobEvents';
import JobEventEmitter from './jobEventEmitter';
import JobEnvironmentVariables from './jobEnvironmentVariables';
import FileSystemService from '../services/fileSystemService';
import JobParameterValues from '../../common/models/jobParameterValues';
import JobStatus from '../../common/models/jobStatus';

export default class JobScheduler {

    private readonly jobRunners = new Array<JobRunner>();

    public constructor(
        private readonly jobCreator: JobCreator,
        private lastJobNumber: number,
        private readonly jobEventEmitter: JobEventEmitter,
        private readonly fileSystemService: FileSystemService
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
        if (!fileSystemService) {
            throw new Error('fileSystemService not specified');
        }
    }

    public async run(jobConfiguration: JobConfiguration, jobParameterValues?: JobParameterValues): Promise<void> {
        if (!jobConfiguration) {
            throw new Error('no job configuration specified');
        }
        this.lastJobNumber++;
        try {
            await this.createJobWorkingDirectory(this.lastJobNumber);
        } catch (error) {
            const jobInfo: JobInfo = {
                id: jobConfiguration.id,
                currentStepIndex: -1,
                number: this.lastJobNumber,
                result: JobResult.Failed,
                status: JobStatus.Finished,
                stepCount: jobConfiguration.stepConfigurations.length
            };
            this.emitJobFinished(jobInfo);
            return;
        }
        const job = this.jobCreator.create(this.lastJobNumber, jobConfiguration, jobParameterValues);
        const environmentVariables = {
            number: job.number,
            workingDirectory: this.getJobWorkingDirectory(job.number)
        } as JobEnvironmentVariables;
        const jobRunner = new JobRunner(job, environmentVariables, this.jobEventEmitter);
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
            status: jobRunner.status,
            stepCount: jobRunner.stepCount
        }));
    }

    private getJobWorkingDirectory(jobNumber: number): string {
        return join(JOBS_FOLDER, jobNumber.toString(), JOB_WORKING_DIR_NAME);
    }

    private createJobWorkingDirectory(jobNumber: number): Promise<void> {
        const jobWorkingDirectory = this.getJobWorkingDirectory(jobNumber);
        return this.fileSystemService.mkdir(jobWorkingDirectory, { recursive: true });
    }

    private emitJobFinished(jobInfo: JobInfo): void {
        this.jobEventEmitter.emit(JOB_FINISHED_EVENT, jobInfo);
    }
}
