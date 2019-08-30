'use strict';

import { PathLike } from 'fs';
import { join } from 'path';
import { JOBS_FOLDER, JOB_LOG_FILE_NAME } from './jobFileConstants';

export default class JobLogReader {

    constructor(private readonly readFileAsync: (path: PathLike) => Promise<Buffer>) {
        if (typeof readFileAsync !== 'function') {
            throw new Error('No readFileAsync function specified');
        }
    }

    public getLog(jobNumber: number): Promise<Buffer> {
        const logPath = join(JOBS_FOLDER, jobNumber.toString(), JOB_LOG_FILE_NAME);
        return this.readFileAsync(logPath);
    }
}
