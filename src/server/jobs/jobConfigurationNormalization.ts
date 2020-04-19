'use strict';

import JobConfiguration from '../../common/models/jobConfiguration';

export function normalizeJobConfiguration(jobConfiguration: JobConfiguration): void {
    if (!jobConfiguration) {
        throw new Error('Invalid job configuration passed');
    }
    jobConfiguration.parameters.forEach(parameter => {
        parameter.name = parameter.name.trim();
    });
    jobConfiguration.stepConfigurations.forEach(stepConfiguration => {
        const description = stepConfiguration.description;
        stepConfiguration.description = description && description.trim();
    });
}
