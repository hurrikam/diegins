import { JobStepInstance } from './jobStepInstance';

export interface JobInstance {

    id: string,
    steps: JobStepInstance[]
}