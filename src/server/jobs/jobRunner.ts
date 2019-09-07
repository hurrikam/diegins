'use strict';

import Job from './job';
import JobResult from '../../common/models/jobResult';
import JobInfo from '../../common/models/jobInfo';
import JobEnvironmentVariables from './jobEnvironmentVariables';
import JobEventEmitter from './jobEventEmitter';
import { JOB_STARTED_EVENT, JOB_OUTPUT_EVENT, JOB_FINISHED_EVENT } from './jobEvents';

export default class JobRunner {

    public readonly jobId: string;
    public readonly jobNumber: number;
    public readonly stepCount: number;
    public currentStepIndex = -1;
    public result?: JobResult;
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

    public async run(): Promise<JobResult> {
        if (this.result !== undefined) {
            throw new Error('The job cannot be restarted');
        }
        let jobInfo = this.createJobInfo();
        this.jobEventEmitter.emit(JOB_STARTED_EVENT, jobInfo);
        let result = JobResult.Succeeded;
        try {
            result = await this.runSteps();
        } catch (error) {
            this.cancelCurrentStep();
            result = JobResult.Failed;
        } finally {
            this.result = result;
            jobInfo = this.createJobInfo(result);
            this.emitJobFinished(jobInfo);
        }
        return result;
    }

    public cancel(): void {
        this.isCancelling = true;
        this.cancelCurrentStep();
    }

    private createJobInfo(result?: JobResult): JobInfo {
        return {
            id: this.jobId,
            number: this.job.number,
            currentStepIndex: this.currentStepIndex,
            result,
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
        try {
            this.job.steps[this.currentStepIndex].cancel();
        // tslint:disable-next-line:no-empty
        } catch (error) {
        }
    }

    private emitJobFinished(jobInfo: JobInfo): void {
        this.jobEventEmitter.emit(JOB_FINISHED_EVENT, jobInfo);
    }

    private onStepOutput(output: string): void {
        this.jobEventEmitter.emit(JOB_OUTPUT_EVENT, { jobNumber: this.job.number, output });
    }
}
