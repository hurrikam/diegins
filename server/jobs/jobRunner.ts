import { JobRepository } from './jobRepository';

export class JobRunner {

    public constructor(private jobRepository: JobRepository) {
    }

    public runJob(id: string): boolean {
        return false;
    }

    public get runningJobs(): any[] {
        return null;
    }
}