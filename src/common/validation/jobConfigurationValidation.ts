'use strict';

import JobConfiguration from '../models/jobConfiguration';

export function validateJobConfiguration(jobConfiguration: JobConfiguration): void {
    if (!jobConfiguration) {
        throw new Error('Invalid configuration passed.');
    }
    let configurationId = jobConfiguration.id;
    if (typeof(configurationId) !== 'string') {
        throw new Error('Configuration ID must be a string.');
    }
    configurationId = configurationId.trim();
    if (!configurationId) {
        throw new Error('Configuration ID cannot be blank.');
    }
}
