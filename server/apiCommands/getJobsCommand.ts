import { IncomingMessage, ServerResponse } from 'http';
import { ApiCommand } from './apiCommand';
import { Endpoints } from '../../common/api/endpoints';
import { MimeTypes } from '../mimeTypes';
import { JobRepository, getJobRepository } from '../jobs';

export class GetJobsCommand implements ApiCommand {

    private jobRepository: JobRepository;

    public constructor() {
        this.jobRepository = getJobRepository();
    }

    public get endpoint(): string {
        return Endpoints.GET_JOBS;
    }

    public execute(request: IncomingMessage, response: ServerResponse): void {
        response.setHeader('Content-Type', MimeTypes.APPLICATION_JSON);
        let jobsData = JSON.stringify(this.jobRepository.jobs);
        response.end(jobsData);
    }
}