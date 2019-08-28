'use strict';

import { promisify } from 'util';
import { readdirSync, readFileSync, writeFile } from 'fs';
import { join } from 'path';
import JobConfiguration from '../../common/models/jobConfiguration';
import { JOB_CONFIGURATIONS_FOLDER, JOB_CONFIGURATION_FILE_EXTENSION } from './jobFileConstants';
import { validateJobConfiguration } from '../../common/validation/jobConfigurationValidation';

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

    public getJobConfiguration(jobId: string): JobConfiguration {
        return this.jobConfigurations.find(configuration => configuration.id === jobId);
    }

    public async saveJobConfiguration(jobConfiguration: JobConfiguration): Promise<void> {
        validateJobConfiguration(jobConfiguration);
        const configurationId = jobConfiguration.id;
        const configurationFileName = this.configurationFileNameFromJobId(configurationId);
        const configurationFilePath = join(JOB_CONFIGURATIONS_FOLDER, configurationFileName);
        await writeFileAsync(configurationFilePath, JSON.stringify(jobConfiguration));
        const indexOfExistingConfiguration = this.jobConfigurations
            .findIndex(configuration => configuration.id === configurationId);
        if (indexOfExistingConfiguration >= 0) {
            this.jobConfigurations[indexOfExistingConfiguration] = jobConfiguration;
            return;
        }
        this.jobConfigurations.push(jobConfiguration);
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

    private configurationFileNameFromJobId(jobId: string): string {
        return jobId + JOB_CONFIGURATION_FILE_EXTENSION;
    }
}
