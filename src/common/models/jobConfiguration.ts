'use strict';

import JobStepConfiguration from './jobStepConfiguration';
import JobParameter from './jobParameter';

export default interface JobConfiguration {
    id: string;
    maximumConcurrentJobs?: number;
    parameters: Array<JobParameter>;
    stepConfigurations: Array<JobStepConfiguration>;
}
