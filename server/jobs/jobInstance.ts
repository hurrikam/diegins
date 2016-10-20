import { Job, JobResult, JobStatus, JobStepOutcome } from '../../common/models';
import { getJobStepRepository, JobStep, JobStepInstance, JobStepRepository } from '.';

export class JobInstance {

    private readonly jobStepRepository: JobStepRepository;
    private _status: JobStatus;
    private jobRunPromise: Promise<JobResult>;

    public constructor(private readonly job: Job) {
        if (!job) {
            throw new Error('Invalid job argument passed');
        }
        this.jobStepRepository = getJobStepRepository();
    }

    public get id(): string {
        return this.job.id;
    }

    public run(): Promise<JobResult> {
        if (this.isRunning()) {
            throw new Error('Job instance already started');
        }
        let hasSteps = this.stepIds && this.stepIds.length > 0;
        if (!hasSteps) {
            this._status = JobStatus.Succeeded;
            return Promise.resolve(JobResult.Succeeded);
        }
        this._status = JobStatus.Running;
        this.jobRunPromise = Promise.all(this.chainStepPromises())
            .then((result) => {
                this._status = JobStatus.Succeeded;
                return Promise.resolve(JobResult.Succeeded);
            })
            .catch((error) => {
                this._status = JobStatus.Failed;
                return Promise.reject(JobResult.Failed);
            });
        return this.jobRunPromise;
    }

    public cancel() {
        
    }

    public get status(): JobStatus {
        return this._status;
    }

    public isRunning(): boolean {
        return this.status === JobStatus.Running;
    }

    private get stepIds(): string[] {
        return this.job.stepIds;
    }

    private getJobStep(id: string): JobStep {
        return this.jobStepRepository.getJobStep(id);
    }

    private chainStepPromises(): Promise<JobStepOutcome>[] {
        let stepPromises: Promise<JobStepOutcome>[] = [];
        for (let i = 0; i < this.stepIds.length; i++) {
            let id = this.stepIds[i];
            let step = this.getJobStep(id);
            stepPromises.push(step.execute());
        }
        return stepPromises;
    }
}