'use strict';

import JobStep from './jobStep';
import JobParameterValues from '../../common/models/jobParameterValues';

export default interface Job {
    id: string;
    number: number;
    parameterValues?: JobParameterValues;
    steps: Array<JobStep>;
    stepsData: Array<any>;
}
