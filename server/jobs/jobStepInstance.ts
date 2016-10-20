import { JobStepOutcome } from '../../common/models';

export class JobStepInstance {

    public readonly stepId: string;

    public execute(): Promise<JobStepOutcome> {
        return null;
    }
}