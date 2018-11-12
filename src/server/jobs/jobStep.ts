'use strict';

import JobResult from '../../common/models/jobResult';

export default interface JobStep {
    execute(data?: any): Promise<JobResult>;
    cancel(): void;
}
