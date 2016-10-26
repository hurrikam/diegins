import { JobStep } from '../jobs';
import { JobStepOutcome } from '../../common/models';

const SAMPLE_DURATION_MS = 10000; 

export default class SampleJobStep implements JobStep {

    public readonly id = 'sample';
    public sampleTimeout: NodeJS.Timer;

    execute(): Promise<JobStepOutcome> {
        const self = this;
        return new Promise((resolveCallback, rejectCallback) => {
            self.sampleTimeout = setTimeout(() => {
                resolveCallback(<JobStepOutcome>{
                    output: "Sample step successfully completed"
                });
            }, SAMPLE_DURATION_MS);
        });
    }

    cancel(): void {
    }
}