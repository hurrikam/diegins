'use strict';

import JobResult from './jobResult';
import JobStatus from './jobStatus';

export default interface JobInfo {
    id: string;
    currentStepIndex: number;
    number: number;
    result?: JobResult;
    status: JobStatus;
    stepCount: number;
}
