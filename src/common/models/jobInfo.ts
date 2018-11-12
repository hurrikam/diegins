'use strict';

import JobResult from './jobResult';

export default interface JobInfo {
    id: string;
    currentStepIndex: number;
    number: number;
    result?: JobResult;
    stepCount: number;
}
