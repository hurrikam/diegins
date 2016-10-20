import { JobStepOutcome } from '../../common/models';

export interface JobStep {

    id: string;

    execute(): Promise<JobStepOutcome>;
}