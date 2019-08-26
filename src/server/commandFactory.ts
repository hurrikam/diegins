'use strict';

import Command from './command';
import CancelJobCommand from './commands/cancelJobCommand';
import GetJobInfosCommand from './commands/getJobInfosCommand';
import GetJobConfigurationsCommand from './commands/getJobConfigurationsCommand';
import RunJobCommand from './commands/runJobCommand';
import SaveJobConfigurationsCommand from './commands/saveJobConfigurationCommand';
import { getJobConfigurationRepository, getJobRunner } from './services';

export function createCommands(): Array<Command> {
    const jobConfigurationRepository = getJobConfigurationRepository();
    const jobScheduler = getJobRunner();

    return [
        new CancelJobCommand(jobScheduler),
        new GetJobInfosCommand(jobScheduler),
        new GetJobConfigurationsCommand(jobConfigurationRepository),
        new RunJobCommand(jobConfigurationRepository, jobScheduler),
        new SaveJobConfigurationsCommand(jobConfigurationRepository)
    ];
}
