import { IncomingMessage, ServerResponse } from 'http';
import { ApiCommand } from './apiCommand';
import { Endpoints } from '../../common/api/endpoints';
import { MimeTypes } from '../mimeTypes';
import { getJobRunner, JobRunner } from '../jobs';

export class GetJobInstanceInfosCommand implements ApiCommand {

    private jobRunner: JobRunner;

    public constructor() {
        this.jobRunner = getJobRunner();
    }

    public get endpoint(): string {
        return Endpoints.GET_JOB_INSTANCE_INFOS;
    }

    public execute(request: IncomingMessage, response: ServerResponse): void {
        response.setHeader('Content-Type', MimeTypes.APPLICATION_JSON);
        const jobInstanceInfos = this.jobRunner.getRunningJobInfos();
        const jobsData = JSON.stringify(jobInstanceInfos);
        response.end(jobsData);
    }
}