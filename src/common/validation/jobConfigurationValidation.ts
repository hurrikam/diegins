'use strict';

import JobConfiguration from '../models/jobConfiguration';
import { isBlankString, isPositiveInteger } from './valueTesters';
import JobParameter from '../models/jobParameter';

function validateMaximumConcurrentJobs(maximumConcurrentJobs: number): void {
    if (maximumConcurrentJobs !== undefined && !isPositiveInteger(maximumConcurrentJobs)) {
        throw new Error('The \'maximum concurrent jobs\' parameter must be unspecified or a positive integer');
    }
}

function validateJobParameter(parameter: JobParameter): void {
    if (typeof parameter !== 'object') {
        throw new Error('Invalid parameter object.');
    }
    if (isBlankString(parameter.name)) {
        throw new Error('Missing parameter name.');
    }
}

export function validateJobConfiguration(jobConfiguration: JobConfiguration): void {
    if (!jobConfiguration) {
        throw new Error('Invalid configuration passed.');
    }
    if (isBlankString(jobConfiguration.id)) {
        throw new Error('Configuration ID cannot be blank.');
    }
    validateMaximumConcurrentJobs(jobConfiguration.maximumConcurrentJobs);
    const jobParameters = jobConfiguration.parameters;
    if (!Array.isArray(jobParameters)) {
        throw new Error('Invalid parameters list.');
    }
    const jobParametersSet = new Set<string>();
    jobParameters.forEach(parameter => {
        validateJobParameter(parameter);
        const normalizedParameterName = parameter.name
            .trim()
            .toLowerCase();
        if (jobParametersSet.has(normalizedParameterName)) {
            throw new Error('Duplicated parameter name. Parameters are case-insensitive.');
        }
        jobParametersSet.add(normalizedParameterName);
    });
}
