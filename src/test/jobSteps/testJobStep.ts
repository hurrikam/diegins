'use strict';

import JobStep from '../../server/jobs/jobStep';
import JobResult from '../../common/models/jobResult';

export const ID = 'test_job_step';

export default class TestJobStep implements JobStep {

    public onOutput: (output: string) => void;

    public execute(): Promise<JobResult> {
        return Promise.resolve(JobResult.Succeeded);
    }

    // tslint:disable-next-line:no-empty
    public cancel(): void {
    }
}
