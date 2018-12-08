'use strict';

jest.mock('fs');
require('fs').readdir = (path: string, callback: Function) => {
    const folders = path === JOBS_FOLDER ? testFolderNames : [];
    callback(undefined, folders);
};

import JobRepository from './jobRepository';
import { JOBS_FOLDER } from './jobFileConstants';

let testFolderNames = new Array<String>();

describe('JobRepository', () => {

    afterAll(() => {
        jest.resetModules();
    });

    describe('getLastJobNumber', () => {

        test('returns 0 if the jobs folder is empty', async () => {
            testFolderNames = [];
            const jobRepository = new JobRepository();
            await expect(jobRepository.getLastJobNumber()).resolves.toBe(0);
        });

        test('returns 0 if no job numbers are found in the jobs folder', async () => {
            testFolderNames = ['invalid'];
            const jobRepository = new JobRepository();
            await expect(jobRepository.getLastJobNumber()).resolves.toBe(0);
        });

        test('returns the greatest job number found in the jobs folder', async () => {
            testFolderNames = ['1', '2', 'invalid', '3', '7'];
            const jobRepository = new JobRepository();
            await expect(jobRepository.getLastJobNumber()).resolves.toBe(7);
        });
    });
});
