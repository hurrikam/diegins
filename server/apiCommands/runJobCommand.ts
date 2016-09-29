import { IncomingMessage, ServerResponse } from 'http';
import { ApiCommand } from './apiCommand';
import { Endpoints } from '../../common/api/endpoints';
import { MimeTypes } from '../mimeTypes';
import { JobRepository, getJobRepository } from '../jobs';

export class RunJobCommand implements ApiCommand {

    private jobRepository: JobRepository;

    public constructor() {
        this.jobRepository = getJobRepository();
    }

    public get endpoint(): string {
        return Endpoints.RUN_JOB
    }

    public execute(request: IncomingMessage, response: ServerResponse): void {
    }
}
