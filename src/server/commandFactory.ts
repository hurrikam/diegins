'use strict';

import Command from './command';
import CancelJobCommand from './commands/cancelJobCommand';
import GetJobInfosCommand from './commands/getJobInfosCommand';
import GetJobConfigurationsCommand from './commands/getJobConfigurationsCommand';
import RunJobCommand from './commands/runJobCommand';
import { getJobRepository, getJobRunner } from './services';

export function createCommands(): Array<Command> {
    const jobRepository = getJobRepository();
    const jobRunner = getJobRunner();

    return [
        new CancelJobCommand(jobRunner),
        new GetJobInfosCommand(jobRunner),
        new GetJobConfigurationsCommand(jobRepository),
        new RunJobCommand(jobRepository, jobRunner)
    ];
}
