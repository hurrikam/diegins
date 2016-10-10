import { JobStepResult } from '../../common/models/jobStepResult';

export class JobStepInstance {

    public readonly stepId: string;

    public execute(): Promise<JobStepResult> {
        return null;
    }
}