'use strict';

import Command from './command';
import CancelJobCommand from './commands/cancelJobCommand';
import CreateJobConfigurationCommand from './commands/createJobConfigurationCommand';
import GetJobConfigurationCommand from './commands/getJobConfigurationCommand';
import GetJobConfigurationsCommand from './commands/getJobConfigurationsCommand';
import GetJobInfosCommand from './commands/getJobInfosCommand';
import RunJobCommand from './commands/runJobCommand';
import UpdateJobConfigurationCommand from './commands/updateJobConfigurationCommand';
import { getJobConfigurationRepository, getJobRunner } from './services';

export function createCommands(): Array<Command> {
    const jobConfigurationRepository = getJobConfigurationRepository();
    const jobScheduler = getJobRunner();
    return [
        new CancelJobCommand(jobScheduler),
        new CreateJobConfigurationCommand(jobConfigurationRepository),
        new GetJobConfigurationCommand(jobConfigurationRepository),
        new GetJobConfigurationsCommand(jobConfigurationRepository),
        new GetJobInfosCommand(jobScheduler),
        new RunJobCommand(jobConfigurationRepository, jobScheduler),
        new UpdateJobConfigurationCommand(jobConfigurationRepository)
    ];
}
