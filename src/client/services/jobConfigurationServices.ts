'use strict';

import JobConfiguration from '../../common/models/jobConfiguration';

export function getJobStepIds(): Promise<Array<string>> {
    return Promise.resolve(['sample']);
}

export function saveJobConfiguration(jobConfiguration: JobConfiguration): Promise<void> {
    return new Promise((resolve, reject) =>
        setTimeout(() => reject('Save functionality not implemented yet :)'), 2000)
    );
}