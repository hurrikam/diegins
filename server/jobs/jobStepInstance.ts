import { JobStepResult } from '../../common/models/jobStepResult';

export class JobStepInstance {

    public readonly pluginId: string;

    public execute(): Promise<JobStepResult> {

    }
}