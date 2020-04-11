'use strict';

import Job from './job';
import JobResult from '../../common/models/jobResult';
import JobInfo from '../../common/models/jobInfo';
import JobEnvironmentVariables from './jobEnvironmentVariables';
import JobEventEmitter from './jobEventEmitter';
import JobStatus from '../../common/models/jobStatus';
import { JOB_STARTED_EVENT, JOB_OUTPUT_EVENT, JOB_FINISHED_EVENT } from './jobEvents';

export default class JobRunner {

    public readonly jobId: string;
    public readonly jobNumber: number;
    public readonly stepCount: number;
    public currentStepIndex = -1;
    public result?: JobResult;
    public status = JobStatus.Scheduled;
    private isCancelling = false;

    public constructor(
        private readonly job: Job,
        private readonly jobEnvironmentVariables: JobEnvironmentVariables,
        private readonly jobEventEmitter: JobEventEmitter
    ) {
        if (!job) {
            throw new Error('job not specified');
        }
        if (!jobEnvironmentVariables) {
            throw new Error('jobEnvironmentVariables not specified');
        }
        if (!jobEventEmitter) {
            throw new Error('jobEventEmitter not specified');
        }
        this.jobId = job.id;
        this.jobNumber = job.number;
        this.stepCount = job.steps.length;
    }

    public async run(): Promise<void> {
        if (this.hasStarted()) {
            throw new Error('The job cannot be restarted');
        }
        this.status = JobStatus.Running;
        let jobInfo = this.createJobInfo();
        this.jobEventEmitter.emit(JOB_STARTED_EVENT, jobInfo);
        try {
            this.result = await this.runSteps();
        } catch (error) {
            this.cancelCurrentStep();
            this.result = JobResult.Failed;
        } finally {
            this.finishJob();
        }
    }

    public cancel(): void {
        if (this.isCancelling) {
            return;
        }
        this.isCancelling = true;
        if (!this.hasStarted()) {
            this.result = JobResult.Canceled;
            this.finishJob();
            return;
        }
        this.cancelCurrentStep();
    }

    private hasStarted(): boolean {
        return this.status !== JobStatus.Scheduled;
    }

    private createJobInfo(): JobInfo {
        return {
            id: this.jobId,
            number: this.job.number,
            currentStepIndex: this.currentStepIndex,
            result: this.result,
            status: this.status,
            stepCount: this.stepCount
        };
    }

    private async runSteps(): Promise<JobResult> {
        let result = JobResult.Succeeded;
        for (let i = 0; i < this.stepCount; i++) {
            this.currentStepIndex = i;
            const step = this.job.steps[i];
            step.onOutput = this.onStepOutput.bind(this);
            try {
                const stepData = this.job.stepsData[i];
                result = await step.execute(stepData, this.jobEnvironmentVariables, this.job.parameterValues);
            } catch (error) {
                result = JobResult.Failed;
            } finally {
                step.onOutput = undefined;
            }
            if (this.isCancelling) {
                result = JobResult.Canceled;
            }
            if (result !== JobResult.Succeeded) {
                break;
            }
        }
        return result;
    }

    private cancelCurrentStep(): void {
        if (this.currentStepIndex < 0) {
            return;
        }
        try {
            this.job.steps[this.currentStepIndex].cancel();
        // tslint:disable-next-line:no-empty
        } catch (error) {
        }
    }

    private finishJob(): void {
        this.status = JobStatus.Finished;
        const jobInfo = this.createJobInfo();
        this.jobEventEmitter.emit(JOB_FINISHED_EVENT, jobInfo);
    }

    private onStepOutput(output: string): void {
        this.jobEventEmitter.emit(JOB_OUTPUT_EVENT, { jobNumber: this.job.number, output });
    }
}
