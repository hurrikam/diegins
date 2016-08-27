import * as http from 'http';
import * as server from './index';

export const MINIMUM_SERVER_PORT_NUMBER = 0;
export const MAXIMUM_SERVER_PORT_NUMBER = 65535;

export class Server {

    private httpServer: http.Server;
    private fileRequestHandler: server.FileRequestHandler;
    private requestUrlNormalizer: server.RequestUrlNormalizer;

    public constructor(private port: number) {
        if (port < MINIMUM_SERVER_PORT_NUMBER || port > MAXIMUM_SERVER_PORT_NUMBER) {
            throw new Error(`The 'port' parameter must be a value in the range (inclusive) ` +
                `${MINIMUM_SERVER_PORT_NUMBER} and ${MAXIMUM_SERVER_PORT_NUMBER}`);
        }
        this.fileRequestHandler = new server.FileRequestHandler();
        this.requestUrlNormalizer = new server.RequestUrlNormalizer();
    }

    private handleRequest(request: http.IncomingMessage, response: http.ServerResponse): void {
        let url = this.requestUrlNormalizer.normalize(request.url);
        if (this.fileRequestHandler.isFileRequest(url)) {
            this.fileRequestHandler.serveFile(url, response);
        }
    }

    public start(): void {
        this.httpServer = http.createServer((request, response) => {
            this.handleRequest(request, response);
        });
        this.httpServer.listen(this.port);
    }
}
