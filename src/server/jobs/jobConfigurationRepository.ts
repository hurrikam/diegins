'use strict';

import { promisify } from 'util';
import { readdirSync, readFileSync, writeFile } from 'fs';
import { join } from 'path';
import JobConfiguration from '../../common/models/jobConfiguration';
import { JOB_CONFIGURATIONS_FOLDER, JOB_CONFIGURATION_FILE_EXTENSION } from './jobFileConstants';

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
        const configurationFileName = `${jobConfiguration.id}${JOB_CONFIGURATION_FILE_EXTENSION}`;
        const configurationFilePath = join(JOB_CONFIGURATIONS_FOLDER, configurationFileName);
        return writeFileAsync(configurationFilePath, JSON.stringify(jobConfiguration));
    }

    private readJobConfigurations(): Array<JobConfiguration> {
        const configurationFileNames = readdirSync(JOB_CONFIGURATIONS_FOLDER);
        return configurationFileNames
            .filter(fileName => fileName.endsWith(JOB_CONFIGURATION_FILE_EXTENSION))
            .map(fileName => this.readJobConfigurationFile(fileName))
            .filter(configuration => !!configuration);
    }

    private readJobConfigurationFile(jobConfigurationFileName: string): JobConfiguration {
        const jobConfigFilePath = join(JOB_CONFIGURATIONS_FOLDER, jobConfigurationFileName);
        try {
            const fileContent = readFileSync(jobConfigFilePath, 'utf8');
            return JSON.parse(fileContent) as JobConfiguration;
            // tslint:disable-next-line:no-empty
        } catch (error) {
        }
    }
}
