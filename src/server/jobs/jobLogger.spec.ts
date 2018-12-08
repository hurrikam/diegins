'use strict';

jest.mock('fs');

import JobLogger from './jobLogger';
import { EventEmitter } from 'events';
import { JOB_STARTED_EVENT, JOB_OUTPUT_EVENT, JOB_FINISHED_EVENT } from './jobEvents';
import JobEventEmitter from './jobEventEmitter';
import JobInfo from '../../common/models/jobInfo';
import { JOBS_FOLDER, JOB_LOG_FILE_NAME } from './jobFileConstants';
import { join } from 'path';
import { JobOutputEventArgs } from './jobEventArgs';

describe('JobLogger', () => {

    afterAll(() => {
        jest.resetModules();
    });

    test('creates a log when a job starts', () => {
        const fs = require('fs');
        fs.createWriteStream = jest.fn(() => ({ }));
        const jobEventEmitter = new EventEmitter() as JobEventEmitter;
        const jobLogger = new JobLogger(jobEventEmitter);
        const testJobNumber = 1;
        const testLogPath = join(JOBS_FOLDER, testJobNumber.toString(), JOB_LOG_FILE_NAME);
        jobEventEmitter.emit(JOB_STARTED_EVENT, { number: testJobNumber } as JobInfo);
        expect(fs.createWriteStream).toHaveBeenCalledTimes(1);
        expect(fs.createWriteStream).toHaveBeenCalledWith(testLogPath, { flags: 'a' });
        expect(jobLogger.logStreams[testJobNumber]).toBeDefined();
    });

    test('logs job output', () => {
        const fs = require('fs');
        fs.createWriteStream = () => ({
            write: jest.fn()
        });
        const jobEventEmitter = new EventEmitter() as JobEventEmitter;
        const jobLogger = new JobLogger(jobEventEmitter);
        const testJobNumber = 1;
        jobEventEmitter.emit(JOB_STARTED_EVENT, { number: testJobNumber } as JobInfo);
        const testOutput = 'test job output';
        jobEventEmitter.emit(JOB_OUTPUT_EVENT, {
            jobNumber: testJobNumber,
            output: testOutput
        } as JobOutputEventArgs);
        const testStream = jobLogger.logStreams[testJobNumber];
        expect(testStream.write).toHaveBeenCalledTimes(1);
        expect(testStream.write).toHaveBeenCalledWith(testOutput);
    });

    test('closes a log when the associated job finishes', () => {
        const fs = require('fs');
        fs.createWriteStream = () => ({
            close: jest.fn()
        });
        const jobEventEmitter = new EventEmitter() as JobEventEmitter;
        const jobLogger = new JobLogger(jobEventEmitter);
        const testJobNumber = 1;
        jobEventEmitter.emit(JOB_STARTED_EVENT, { number: testJobNumber } as JobInfo);
        const testStream = jobLogger.logStreams[testJobNumber];
        jobEventEmitter.emit(JOB_FINISHED_EVENT, { number: testJobNumber } as JobInfo);
        expect(testStream.close).toHaveBeenCalledTimes(1);
        expect(jobLogger.logStreams[testJobNumber]).toBeUndefined();
    });
});
