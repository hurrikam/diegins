'use strict';

import { EOL } from 'os';
import JobStep from '../jobs/jobStep';
import JobResult from '../../common/models/jobResult';

const MAX_DURATION_MS = 10000;
const UPDATE_FREQUENCY_MS = 1000;

export const ID = 'sample';

export default class SampleJobStep implements JobStep {

    public onOutput: (output: string) => void;
    private promiseResolve: (result: JobResult) => void;
    private sampleInterval: NodeJS.Timer;
    private duration = 0;

    public execute(): Promise<JobResult> {
        return new Promise(resolve => {
            this.promiseResolve = resolve;
            this.sampleInterval = setInterval(
                () => {
                    this.duration += UPDATE_FREQUENCY_MS;
                    this.emitOutput(`Step elapsed time in milliseconds ${this.duration}${EOL}`);
                    if (this.duration >= MAX_DURATION_MS) {
                        clearInterval(this.sampleInterval);
                        resolve(JobResult.Succeeded);
                    }
                    if (Math.random() > 0.95) {
                        clearInterval(this.sampleInterval);
                        resolve(JobResult.Failed);
                    }
                },
                UPDATE_FREQUENCY_MS
            );
        });
    }

    public cancel(): void {
        if (!this.sampleInterval) {
            return;
        }
        clearInterval(this.sampleInterval);
        this.promiseResolve(JobResult.Canceled);
    }

    private emitOutput(output: string): void {
        if (this.onOutput) {
            this.onOutput(output);
        }
    }
}
