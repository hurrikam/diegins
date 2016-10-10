import { IncomingMessage, ServerResponse } from 'http';
import { ApiCommand } from './apiCommand';
import { Endpoints } from '../../common/api/endpoints';
import { MimeTypes } from '../mimeTypes';
import { JobRunner, getJobRunner } from '../jobs';

export class GetRunningJobsCommand implements ApiCommand {

    private jobRunner: JobRunner;

    public constructor() {
        this.jobRunner = getJobRunner();
    }

    public get endpoint(): string {
        return Endpoints.GET_RUNNING_JOBS;
    }

    public execute(request: IncomingMessage, response: ServerResponse): void {
        response.setHeader('Content-Type', MimeTypes.APPLICATION_JSON);
        let jobsData = JSON.stringify(this.jobRunner.getRunningJobInfos());
        response.end(jobsData);
    }
}