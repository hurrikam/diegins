'use strict';

import CancelJobCommand from './commands/cancelJobCommand';
import CreateJobConfigurationCommand from './commands/createJobConfigurationCommand';
import GetJobConfigurationCommand from './commands/getJobConfigurationCommand';
import GetJobConfigurationsCommand from './commands/getJobConfigurationsCommand';
import GetJobInfosCommand from './commands/getJobInfosCommand';
import RunJobCommand from './commands/runJobCommand';
import UpdateJobConfigurationCommand from './commands/updateJobConfigurationCommand';

describe('commandFactory', () => {

    beforeAll(() => {
        jest.mock('./services', () => ({
            getJobConfigurationRepository: () => ({}),
            getJobRunner: () => ({})
        }));
    });

    afterAll(() => jest.resetModules());

    describe('createCommands', () => {

        test('returns an array containing expected commands', () => {
            const { createCommands } = require('./commandFactory');
            const commands = createCommands();
            expect(commands).toHaveLength(7);
            expect(commands[0] instanceof CancelJobCommand);
            expect(commands[1] instanceof CreateJobConfigurationCommand);
            expect(commands[2] instanceof GetJobConfigurationCommand);
            expect(commands[3] instanceof GetJobConfigurationsCommand);
            expect(commands[4] instanceof GetJobInfosCommand);
            expect(commands[5] instanceof RunJobCommand);
            expect(commands[6] instanceof UpdateJobConfigurationCommand);
        });
    });
});
