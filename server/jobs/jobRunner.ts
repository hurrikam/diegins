import { JobRepository } from './jobRepository';
import { JobInstance } from '../../common/models/jobInstance';

export class JobRunner {

    private readonly runningJobs: JobInstance[] = [];

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

    private createJobInstance(id: string): JobInstance {
        return {
            id: id
        };
    }
}
