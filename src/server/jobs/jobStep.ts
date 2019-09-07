'use strict';

import JobEnvironmentVariables from './jobEnvironmentVariables';
import JobResult from '../../common/models/jobResult';
import JobParameterValues from '../../common/models/jobParameterValues';

export default interface JobStep {
    execute(data: any, jobArguments: JobEnvironmentVariables, jobParameterValues?: JobParameterValues): Promise<JobResult>;
    cancel(): void;
    onOutput?: (output: string) => void;
}
