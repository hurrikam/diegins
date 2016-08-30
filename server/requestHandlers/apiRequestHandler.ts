import { IncomingMessage, ServerResponse } from 'http';
import { RequestHandler } from './requestHandler';

export class ApiRequestHandler implements RequestHandler {

    private hasApiPrefix(requestUrl: string): boolean {
        return (requestUrl.indexOf('api/') === 0);
    }

    public tryHandle(request: IncomingMessage, response: ServerResponse): boolean {
        if (!this.hasApiPrefix(request.url)) {
            return false;
        }
        return false;
    }
}