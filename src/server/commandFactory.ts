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
import {
    getJobConfigurationRepository,
    getJobLogReader,
    getJobScheduler,
    getJobStepRepository
} from './services';

export function createCommands(): Array<Command> {
    const jobConfigurationRepository = getJobConfigurationRepository();
    const jobLogReader = getJobLogReader();
    const jobScheduler = getJobScheduler();
    const jobStepRepository = getJobStepRepository();
    return [
        new CancelJobCommand(jobScheduler),
        new CreateJobConfigurationCommand(jobConfigurationRepository),
        new GetJobConfigurationCommand(jobConfigurationRepository),
        new GetJobConfigurationsCommand(jobConfigurationRepository),
        new GetJobLogCommand(jobLogReader),
        new GetJobInfoCommand(jobScheduler),
        new GetJobInfosCommand(jobScheduler),
        new GetJobStepIdsCommand(jobStepRepository),
        new RunJobCommand(jobConfigurationRepository, jobScheduler),
        new UpdateJobConfigurationCommand(jobConfigurationRepository)
    ];
}
