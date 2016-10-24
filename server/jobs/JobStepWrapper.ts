import { JobStep } from './jobStep';
import { JobStepOutcome } from '../../common/models';

export class JobStepWrapper {

    constructor(private readonly step: JobStep, private readonly index: number) {

    }

    execute(): Promise<JobStepOutcome> {
        return new Promise((resolveCallback, rejectCallback) => {
            //current
            return this.step.execute();
        });
    }

    cancel(): void {
    }
}