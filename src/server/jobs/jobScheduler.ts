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
        this.jobEventEmitter.on(JOB_FINISHED_EVENT, this.onJobFinished.bind(this));
    }

    public async schedule(jobConfiguration: JobConfiguration, jobParameterValues?: JobParameterValues): Promise<void> {
        if (!jobConfiguration) {
            throw new Error('no job configuration specified');
        }
        const jobId = jobConfiguration.id;
        this.lastJobNumber++;
        try {
            await this.createJobWorkingDirectory(this.lastJobNumber);
        } catch (error) {
            const jobInfo: JobInfo = {
                id: jobId,
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
        const canRunJob = this.canRunJob(jobConfiguration);
        this.jobRunners.push(jobRunner);
        if (!canRunJob) {
            return;
        }
        jobRunner.run();
    }

    public getJobRunners(): Array<JobRunner> {
        return [...this.jobRunners];
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

    private canRunJob(jobConfiguration: JobConfiguration): boolean {
        const maximumConcurrentJobs = jobConfiguration.maximumConcurrentJobs;
        if (!maximumConcurrentJobs) {
            return true;
        }
        const runningJobsPerConfiguration = this.jobRunners
            .filter(jobRunner => jobRunner.jobId === jobConfiguration.id &&
                jobRunner.status !== JobStatus.Finished)
            .length;
        if (runningJobsPerConfiguration < maximumConcurrentJobs) {
            return true;
        }
        return false;
    }

    private onJobFinished(jobInfo: JobInfo): void {
        const nextJobRunnerToStart = this.jobRunners
            .find(jobRunner => jobRunner.jobId === jobInfo.id &&
                jobRunner.status === JobStatus.Scheduled);
        if (nextJobRunnerToStart) {
            nextJobRunnerToStart.run();
        }
    }
}
