import { IncomingMessage, ServerResponse } from 'http';

export interface ApiCommand {

    endpoint: string;

    execute(IncomingMessage, response: ServerResponse);
}