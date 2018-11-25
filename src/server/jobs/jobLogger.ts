'use strict';

import { join, resolve } from 'path';
import { createWriteStream, WriteStream } from 'fs';
import JobInfo from '../../common/models/jobInfo';
import { JOBS_FOLDER } from './jobLocations';
import { JOB_STARTED_EVENT, JOB_FINISHED_EVENT, JOB_OUTPUT_EVENT } from './jobEvents';
import { JobOutputEventArgs } from './jobEventArgs';
import JobEventEmitter from './jobEventEmitter';

const JOB_LOG_FILE_NAME = 'log.txt';

export default class JobLogger {

    private readonly jobLogStreams: { [jobNumber: number]: WriteStream } = {};

    constructor(private readonly jobEventEmitter: JobEventEmitter) {
        if (!jobEventEmitter) {
            throw new Error('jobEventEmitter not specified');
        }
        jobEventEmitter.on(JOB_STARTED_EVENT, this.onJobStarted.bind(this));
        jobEventEmitter.on(JOB_FINISHED_EVENT, this.onJobFinished.bind(this));
        jobEventEmitter.on(JOB_OUTPUT_EVENT, this.onJobOutput.bind(this));
    }

    private onJobStarted(jobInfo: JobInfo): void {
        const jobLogPath = this.getJobLogPath(jobInfo.number);
        const jobLogStream = createWriteStream(jobLogPath, { flags: 'a' });
        this.jobLogStreams[jobInfo.number] = jobLogStream;
    }

    private onJobOutput(outputEventArgs: JobOutputEventArgs): void {
        const jobLogStream = this.jobLogStreams[outputEventArgs.jobNumber];
        jobLogStream.write(outputEventArgs.output);
    }

    private onJobFinished(jobInfo: JobInfo): void {
        const jobLogStream = this.jobLogStreams[jobInfo.number];
        jobLogStream.close();
        delete this.jobLogStreams[jobInfo.number];
    }

    private getJobLogPath(jobNumber: number) {
        return resolve(join(JOBS_FOLDER, jobNumber.toString(), JOB_LOG_FILE_NAME));
    }
}
