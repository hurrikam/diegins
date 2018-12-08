'use strict';

jest.mock('fs');

import JobConfigurationRepository from './jobConfigurationRepository';
import { join } from 'path';
import { JOB_CONFIGURATIONS_FOLDER, JOB_CONFIG_FILE_NAME } from './jobFileConstants';

function readdirSyncWithJobConfiguration(path: string): Array<String> {
    if (path === JOB_CONFIGURATIONS_FOLDER) {
        return ['test_job'];
    }
    return [];
}

function readFileSyncWithJobConfiguration(path: string) {
    const testJobConfigurationPath = join(JOB_CONFIGURATIONS_FOLDER, 'test_job', JOB_CONFIG_FILE_NAME);
    if (path === testJobConfigurationPath) {
        return '{ }';
    }
}

describe('JobConfigurationRepository', () => {

    afterAll(() => {
        jest.resetModules();
    });

    describe('initialize', () => {

        test('no job configurations are loaded if not called', () => {
            const fs = require('fs');
            fs.readdirSync = readdirSyncWithJobConfiguration;
            fs.readFileSync = readFileSyncWithJobConfiguration;
            const jobConfigurationRepository = new JobConfigurationRepository();
            expect(jobConfigurationRepository.jobConfigurations).toHaveLength(0);
        });

        test('throws an exception if called more than once', () => {
            const jobConfigurationRepository = new JobConfigurationRepository();
            jobConfigurationRepository.initialize();
            expect (() => jobConfigurationRepository.initialize())
                .toThrow(new Error('Job configuration repository already initialized'));
        });

        test('does not load any job configuration if none exists on file system', () => {
            const fs = require('fs');
            fs.readdirSync = () => new Array<String>();
            const jobConfigurationRepository = new JobConfigurationRepository();
            jobConfigurationRepository.initialize();
            expect(jobConfigurationRepository.jobConfigurations).toHaveLength(0);
        });

        test('loads all job configurations from file system', () => {
            const fs = require('fs');
            fs.readdirSync = readdirSyncWithJobConfiguration;
            fs.readFileSync = readFileSyncWithJobConfiguration;
            const jobConfigurationRepository = new JobConfigurationRepository();
            jobConfigurationRepository.initialize();
            expect(jobConfigurationRepository.jobConfigurations).toEqual([
                { id: 'test_job'}
            ]);
        });

        test('ignores configuration files missing on file system', () => {
            const fs = require('fs');
            fs.readdirSync = readdirSyncWithJobConfiguration;
            fs.readFileSync = () => {
                throw new Error('file not found');
            };
            const jobConfigurationRepository = new JobConfigurationRepository();
            jobConfigurationRepository.initialize();
            expect(jobConfigurationRepository.jobConfigurations).toHaveLength(0);
        });
    });
});
