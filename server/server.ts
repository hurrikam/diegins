import * as http from 'http';
import * as server from './index';
import * as requestHandlers from './requestHandlers/index';

export const MINIMUM_SERVER_PORT_NUMBER = 0;
export const MAXIMUM_SERVER_PORT_NUMBER = 65535;

export class Server {

    private httpServer: http.Server;
    private requestHandlers: Array<requestHandlers.RequestHandler>;

    public constructor(private port: number) {
        if (port < MINIMUM_SERVER_PORT_NUMBER || port > MAXIMUM_SERVER_PORT_NUMBER) {
            throw new Error(`The 'port' parameter must be a value in the range (inclusive) ` +
                `${MINIMUM_SERVER_PORT_NUMBER} and ${MAXIMUM_SERVER_PORT_NUMBER}`);
        }
        this.requestHandlers = [
            new requestHandlers.ApiRequestHandler(),
            new requestHandlers.FileRequestHandler()
        ];
    }

    private handleRequest(request: http.IncomingMessage, response: http.ServerResponse): void {
        this.requestHandlers.some((handler) => {
            return handler.tryHandle(request, response);
        });
    }

    public start(): void {
        this.httpServer = http.createServer((request, response) => {
            this.handleRequest(request, response);
        });
        this.httpServer.listen(this.port);
    }
}
