import { JobRepository } from './jobRepository';
import { JobRunner } from './jobRunner';
import { JobStep } from './jobStep';

const JOB_REPOSITORY = new JobRepository();
const JOB_RUNNER = new JobRunner(JOB_REPOSITORY);

export function getJobRepository(): JobRepository {
    return JOB_REPOSITORY;
}

export * from './jobRepository';

export function getJobRunner(): JobRunner {
    return JOB_RUNNER;
}

export * from './jobRunner';

export * from './jobStep';