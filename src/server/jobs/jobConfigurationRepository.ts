'use strict';

import { promisify } from 'util';
import { readdirSync, readFileSync, writeFile } from 'fs';
import { join } from 'path';
import JobConfiguration from '../../common/models/jobConfiguration';
import { JOB_CONFIGURATIONS_FOLDER, JOB_CONFIG_FILE_NAME } from './jobFileConstants';

const writeFileAsync = promisify(writeFile);

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

    public saveJobConfiguration(jobConfiguration: JobConfiguration): Promise<void> {
        if (!jobConfiguration || !jobConfiguration.id) {
            throw new Error('Invalid job configuration passed');
        }
        const configurationFileName = join(JOB_CONFIGURATIONS_FOLDER, `${jobConfiguration.id}.json`);
        return writeFileAsync(configurationFileName, JSON.stringify(jobConfiguration));
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
