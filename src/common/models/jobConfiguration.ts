'use strict';

import JobStepConfiguration from './jobStepConfiguration';

export default interface JobConfiguration {
    id: string;
    stepConfigurations: Array<JobStepConfiguration>;
}
