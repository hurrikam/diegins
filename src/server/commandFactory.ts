'use strict';

import Command from './command';
import CancelJobCommand from './commands/cancelJobCommand';
import GetJobConfigurationCommand from './commands/getJobConfigurationCommand';
import GetJobConfigurationsCommand from './commands/getJobConfigurationsCommand';
import GetJobInfosCommand from './commands/getJobInfosCommand';
import RunJobCommand from './commands/runJobCommand';
import SaveJobConfigurationsCommand from './commands/saveJobConfigurationCommand';
import { getJobConfigurationRepository, getJobRunner } from './services';

export function createCommands(): Array<Command> {
    const jobConfigurationRepository = getJobConfigurationRepository();
    const jobScheduler = getJobRunner();

    return [
        new CancelJobCommand(jobScheduler),
        new GetJobConfigurationCommand(jobConfigurationRepository),
        new GetJobConfigurationsCommand(jobConfigurationRepository),
        new GetJobInfosCommand(jobScheduler),
        new RunJobCommand(jobConfigurationRepository, jobScheduler),
        new SaveJobConfigurationsCommand(jobConfigurationRepository)
    ];
}
