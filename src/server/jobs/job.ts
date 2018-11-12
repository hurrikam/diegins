'use strict';

import JobStep from './jobStep';
import JobResult from '../../common/models/jobResult';

export default class Job {

    public currentStepIndex = 0;
    public result?: JobResult;
    private isCancelling = false;

    public constructor(
        public readonly jobId: string,
        public readonly jobNumber: number,
        public readonly steps: Array<JobStep>
    ) {
        if (!jobId) {
            throw new Error('Invalid jobId argument passed');
        }
        if (jobNumber <= 0) {
            throw new Error('Invalid jobNumber passed');
        }
        if (!steps) {
            throw new Error('Invalid steps passed');
        }
    }

    public async run(): Promise<void> {
        if (this.result !== undefined) {
            throw new Error('The job cannot be restarted');
        }
        let result = JobResult.Succeeded;
        for (let i = 0; i < this.steps.length; i++) {
            const jobStep = this.steps[i];
            try {
                result = await jobStep.execute();
            } catch (error) {
                result = JobResult.Failed;
            }
            if (this.isCancelling) {
                result = JobResult.Canceled;
            }
            if (result !== JobResult.Succeeded) {
                break;
            }
            if (i < this.steps.length - 1) {
                this.currentStepIndex++;
            }
        }
        this.result = result;
    }

    public cancel(): void {
        this.isCancelling = true;
        this.steps[this.currentStepIndex].cancel();
    }
}
