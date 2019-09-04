'use strict';

import JobArguments from './jobArguments';
import JobResult from '../../common/models/jobResult';

export default interface JobStep {
    execute(data: any, jobArguments: JobArguments): Promise<JobResult>;
    cancel(): void;
    onOutput?: (output: string) => void;
}
