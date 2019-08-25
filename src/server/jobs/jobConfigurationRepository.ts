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
        this.jobConfigurations.push(...this.readJobConfigurations());
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

    private readJobConfigurations(): Array<JobConfiguration> {
        const configurationFileNames = readdirSync(JOB_CONFIGURATIONS_FOLDER);
        return configurationFileNames.map(fileName => this.readJobConfigurationFile(fileName));
    }

    private readJobConfigurationFile(jobConfigurationFile: string): JobConfiguration {
        const jobConfigFilePath = join(JOB_CONFIGURATIONS_FOLDER, jobConfigurationFile);
        try {
            const fileContent = readFileSync(jobConfigFilePath, 'utf8');
            return JSON.parse(fileContent) as JobConfiguration;
            // tslint:disable-next-line:no-empty
        } catch (error) {
        }
    }
}
