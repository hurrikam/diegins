'use strict';

import { join } from 'path';
import { createWriteStream, WriteStream } from 'fs';
import JobInfo from '../../common/models/jobInfo';
import { JOBS_FOLDER } from './jobFileConstants';
import { JOB_STARTED_EVENT, JOB_FINISHED_EVENT, JOB_OUTPUT_EVENT } from './jobEvents';
import { JobOutputEventArgs } from './jobEventArgs';
import JobEventEmitter from './jobEventEmitter';
import { JOB_LOG_FILE_NAME } from './jobFileConstants';

export default class JobLogger {

    public readonly logStreams: { [jobNumber: number]: WriteStream } = {};

    constructor(private readonly jobEventEmitter: JobEventEmitter) {
        if (!jobEventEmitter) {
            throw new Error('jobEventEmitter not specified');
        }
        jobEventEmitter.on(JOB_STARTED_EVENT, this.onJobStarted.bind(this));
        jobEventEmitter.on(JOB_OUTPUT_EVENT, this.onJobOutput.bind(this));
        jobEventEmitter.on(JOB_FINISHED_EVENT, this.onJobFinished.bind(this));
    }

    private onJobStarted(jobInfo: JobInfo): void {
        const logPath = this.getlogPath(jobInfo.number);
        const logStream = createWriteStream(logPath, { flags: 'a' });
        this.logStreams[jobInfo.number] = logStream;
    }

    private onJobOutput(outputEventArgs: JobOutputEventArgs): void {
        const logStream = this.logStreams[outputEventArgs.jobNumber];
        logStream.write(outputEventArgs.output);
    }

    private onJobFinished(jobInfo: JobInfo): void {
        const logStream = this.logStreams[jobInfo.number];
        logStream.close();
        delete this.logStreams[jobInfo.number];
    }

    private getlogPath(jobNumber: number) {
        return join(JOBS_FOLDER, jobNumber.toString(), JOB_LOG_FILE_NAME);
    }
}
