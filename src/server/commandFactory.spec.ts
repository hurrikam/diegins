'use strict';

import CancelJobCommand from './commands/cancelJobCommand';
import GetJobConfigurationCommand from './commands/getJobConfigurationCommand';
import GetJobConfigurationsCommand from './commands/getJobConfigurationsCommand';
import GetJobInfosCommand from './commands/getJobInfosCommand';
import RunJobCommand from './commands/runJobCommand';
import SaveJobConfigurationsCommand from './commands/saveJobConfigurationCommand';

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
            expect(commands).toHaveLength(5);
            expect(commands[0] instanceof CancelJobCommand);
            expect(commands[1] instanceof GetJobConfigurationCommand);
            expect(commands[2] instanceof GetJobConfigurationsCommand);
            expect(commands[3] instanceof GetJobInfosCommand);
            expect(commands[4] instanceof RunJobCommand);
            expect(commands[5] instanceof SaveJobConfigurationsCommand);
        });
    });
});
