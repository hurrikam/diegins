import { IncomingMessage, ServerResponse } from 'http';
import { ApiCommand } from './apiCommand';
import { Endpoints } from '../../common/api/endpoints';
import { MimeTypes } from '../mimeTypes';

export class GetJobsCommand implements ApiCommand {

    public get endpoint(): string {
        return Endpoints.GET_JOBS;
    }

    public execute(request: IncomingMessage, response: ServerResponse): void {
        response.setHeader('Content-Type', MimeTypes.APPLICATION_JSON);
        response.end(JSON.stringify([
            { id: 'job_1', displayName: 'Job 1' },
            { id: 'job_2', displayName: 'Job 2' },
            { id: 'job_3', displayName: 'Job 3' }
        ]));
    }
}