import { IncomingMessage, ServerResponse } from 'http';
import { RequestHandler } from './requestHandler';
import { StringUtils } from '../../common/stringUtils';
import { GetJobsCommand } from '../apiCommands/getJobsCommand';

export class ApiRequestHandler implements RequestHandler {

    private hasApiPrefix(requestUrl: string): boolean {
        return StringUtils.startsWith(requestUrl, '/api/');
    }

    public tryHandle(request: IncomingMessage, response: ServerResponse): boolean {
        if (!this.hasApiPrefix(request.url)) {
            return false;
        }
        new GetJobsCommand().execute(request, response);
        return true;
    }
}