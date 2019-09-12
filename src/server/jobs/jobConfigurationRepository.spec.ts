'use strict';

jest.mock('fs');

import JobConfigurationRepository from './jobConfigurationRepository';
import { join } from 'path';
import { JOB_CONFIGURATIONS_FOLDER } from './jobFileConstants';
import FileSystemService from '../services/fileSystemService';

function readdirSyncWithJobConfiguration(path: string): Array<String> {
    if (path === JOB_CONFIGURATIONS_FOLDER) {
        return ['test_job.json'];
    }
    return [];
}

function readFileSyncWithJobConfiguration(path: string): string {
    const testJobConfigurationPath = join(JOB_CONFIGURATIONS_FOLDER, 'test_job.json');
    if (path === testJobConfigurationPath) {
        return '{"id": "test_job"}';
    }
}

function createMockFileSystemService(): FileSystemService {
    return {
        mkdir: jest.fn((path: string, options: {}) => {
            if (path === JOB_CONFIGURATIONS_FOLDER) {
                return Promise.resolve();
            }
            return Promise.reject('Error while creating the test job folder');
        }),
        readdir: jest.fn((path: string, options: {}) => {
            if (path === JOB_CONFIGURATIONS_FOLDER) {
                return Promise.resolve(['test_job.json']);
            }
            return Promise.reject('No such a folder found');
        }),
        readFile: jest.fn((path: string) => {
            const testJobConfigurationPath = join(JOB_CONFIGURATIONS_FOLDER, 'test_job.json');
            if (path === testJobConfigurationPath) {
                return Promise.resolve('{"id": "test_job"}');
            }
            return Promise.reject('No such a file found');
        })
    };
}

describe('JobConfigurationRepository', () => {

    afterAll(() => {
        jest.resetModules();
    });

    describe('initialize', () => {

        test('no job configurations are loaded if not called', () => {
            const fs = createMockFileSystemService();
            const jobConfigurationRepository = new JobConfigurationRepository(fs);
            expect(jobConfigurationRepository.jobConfigurations).toHaveLength(0);
        });

        test('throws an exception if called more than once', async () => {
            const fs = createMockFileSystemService();
            const jobConfigurationRepository = new JobConfigurationRepository(fs);
            await jobConfigurationRepository.initialize();
            await expect(jobConfigurationRepository.initialize())
                .rejects.toEqual(new Error('Job configuration repository already initialized'));
        });

        test('does not load any job configuration if none exists on file system', () => {
            const fs = createMockFileSystemService();
            // fs.readdirSync = () => new Array<String>();
            const jobConfigurationRepository = new JobConfigurationRepository(fs);
            jobConfigurationRepository.initialize();
            expect(jobConfigurationRepository.jobConfigurations).toHaveLength(0);
        });

        test('loads all job configurations from file system', async () => {
            const fs = createMockFileSystemService();
            const jobConfigurationRepository = new JobConfigurationRepository(fs);
            await jobConfigurationRepository.initialize();
            expect(jobConfigurationRepository.jobConfigurations).toEqual([
                { id: 'test_job'}
            ]);
        });

        test('ignores configuration files missing on file system', () => {
            const fs = createMockFileSystemService();
            // fs.readdirSync = readdirSyncWithJobConfiguration;
            // fs.readFileSync = () => {
            //     throw new Error('file not found');
            // };
            const jobConfigurationRepository = new JobConfigurationRepository(fs);
            jobConfigurationRepository.initialize();
            expect(jobConfigurationRepository.jobConfigurations).toHaveLength(0);
        });
    });
});
