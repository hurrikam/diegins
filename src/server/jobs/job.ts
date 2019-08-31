'use strict';

import JobStep from './jobStep';

export default interface Job {
    id: string;
    number: number;
    steps: Array<JobStep>;
    stepsData: Array<any>;
}
