import { JobStepResult } from '../../common/models/jobStepResult';

export interface JobStep {

    id: string;

    execute(): Promise<JobStepResult>;
}