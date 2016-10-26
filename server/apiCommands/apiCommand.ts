import { IncomingMessage, ServerResponse } from 'http';

export interface ApiCommand {

    endpoint: string;

    execute(request: IncomingMessage, response: ServerResponse);
}