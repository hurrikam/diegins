'use strict';

import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import JobConfiguration from '../../common/models/jobConfiguration';
import { JOB_CONFIGURATIONS_FOLDER, JOB_CONFIG_FILE_NAME } from './jobFileConstants';

export default class JobConfigurationRepository {

    public readonly jobConfigurations = new Array<JobConfiguration>();
    private isInitialized = false;

    public initialize() {
        if (this.isInitialized) {
            throw new Error('Job configuration repository already initialized');
        }
        this.isInitialized = true;
        const directoryNames = readdirSync(JOB_CONFIGURATIONS_FOLDER);
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
        const jobConfigFilePath = join(JOB_CONFIGURATIONS_FOLDER, directoryName, JOB_CONFIG_FILE_NAME);
        try {
            const fileContent = readFileSync(jobConfigFilePath, 'utf8');
            const jobConfiguration = JSON.parse(fileContent) as JobConfiguration;
            jobConfiguration.id = directoryName;
            return jobConfiguration;
        // tslint:disable-next-line:no-empty
        } catch (error) {
        }
    }
}
