'use strict';

import { EventEmitter } from 'events';
import JobInfo from '../../common/models/jobInfo';
import { JobOutputEventArgs } from './jobEventArgs';

export default interface JobEventEmitter extends EventEmitter {
    on(event: 'job-started', listener: (jobInfo: JobInfo) => void): this;
    on(event: 'job-finished', listener: (jobInfo: JobInfo) => void): this;
    on(event: 'job-output', listener: (outputEventArgs: JobOutputEventArgs) => void): this;
}
