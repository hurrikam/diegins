'use strict';

import { promisify } from 'util';
import { writeFile, constants } from 'fs';
import { join } from 'path';
import JobConfiguration from '../../common/models/jobConfiguration';
import { JOB_CONFIGURATIONS_FOLDER, JOB_CONFIGURATION_FILE_EXTENSION } from './jobFileConstants';
import { validateJobConfiguration } from '../../common/validation/jobConfigurationValidation';
import FileSystemService from '../services/fileSystemService';

const writeFileAsync = promisify(writeFile);

export default class JobConfigurationRepository {

    public readonly jobConfigurations = new Array<JobConfiguration>();
    private isInitialized = false;

    constructor(private readonly fileSystemService: FileSystemService) {
        if (!fileSystemService) {
            throw new Error('fileSystemService not specified');
        }
    }

    public async initialize(): Promise<void> {
        if (this.isInitialized) {
            throw new Error('Job configuration repository already initialized');
        }
        this.isInitialized = true;
        // tslint:disable:no-bitwise
        const dirOptions = {
            mode: constants.S_IRUSR,
            recursive: true
        };
        // tslint:enable:no-bitwise
        try {
            await this.fileSystemService.mkdir(JOB_CONFIGURATIONS_FOLDER, dirOptions);
        // tslint:disable-next-line:no-empty
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
        const jobConfigurations = await this.readJobConfigurations();
        this.jobConfigurations.push(...jobConfigurations);
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

    private async readJobConfigurations(): Promise<Array<JobConfiguration>> {
        let configurationFileNames = await this.fileSystemService
            .readdir(JOB_CONFIGURATIONS_FOLDER, { recursive: true });
        configurationFileNames = configurationFileNames
            .filter(fileName => fileName.endsWith(JOB_CONFIGURATION_FILE_EXTENSION));
        const jobConfigurations = new Array<JobConfiguration>();
        for (let i = 0; i < configurationFileNames.length; i++) {
            const fileName = configurationFileNames[i];
            const jobConfiguration = await this.readJobConfigurationFile(fileName);
            jobConfigurations.push(jobConfiguration);
        }
        return jobConfigurations
            .filter(configuration => !!configuration);
    }

    private async readJobConfigurationFile(jobConfigurationFileName: string): Promise<JobConfiguration> {
        const jobConfigFilePath = join(JOB_CONFIGURATIONS_FOLDER, jobConfigurationFileName);
        try {
            const fileContent = await this.fileSystemService.readFile(jobConfigFilePath, 'utf8');
            return JSON.parse(fileContent) as JobConfiguration;
            // tslint:disable-next-line:no-empty
        } catch (error) {
        }
    }

    private configurationFileNameFromJobId(jobId: string): string {
        return jobId + JOB_CONFIGURATION_FILE_EXTENSION;
    }
}
