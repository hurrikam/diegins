import { JobRepository } from './jobRepository';
import { JobInstance } from '../../common/models/jobInstance';

export class JobRunner {

    public constructor(private jobRepository: JobRepository) {
    }

    public runJob(id: string): boolean {
        let job = this.jobRepository.getJobById(id);
        if (!job) {
            return false;
        }
        let jobInstance = this.createJobInstance(id);
        this.runningJobs.push(jobInstance);
        return true;
    }

    public get runningJobs(): any[] {
        return null;
    }

    private createJobInstance(id: string): JobInstance {
        return new JobInstance();
    }
}