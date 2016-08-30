import { IncomingMessage, ServerResponse } from 'http';

export interface RequestHandler {

    tryHandle(request: IncomingMessage, response: ServerResponse): boolean;
}