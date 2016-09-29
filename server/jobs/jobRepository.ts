import * as fs from 'fs';
import { Job } from '../../common/models/job';

const JOBS_ROOT = 'jobs/';
const JOB_CONFIG_FILE_NAME = 'config.json';

export class JobRepository {

    private isInitialized = false;
    private _jobs: Job[] = [];

    public initialize() {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;
        let directoryNames = fs.readdirSync(JOBS_ROOT);
        this.scanJobDirectories(directoryNames);
    }

    public get jobs(): Job[] {
        return this._jobs;
    }

    private scanJobDirectories(directories: string[]) {
        if (!directories) {
            return;
        }
        directories.forEach((directoryName) => {
            let job = this.createJobFromDir(directoryName);
            if (job) {
                this._jobs.push(job);
            }
        });
    }

    private createJobFromDir(directoryName: string) : Job {
        let jobConfigFilePath = JOBS_ROOT + directoryName + '/' + JOB_CONFIG_FILE_NAME;
        let fileContent = fs.readFileSync(jobConfigFilePath, 'utf8');
        return JSON.parse(fileContent);
    }
}
