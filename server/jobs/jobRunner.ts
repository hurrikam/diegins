import { JobRepository, JobInstance } from '.';
import { JobInstanceInfo, JobResult, JobStatus } from '../../common/models';

export class JobRunner {

    private readonly runningJobs: JobInstance[] = [];

    public constructor(private readonly jobRepository: JobRepository) {
    }

    public runJob(id: string): boolean {
        let job = this.jobRepository.getJob(id);
        if (!job) {
            return false;
        }
        let jobInstance = new JobInstance(job);
        this.startJobInstance(jobInstance);
        return true;
    }

    public cancelJob(id: string, number: number): boolean {
        let jobInstance = this.runningJobs.find((instance) => {
            return instance.id === id;
        });
        if (!jobInstance) {
            return false;
        }
        jobInstance.cancel();
        this.removeJobInstance(jobInstance);
        return true;
    }

    public getRunningJobInfos(): JobInstanceInfo[] {
        return this.runningJobs.map((jobInstance) => {
            return <JobInstanceInfo>{
                id: jobInstance.id,
                displayName: jobInstance.id,
                status: jobInstance.status
            };
        });
    }

    private startJobInstance(jobInstance: JobInstance): Promise<JobResult> {
        jobInstance.run();
        this.runningJobs.push(jobInstance);
        return Promise.resolve(JobResult.Succeeded);
    }

    private removeJobInstance(jobInstance: JobInstance) {
        let instanceIndex = this.runningJobs.indexOf(jobInstance);
        this.runningJobs.splice(instanceIndex);
    }
}
