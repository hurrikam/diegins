'use strict';

import JobStep from '../jobs/jobStep';
import JobResult from '../../common/models/jobResult';

const SAMPLE_DURATION_MS = 10000;

export const ID = 'sample';

export default class SampleJobStep implements JobStep {

    private promiseResolve: (result: JobResult) => void;
    private sampleTimeout: NodeJS.Timer;

    public execute(): Promise<JobResult> {
        return new Promise(resolve => {
            this.promiseResolve = resolve;
            this.sampleTimeout = setTimeout(
                () => resolve(Math.random() <= 0.9 ? JobResult.Succeeded : JobResult.Failed),
                SAMPLE_DURATION_MS
            );
        });
    }

    public cancel(): void {
        if (!this.sampleTimeout) {
            return;
        }
        clearTimeout(this.sampleTimeout);
        this.promiseResolve(JobResult.Canceled);
    }
}
