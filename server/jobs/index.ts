import { JobRepository } from './jobRepository';

const jobRepository = new JobRepository();

export function getJobRepository(): JobRepository {
    return jobRepository;
}

export * from './jobRepository';