'use strict';

import Command from './command';
import CancelJobCommand from './commands/cancelJobCommand';
import CreateJobConfigurationCommand from './commands/createJobConfigurationCommand';
import GetJobConfigurationCommand from './commands/getJobConfigurationCommand';
import GetJobConfigurationsCommand from './commands/getJobConfigurationsCommand';
import GetJobInfoCommand from './commands/getJobInfoCommand';
import GetJobInfosCommand from './commands/getJobInfosCommand';
import GetJobLogCommand from './commands/getJobLogCommand';
import GetJobStepIdsCommand from './commands/getJobStepIdsCommand';
import RunJobCommand from './commands/runJobCommand';
import UpdateJobConfigurationCommand from './commands/updateJobConfigurationCommand';

describe('commandFactory', () => {

    beforeAll(() => {
        jest.mock('./services', () => ({
            getJobConfigurationRepository: () => ({}),
            getJobLogReader: () => ({}),
            getJobRunner: () => ({}),
            getJobScheduler: () => ({}),
            getJobStepRepository: () => ({})
        }));
    });

    afterAll(() => jest.resetModules());

    describe('createCommands', () => {

        test('returns an array containing expected commands', () => {
            const { createCommands } = require('./commandFactory');
            const commands = createCommands();
            const expectedCommandTypes = [
                CancelJobCommand,
                CreateJobConfigurationCommand,
                GetJobConfigurationCommand,
                GetJobConfigurationsCommand,
                GetJobInfosCommand,
                GetJobInfoCommand,
                GetJobLogCommand,
                GetJobStepIdsCommand,
                RunJobCommand,
                UpdateJobConfigurationCommand
            ];
            expect(commands).toHaveLength(expectedCommandTypes.length);
            commands.forEach((testCommand: Command, index: number) =>
                testCommand instanceof expectedCommandTypes[index]);
        });
    });
});
