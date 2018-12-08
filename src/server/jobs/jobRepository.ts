'use strict';

import { promisify } from 'util';
import { readdir, readFile } from 'fs';
import { join } from 'path';
import JobInfo from '../../common/models/jobInfo';
import { JOBS_FOLDER, JOB_LOG_FILE_NAME } from './jobFileConstants';

const readdirAsync = promisify(readdir);
const readFileAsync = promisify(readFile);

export default class JobRepository {

    // public async getJobInfos(): Promise<Array<JobInfo>> {
    //     const folders = await this.getJobFolders();
    //     const jobInfos = new Array<JobInfo>();
    //     for (let i = 0; i < folders.length; i++) {
    //         const folderName = folders[i];
    //         const filePath = join(JOBS_FOLDER, folderName, JOB_LOG_FILE_NAME);
    //         try {
    //             const jobLogFileContent = await readFileAsync(filePath, 'utf8');
    //             const jobLog = JSON.parse(jobLogFileContent);
    //             jobInfos.push(jobLog.info as JobInfo);
    //         } catch (error) {
    //             jobInfos.push({ } as JobInfo);
    //         }
    //     }
    //     return jobInfos;
    // }

    public async getLastJobNumber(): Promise<number> {
        const folders = await this.getJobFolders();
        let lastJobNumber = 0;
        folders.forEach(folderName => {
            const folderNumber = parseInt(folderName, 10);
            const isValidNumber = isFinite(folderNumber) && folderNumber > 0;
            if (!isValidNumber) {
                return;
            }
            if (folderNumber > lastJobNumber) {
                lastJobNumber = folderNumber;
            }
        });
        return lastJobNumber;
    }

    private async getJobFolders(): Promise<Array<string>> {
        return await readdirAsync(JOBS_FOLDER);
    }
}
