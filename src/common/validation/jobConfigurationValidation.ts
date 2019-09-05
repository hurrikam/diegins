'use strict';

import JobConfiguration from '../models/jobConfiguration';
import { isBlankString } from './valueTesters';
import JobParameter from '../models/jobParameter';

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
