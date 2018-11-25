'use strict';

import CancelJobCommand from './commands/cancelJobCommand';
import GetJobInfosCommand from './commands/getJobInfosCommand';
import GetJobConfigurationsCommand from './commands/getJobConfigurationsCommand';
import RunJobCommand from './commands/runJobCommand';

describe('commandFactory', () => {

    beforeAll(() => {
        jest.mock('./services', () => ({
            getJobConfigurationRepository: () => ({}),
            getJobRunner: () => ({})
        }));
    });

    afterAll(() => jest.resetModules());

    describe('createCommands', () => {

        test('should return an array containing expected commands', () => {
            const { createCommands } = require('./commandFactory');
            const commands = createCommands();
            expect(commands).toHaveLength(4);
            expect(commands[0] instanceof CancelJobCommand).toBeTruthy();
            expect(commands[1] instanceof GetJobInfosCommand).toBeTruthy();
            expect(commands[2] instanceof GetJobConfigurationsCommand).toBeTruthy();
            expect(commands[3] instanceof RunJobCommand).toBeTruthy();
        });
    });
});
