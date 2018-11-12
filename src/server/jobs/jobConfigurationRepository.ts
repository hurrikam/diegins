'use strict';

import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import JobConfiguration from '../../common/models/jobConfiguration';

const JOB_CONFIGURATIONS_ROOT = resolve(__dirname + '/../../../job_configurations');
const JOB_CONFIG_FILE_NAME = 'config.json';

export default class JobConfigurationRepository {

    public readonly jobConfigurations = new Array<JobConfiguration>();
    private isInitialized = false;

    public initialize() {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;
        let directoryNames = readdirSync(JOB_CONFIGURATIONS_ROOT);
        this.scanJobDirectories(directoryNames);
    }

    public getJobConfiguration(id: string): JobConfiguration {
        return this.jobConfigurations.find(jobConfiguration => jobConfiguration.id === id);
    }

    private scanJobDirectories(directories: string[]) {
        if (!directories) {
            return;
        }
        directories.forEach(directoryName => {
            const jobConfiguration = this.getJobConfigurationFromDir(directoryName);
            if (jobConfiguration) {
                this.jobConfigurations.push(jobConfiguration);
            }
        });
    }

    private getJobConfigurationFromDir(directoryName: string): JobConfiguration {
        const jobConfigFilePath = `${JOB_CONFIGURATIONS_ROOT}/${directoryName}/${JOB_CONFIG_FILE_NAME}`;
        const fileContent = readFileSync(jobConfigFilePath, 'utf8');
        const job = JSON.parse(fileContent) as JobConfiguration;
        job.id = directoryName;
        return job;
    }
}
