'use strict';

import Job from './job';
import JobCreator from './jobCreator';
import JobConfiguration from '../../common/models/jobConfiguration';
import JobInfo from '../../common/models/jobInfo';

export default class JobRunner {

    private readonly jobs = new Array<Job>();
    private nextJobNumber = 0;

    public constructor(private readonly jobInstanceCreator: JobCreator) {
        if (!jobInstanceCreator) {
            throw new Error('jobInstanceCreator not specified');
        }
    }

    public runJob(job: JobConfiguration): void {
        if (!job) {
            throw new Error('job not specified');
        }
        this.nextJobNumber++;
        const jobInstance = this.jobInstanceCreator.create(job, this.nextJobNumber);
        this.jobs.push(jobInstance);
        jobInstance.run()
            .catch()
            .then(() => {
                const jobIndex = this.jobs.indexOf(jobInstance);
                // this.jobs.splice(jobIndex, 1);
            });
    }

    public cancelJob(jobNumber: number): void {
        const runningJob = this.jobs
            .find(jobInstance => jobInstance.jobNumber === jobNumber);
        if (!runningJob) {
            return;
        }
        runningJob.cancel();
    }

    public getJobInfos(): Array<JobInfo> {
        return this.jobs.map(job => ({
            id: job.jobId,
            number: job.jobNumber,
            currentStepIndex: job.currentStepIndex,
            result: job.result,
            stepCount: job.steps.length
        } as JobInfo));
    }
}
