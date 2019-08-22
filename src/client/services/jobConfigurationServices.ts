'use strict';

import JobConfiguration from '../../common/models/jobConfiguration';

export function getJobStepIds(): Promise<Array<string>> {
    return Promise.resolve(['sample']);
}

export function saveJobConfiguration(jobConfiguration: JobConfiguration): Promise<void> {
    return Promise.reject('Save functionality not implemented yet :)');
}
