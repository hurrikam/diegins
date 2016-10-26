import { JobRepository } from './jobRepository';
import { JobRunner } from './jobRunner';
import { JobStep } from './jobStep';
import { JobStepRepository } from './jobStepRepository';

const JOB_REPOSITORY = new JobRepository();
const JOB_RUNNER = new JobRunner(JOB_REPOSITORY);
const JOB_STEP_REPOSITORY = new JobStepRepository();

export function getJobRepository(): JobRepository {
    return JOB_REPOSITORY;
}

export function getJobRunner(): JobRunner {
    return JOB_RUNNER;
}

export function getJobStepRepository(): JobStepRepository {
    return JOB_STEP_REPOSITORY;
}

export * from './jobInstance';
export * from './jobRepository';
export * from './jobRunner';
export * from './jobStep';
export * from './jobStepInstance';
export * from './jobStepRepository';
