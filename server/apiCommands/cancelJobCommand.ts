import { IncomingMessage, ServerResponse } from 'http';
import * as url from 'url';
import * as querystring from 'querystring';
import { ApiCommand } from './apiCommand';
import { Endpoints } from '../../common/api/endpoints';
import { MimeTypes } from '../mimeTypes';
import { JobRunner, getJobRunner } from '../jobs';
import { CancelJobCommandParameters } from '../../common/api/commandsParameters';

export class CancelJobCommand implements ApiCommand {

    private readonly jobRunner: JobRunner;

    public constructor() {
        this.jobRunner = getJobRunner();
    }

    public get endpoint(): string {
        return Endpoints.CANCEL_JOB;
    }

    public execute(request: IncomingMessage, response: ServerResponse): void {
        let parsedUrl = url.parse(request.url);
        let parameters = <CancelJobCommandParameters>querystring.parse(parsedUrl.query);
        this.jobRunner.cancelJob(parameters.id, parameters.number);
    }
}
