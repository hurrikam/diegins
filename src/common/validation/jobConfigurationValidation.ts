'use strict';

import JobConfiguration from '../models/jobConfiguration';
import { isBlankString, isPositiveInteger, isString, isUndefined } from './valueTesters';
import JobParameter from '../models/jobParameter';
import JobStepConfiguration from '../models/jobStepConfiguration';

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

function validateStepConfiguration(stepConfiguration: JobStepConfiguration): void {
    const description = stepConfiguration.description;
    if (!isUndefined(description) && !isString(description)) {
        throw new Error('Step configuration description must be either undefined or a string.');
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
    const stepConfigurations = jobConfiguration.stepConfigurations;
    if (!Array.isArray(stepConfigurations)) {
        throw new Error('Step configurations must be an array.');
    }
    stepConfigurations.forEach(stepConfiguration => validateStepConfiguration(stepConfiguration));
}
