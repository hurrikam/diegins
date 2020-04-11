'use strict';

import JobRunner from './jobRunner';
import JobInfo from '../../common/models/jobInfo';

export function getJobInfoFromJobRunner(jobRunner: JobRunner): JobInfo {
    if (!jobRunner) {
        throw new Error('No jobRunner specified');
    }
    return {
        id: jobRunner.jobId,
        number: jobRunner.jobNumber,
        currentStepIndex: jobRunner.currentStepIndex,
        result: jobRunner.result,
        status: jobRunner.status,
        stepCount: jobRunner.stepCount
    };
}
