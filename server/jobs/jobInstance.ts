import { Job, JobResult, JobStepResult } from '../../common/models';
import { getJobStepRepository, JobStep, JobStepInstance, JobStepRepository } from '.';

export class JobInstance {

    private readonly jobStepRepository: JobStepRepository;

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
        let hasSteps = this.stepIds && this.stepIds.length > 0;
        if (!hasSteps) {
            return Promise.resolve(JobResult.Succeeded);
        }
        return Promise.all(this.chainStepPromises()).then((result) => {
            return Promise.resolve(JobResult.Succeeded);
        }).catch((error) => {
            return Promise.reject(JobResult.Failed);
        });
    }

    private get stepIds(): string[] {
        return this.job.stepIds;
    }

    private getJobStep(id: string): JobStep {
        return this.jobStepRepository.getJobStep(id);
    }

    private chainStepPromises(): Promise<JobStepResult>[] {
        let stepPromises: Promise<JobStepResult>[] = [];
        for (let i = 0; i < this.stepIds.length; i++) {
            let id = this.stepIds[i];
            let step = this.getJobStep(id);
            stepPromises.push(step.execute());
        }
        return stepPromises;
    }
}