import { Job, JobResult, JobStepOutcome } from '../../common/models';
import { getJobStepRepository, JobStep, JobStepInstance, JobStepRepository } from '.';

export class JobInstance {

    private readonly jobStepRepository: JobStepRepository;
    private readonly steps: Array<JobStep> = [];
    private _isRunning = false;
    private jobRunPromise: Promise<JobResult>;
    private _currentStepIndex = 0;
    private isCancellationPending = false;
    private _result: JobResult;

    public constructor(private readonly job: Job, public readonly number: number) {
        if (!job) {
            throw new Error('Invalid job argument passed');
        }
        if (number <= 0) {
            throw new Error('Invalid job number passed');
        }
        this.jobStepRepository = getJobStepRepository();
    }

    public get id(): string {
        return this.job.id;
    }

    public get currentStepIndex(): number {
        return this._currentStepIndex;
    }

    public get stepCount(): number {
        if (!this.job.stepIds) {
            return 0;
        }
        return this.job.stepIds.length;
    }

    public run(): Promise<JobResult> {
        if (this.isRunning) {
            throw new Error('Job instance already started');
        }
        let hasSteps = this.stepCount > 0;
        if (!hasSteps) {
            return this.terminate(JobResult.Succeeded);
        }
        this._isRunning = true;
        const self = this;
        this.jobRunPromise = Promise.all(this.chainStepPromises())
            .then((result) => {
                return self.terminate(JobResult.Succeeded);
            })
            .catch((error) => {
                return self.terminate(JobResult.Failed);
            });
        return this.jobRunPromise;
    }

    public get isRunning(): boolean {
        return this._isRunning;
    }

    public cancel() {
        if (!this.isRunning) {
            return;
        }
        this.isCancellationPending = true;
        this.steps[this.currentStepIndex].cancel();
    }

    public get result(): JobResult {
        return this._result;
    }

    private terminate(result: JobResult): Promise<JobResult> {
        this._isRunning = false;
        if (this.isCancellationPending) {
            this.isCancellationPending = false;
            result = JobResult.Canceled;
        }
        this._result = result;
        return Promise.resolve(result);
    }

    private get stepIds(): string[] {
        return this.job.stepIds;
    }

    private chainStepPromises(): Promise<JobStepOutcome>[] {
        let stepPromises: Promise<JobStepOutcome>[] = [];
        for (let i = 0; i < this.stepIds.length; i++) {
            let id = this.stepIds[i];
            let step = this.jobStepRepository.getJobStep(id);
            this.steps.push(step);
            let stepPromise = this.createPostStepPromise(step);
            stepPromises.push(stepPromise);
        }
        return stepPromises;
    }

    private createPostStepPromise(step: JobStep): Promise<JobStepOutcome> {
        const self = this;
        return step.execute()
            .then((outcome) => {
                if (self.isCancellationPending) {
                    throw new Error("Job Cancelled");
                }
                if (self._currentStepIndex < self.stepCount - 1) {
                    self._currentStepIndex++;
                }
                return outcome;
            });
    }
}