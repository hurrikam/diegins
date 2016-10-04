import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { RequestHandler } from './requestHandler';
import { StringUtils } from '../../common/stringUtils';
import { Endpoints } from '../../common/api/endpoints';
import * as commands from '../apiCommands';

export class ApiRequestHandler implements RequestHandler {

    private readonly commands: commands.ApiCommand[] = [
        new commands.GetJobsCommand(),
        new commands.RunJobCommand()
    ];

    public tryHandle(request: IncomingMessage, response: ServerResponse): boolean {
        let parsedUrl = parse(request.url);
        let urlPathname = parsedUrl.pathname;
        if (!this.hasApiPrefix(urlPathname)) {
            return false;
        }
        let commandFound = this.findMatchingCommand(urlPathname);
        if (!commandFound) {
            return false;
        }
        commandFound.execute(request, response);
        return true;
    }

    private hasApiPrefix(urlPathname: string): boolean {
        return urlPathname.startsWith(Endpoints.API_ENDPOINT_PREFIX);
    }

    private findMatchingCommand(url: string): commands.ApiCommand {
        let apiUrlPart = url.substr(Endpoints.API_ENDPOINT_PREFIX.length);
        let matchingCommand = this.commands.find((command) => {
            return apiUrlPart.startsWith(command.endpoint);
        });
        return matchingCommand;
    }
}