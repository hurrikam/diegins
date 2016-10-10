import { JobStep } from '../jobs';
import { JobStepResult } from '../../common/models';

const SAMPLE_DURATION_MS = 10000; 

export default class SampleJobStep implements JobStep {

    public readonly id = 'sample';

    execute(): Promise<JobStepResult> {
        return new Promise((resolveCallback, rejectCallback) => {
            setTimeout(() => {
                resolveCallback(JobStepResult.Succeeded);
            }, SAMPLE_DURATION_MS);
        });
    }
}