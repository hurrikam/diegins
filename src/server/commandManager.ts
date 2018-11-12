'use strict';

import { Application, Request, Response } from 'express';
import Command from './command';
import { DELETE, GET, POST } from './httpMethods';

export default class CommandManager {

    constructor(private readonly expressApp: Application) {
        if (!expressApp) {
            throw new Error('expressApp not specified');
        }
    }

    public registerCommand(command: Command): void {
        if (!command) {
            throw new Error('command not specified');
        }
        const requestHandler = (request: Request, response: Response) => command.execute(request, response);
        switch (command.method) {
            case DELETE:
                this.expressApp.delete(command.endpoint, requestHandler);
                break;
            case GET:
                this.expressApp.get(command.endpoint, requestHandler);
                break;
            case POST:
                this.expressApp.post(command.endpoint, requestHandler);
                break;
            default:
                throw new Error(`Command method ${command.method} not supported`);
        }
    }
}
